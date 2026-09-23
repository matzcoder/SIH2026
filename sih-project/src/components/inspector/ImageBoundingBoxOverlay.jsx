import React, { useState, useRef, useEffect } from 'react';
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
  const [naturalDimensions, setNaturalDimensions] = useState({ width: 800, height: 600 });
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  const handleImageLoad = (e) => {
    if (e.target.naturalWidth && e.target.naturalHeight) {
      setNaturalDimensions({
        width: e.target.naturalWidth,
        height: e.target.naturalHeight,
      });
      setImageError(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setNaturalDimensions({ width: 800, height: 600 });
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
      const nw = naturalDimensions.width || 800;
      const nh = naturalDimensions.height || 600;
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

  const isUsingFallback = imageError || !imageUrl;

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
          style={{
            transform: `scale(${zoomLevel})`,
            aspectRatio: `${naturalDimensions.width} / ${naturalDimensions.height}`,
          }}
        >
          {/* Main Inspection Image or Fallback Label Packaging Canvas */}
          {!isUsingFallback ? (
            <img
              ref={imgRef}
              src={imageUrl}
              alt="Packaged Commodity Label Under Inspection"
              onLoad={handleImageLoad}
              onError={handleImageError}
              className="overlay-main-image"
            />
          ) : (
            <svg
              viewBox="0 0 800 600"
              className="overlay-main-image overlay-mockup-svg"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <pattern id="dotPattern" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1" fill="#E4CBB4" opacity="0.6" />
                </pattern>
                <linearGradient id="headerGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#C1502D" />
                  <stop offset="100%" stopColor="#B7410E" />
                </linearGradient>
              </defs>

              {/* Package carton background */}
              <rect x="0" y="0" width="800" height="600" rx="14" fill="#FAF2EA" stroke="#DFC4AB" strokeWidth="2" />
              <rect x="8" y="8" width="784" height="584" rx="10" fill="url(#dotPattern)" opacity="0.4" />
              <rect x="16" y="16" width="768" height="568" rx="8" fill="#FFFDF9" stroke="#E4CBB4" strokeWidth="1.2" strokeDasharray="6 4" />

              {/* Header Ribbon */}
              <rect x="16" y="16" width="768" height="42" rx="8" fill="url(#headerGrad)" />
              <rect x="16" y="38" width="768" height="20" fill="url(#headerGrad)" />
              <text x="400" y="42" textAnchor="middle" fill="#FFF9F2" fontSize="13" fontWeight="800" letterSpacing="1.2" fontFamily="system-ui, sans-serif">
                OFFICIAL INSPECTION SAMPLE • STATUTORY COMPLIANCE PANEL (PCR 2011)
              </text>

              {/* PDP Title & Act reference */}
              <text x="36" y="86" fill="#3B2A22" fontSize="18" fontWeight="800" fontFamily="system-ui, sans-serif">
                PRINCIPAL STATUTORY DECLARATION PANEL
              </text>
              <text x="36" y="102" fill="#7A5C48" fontSize="10.5" fontWeight="600" fontFamily="system-ui, sans-serif">
                LEGAL METROLOGY ACT, 2009 • PACKAGED COMMODITIES RULES, 2011 • FSSAI ACT
              </text>

              {/* Dynamic statutory zones corresponding to detected rules */}
              {validDetections.map((d, i) => {
                const bbox = normalizeBBox(d);
                const bx = (bbox.x / 100) * 800;
                const by = (bbox.y / 100) * 600;
                const bw = (bbox.width / 100) * 800;
                const bh = (bbox.height / 100) * 600;
                const isVeg = d.dietaryType === 'VEG' || /veg\b/i.test(d.extractedText || d.value || '');
                const isNonVeg = d.dietaryType === 'NON_VEG' || /non[ -]?veg/i.test(d.extractedText || d.value || '');

                return (
                  <g key={`mock-${d.id || d.ruleId || i}`}>
                    <rect
                      x={bx}
                      y={by}
                      width={bw}
                      height={bh}
                      rx="6"
                      fill="#FAF2EA"
                      stroke="#E4CBB4"
                      strokeWidth="1"
                    />
                    {/* Field label */}
                    <text
                      x={bx + 8}
                      y={by + Math.min(14, bh / 2)}
                      fill="#8A6D57"
                      fontSize="9"
                      fontWeight="700"
                      letterSpacing="0.3"
                      fontFamily="system-ui, sans-serif"
                    >
                      {String(d.label || d.ruleName || 'DECLARATION').toUpperCase()}
                    </text>
                    {/* Field value */}
                    <text
                      x={bx + 8}
                      y={by + Math.min(bh - 8, 30)}
                      fill="#3B2A22"
                      fontSize={bh < 40 ? '10.5' : '12'}
                      fontWeight="700"
                      fontFamily="'JetBrains Mono', monospace"
                    >
                      {String(d.value || d.extractedText || 'Verified')}
                    </text>
                    {/* Dietary emblem graphic if applicable */}
                    {isVeg && (
                      <g transform={`translate(${bx + bw - 28}, ${by + (bh - 20) / 2})`}>
                        <rect width="20" height="20" rx="3" fill="#FFF9F2" stroke="#7A8450" strokeWidth="1.8" />
                        <circle cx="10" cy="10" r="5" fill="#7A8450" />
                      </g>
                    )}
                    {isNonVeg && (
                      <g transform={`translate(${bx + bw - 28}, ${by + (bh - 20) / 2})`}>
                        <rect width="20" height="20" rx="3" fill="#FFF9F2" stroke="#A63A32" strokeWidth="1.8" />
                        <polygon points="10,5 5,15 15,15" fill="#A63A32" />
                      </g>
                    )}
                  </g>
                );
              })}

              {/* Barcode representation in corner if space allows */}
              <g transform="translate(680, 525)" opacity="0.7">
                {[0, 4, 7, 12, 15, 18, 24, 28, 31, 36, 42, 45, 50, 56, 60, 64, 70].map((bx, bidx) => (
                  <line key={bidx} x1={bx} y1="0" x2={bx} y2="28" stroke="#3B2A22" strokeWidth={bidx % 3 === 0 ? 3 : 1.5} />
                ))}
                <text x="35" y="38" textAnchor="middle" fill="#7A5C48" fontSize="7" fontFamily="'JetBrains Mono', monospace">
                  8901058852331
                </text>
              </g>

              {/* Regulatory watermark footer */}
              <text x="400" y="574" textAnchor="middle" fill="#8A6D57" fontSize="9" fontWeight="600" fontFamily="system-ui, sans-serif">
                LM-Vision AI Verification Engine • Real-time OCR Telemetry Grid
              </text>
            </svg>
          )}

          {/* ── Bounding Box Overlays ── */}
          {validDetections.map((item, idx) => {
            const isSelected =
              activeRuleId === (item.ruleId || item.ruleCode || item.id) ||
              hoveredIndex === idx;
            const bbox = normalizeBBox(item);
            const statusClass = (item.status || 'warning').toLowerCase();
            const isNearTop = bbox.y < 12;

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
                } ${isNearTop ? 'near-top' : ''}`}
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
                  <span>
                    {item.label || item.ruleName || 'Declaration'}
                  </span>
                  {(isSelected || hoveredIndex === idx) && (item.value || item.extractedText) && (
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
        <span className="text-[10px] text-[#7A5C48] font-mono">
          Zoom: {Math.round(zoomLevel * 100)}%
        </span>
      </div>
    </div>
  );
}
