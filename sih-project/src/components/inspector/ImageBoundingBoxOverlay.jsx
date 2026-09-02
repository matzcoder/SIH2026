import React, { useState, useRef } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Target,
} from 'lucide-react';
import VegNonVegBadge from '../common/VegNonVegBadge';
import './ImageBoundingBoxOverlay.css';

export default function ImageBoundingBoxOverlay({
  imageUrl,
  detections = [],
  activeRuleId,
  onSelectDetection,
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);

  const handleImageLoad = (e) => {
    setNaturalDimensions({
      width: e.target.naturalWidth || 1,
      height: e.target.naturalHeight || 1,
    });
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(2, +(z + 0.2).toFixed(1)));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(0.8, +(z - 0.2).toFixed(1)));
  const handleResetZoom = () => setZoomLevel(1);

  const normalizeBBox = (item) => {
    if (item.bbox && typeof item.bbox === 'object') {
      const { x = 0, y = 0, width = 0, height = 0 } = item.bbox;
      return { x, y, width, height };
    }
    if (Array.isArray(item.box) && item.box.length === 4) {
      const [top, left, bottom, right] = item.box;
      const nw = naturalDimensions.width || 1;
      const nh = naturalDimensions.height || 1;
      return {
        x: (left / nw) * 100,
        y: (top / nh) * 100,
        width: ((right - left) / nw) * 100,
        height: ((bottom - top) / nh) * 100,
      };
    }
    return { x: 0, y: 0, width: 0, height: 0 };
  };

  const validDetections = detections.filter((item) => {
    const bbox = normalizeBBox(item);
    return bbox.width > 0 && bbox.height > 0;
  });

  return (
    <div className="overlay-container">
      {/* ── TOP HUD TELEMETRY BAR ── */}
      <div className="overlay-hud-bar">
        <div className="hud-telemetry-group">
          <span className="hud-status-chip">
            <span className="hud-pulse-dot" />
            <span>AI OCR INSPECT</span>
          </span>
          <span className="hud-detections-counter">
            {validDetections.length} Statutory Regions Detected
          </span>
        </div>

        <div className="overlay-toolbar">
          <button
            type="button"
            className="overlay-tool-btn"
            onClick={handleZoomIn}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button
            type="button"
            className="overlay-tool-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button
            type="button"
            className="overlay-tool-btn"
            onClick={handleResetZoom}
            title="Reset Zoom"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      </div>

      {/* ── IMAGE VIEWPORT & BOUNDING BOXES ── */}
      <div className="overlay-viewport">
        <div
          className="overlay-image-wrapper"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <img
            ref={imgRef}
            src={
              imageUrl ||
              'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=1200&q=80'
            }
            alt="Packaged Commodity Label Under Inspection"
            onLoad={handleImageLoad}
            className="overlay-main-image"
          />

          {validDetections.map((item, idx) => {
            const isSelected =
              activeRuleId === (item.ruleId || item.ruleCode || item.id) ||
              hoveredIndex === idx;
            const bbox = normalizeBBox(item);
            const statusClass = (item.status || 'warning').toLowerCase();

            return (
              <div
                key={item.id || item.ruleId || idx}
                onClick={() => onSelectDetection && onSelectDetection(item)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  left: `${bbox.x}%`,
                  top: `${bbox.y}%`,
                  width: `${bbox.width}%`,
                  height: `${bbox.height}%`,
                }}
                className={`bbox-rect ${statusClass} ${
                  isSelected ? 'is-active' : ''
                }`}
                title={`Click to inspect rule: ${item.label || item.ruleName}`}
              >
                {/* Active HUD Corner Crosshairs */}
                {isSelected && (
                  <>
                    <span className="bbox-corner tl" />
                    <span className="bbox-corner tr" />
                    <span className="bbox-corner bl" />
                    <span className="bbox-corner br" />
                  </>
                )}

                {/* Pinned Label Badge */}
                <div className={`bbox-pinned-badge ${statusClass}`}>
                  {item.dietaryType && (
                    <VegNonVegBadge
                      type={item.dietaryType}
                      size="sm"
                      showLabel={false}
                    />
                  )}
                  <span>{item.label || item.ruleName || 'Declaration'}</span>
                  {(item.value || item.extractedText) && (
                    <span className="bbox-badge-val">
                      {item.value || item.extractedText}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── BOTTOM HINT & TELEMETRY STRIP ── */}
      <div className="overlay-hint-bar">
        <span className="hint-interactive">
          <Target size={13} />
          <span>Click any bounding box above to focus statutory rule</span>
        </span>
        <span className="text-[10px] text-slate-400 font-mono">
          Zoom: {Math.round(zoomLevel * 100)}%
        </span>
      </div>
    </div>
  );
}
