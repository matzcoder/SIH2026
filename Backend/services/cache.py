"""
In-memory LRU cache for OCR and vision extraction results.

Caches expensive OCR and barcode analysis by SHA-256 hash of image bytes,
preventing redundant processing when identical images are scanned.
"""
from __future__ import annotations

import hashlib
import logging
import threading
import time
from collections import OrderedDict
from typing import Any, Optional, Tuple

logger = logging.getLogger(__name__)

_DEFAULT_MAX_ENTRIES = 128
_DEFAULT_TTL_SECONDS = 3600  # 1 hour


class VisionCache:
    """Thread-safe LRU cache for OCR and barcode analysis results."""

    def __init__(self, max_entries: int = _DEFAULT_MAX_ENTRIES, ttl_seconds: int = _DEFAULT_TTL_SECONDS):
        self._max_entries = max_entries
        self._ttl_seconds = ttl_seconds
        self._lock = threading.Lock()
        self._cache: OrderedDict[str, Tuple[float, Any]] = OrderedDict()
        self._hits = 0
        self._misses = 0

    @staticmethod
    def compute_hash(image_bytes: bytes) -> str:
        """Compute SHA-256 digest of raw image bytes."""
        return hashlib.sha256(image_bytes).hexdigest()

    def get(self, image_hash: str) -> Optional[Any]:
        """Retrieve cached result if present and not expired."""
        with self._lock:
            if image_hash not in self._cache:
                self._misses += 1
                return None

            timestamp, data = self._cache[image_hash]
            if time.time() - timestamp > self._ttl_seconds:
                # Expired
                del self._cache[image_hash]
                self._misses += 1
                return None

            # Move to end (most recently used)
            self._cache.move_to_end(image_hash)
            self._hits += 1
            logger.debug("VisionCache HIT for hash %s (hits=%d, misses=%d)", image_hash[:12], self._hits, self._misses)
            return data

    def put(self, image_hash: str, data: Any) -> None:
        """Store result in cache, evicting oldest item if capacity is exceeded."""
        with self._lock:
            if image_hash in self._cache:
                self._cache.move_to_end(image_hash)
            self._cache[image_hash] = (time.time(), data)

            # Evict LRU if over capacity
            while len(self._cache) > self._max_entries:
                self._cache.popitem(last=False)

    def stats(self) -> dict[str, Any]:
        """Return cache statistics."""
        with self._lock:
            return {
                "size": len(self._cache),
                "max_entries": self._max_entries,
                "hits": self._hits,
                "misses": self._misses,
                "hit_ratio": round(self._hits / (self._hits + self._misses), 3) if (self._hits + self._misses) > 0 else 0.0,
            }

    def clear(self) -> None:
        """Clear all cached entries."""
        with self._lock:
            self._cache.clear()
            self._hits = 0
            self._misses = 0


# Global singleton instance
vision_cache = VisionCache()
