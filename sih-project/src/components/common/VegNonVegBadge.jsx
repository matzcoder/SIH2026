import React from 'react';

/**
 * Renders the statutory FSSAI Vegetarian (Green Dot) or
 * Non-Vegetarian (Brown Triangle) Emblem as required under:
 *   - FSSAI Food Safety and Standards (Labelling & Display) Regulations 2020 – Reg. 2.2.2
 *   - Legal Metrology (Packaged Commodities) Rules 2011 – Rule 6
 *
 * @param {'VEG' | 'NON_VEG' | 'NON_FOOD' | 'UNKNOWN' | boolean} type
 * @param {'sm' | 'md' | 'lg'} size
 * @param {boolean} showLabel
 */
export default function VegNonVegBadge({ type = 'VEG', size = 'md', showLabel = true }) {
  const pixelConfig = {
    sm: { boxPx: 16, innerPx: 8, fontSize: '11px', borderWidth: '1.5px' },
    md: { boxPx: 20, innerPx: 10, fontSize: '12px', borderWidth: '2px' },
    lg: { boxPx: 26, innerPx: 14, fontSize: '14px', borderWidth: '2px' },
  };

  const cfg = pixelConfig[size] || pixelConfig.md;

  // Normalize type across booleans, lowercase, and formatting variants
  let normType = 'UNKNOWN';
  if (typeof type === 'boolean') {
    normType = type ? 'VEG' : 'NON_VEG';
  } else if (typeof type === 'string') {
    const s = type.trim().toUpperCase().replace(/[-\s]/g, '_');
    if (s === 'VEG' || s === 'VEGETARIAN' || s === 'GREEN_DOT' || s === 'GREEN') {
      normType = 'VEG';
    } else if (s === 'NON_VEG' || s === 'NON_VEGETARIAN' || s === 'NONVEG' || s === 'BROWN_TRIANGLE' || s === 'BROWN') {
      normType = 'NON_VEG';
    } else if (s === 'NON_FOOD' || s === 'NONFOOD' || s === 'EXEMPT' || s === 'NA' || s === 'N_A') {
      normType = 'NON_FOOD';
    }
  }

  /* ── Vegetarian: Green Dot inside Green Square Border ── */
  if (normType === 'VEG') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          verticalAlign: 'middle',
          lineHeight: 1,
        }}
        title="Statutory Vegetarian Declaration (FSSAI 2.2.2 / LM-RULE-006)"
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${cfg.boxPx}px`,
            height: `${cfg.boxPx}px`,
            minWidth: `${cfg.boxPx}px`,
            borderRadius: '2px',
            border: `${cfg.borderWidth} solid #16a34a`,
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              display: 'block',
              width: `${cfg.innerPx}px`,
              height: `${cfg.innerPx}px`,
              borderRadius: '50%',
              backgroundColor: '#16a34a',
            }}
          />
        </span>
        {showLabel && (
          <span
            style={{
              fontSize: cfg.fontSize,
              fontWeight: 700,
              color: '#16a34a',
              letterSpacing: '0.01em',
            }}
          >
            Vegetarian
          </span>
        )}
      </span>
    );
  }

  /* ── Non-Vegetarian: Brown Triangle inside Brown Square Border ── */
  if (normType === 'NON_VEG') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          verticalAlign: 'middle',
          lineHeight: 1,
        }}
        title="Statutory Non-Vegetarian Declaration (FSSAI 2.2.2 / LM-RULE-006)"
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${cfg.boxPx}px`,
            height: `${cfg.boxPx}px`,
            minWidth: `${cfg.boxPx}px`,
            borderRadius: '2px',
            border: `${cfg.borderWidth} solid #78350f`,
            backgroundColor: '#ffffff',
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              display: 'block',
              width: `${cfg.innerPx}px`,
              height: `${cfg.innerPx}px`,
              backgroundColor: '#78350f',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </span>
        {showLabel && (
          <span
            style={{
              fontSize: cfg.fontSize,
              fontWeight: 700,
              color: '#78350f',
              letterSpacing: '0.01em',
            }}
          >
            Non-Vegetarian
          </span>
        )}
      </span>
    );
  }

  /* ── Non-Food: Exempt / N/A ── */
  if (normType === 'NON_FOOD') {
    return (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          verticalAlign: 'middle',
          lineHeight: 1,
        }}
        title="Non-Food Packaged Commodity (Dietary Logo Exempt)"
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: `${cfg.boxPx}px`,
            height: `${cfg.boxPx}px`,
            minWidth: `${cfg.boxPx}px`,
            borderRadius: '2px',
            border: '1.5px solid #94a3b8',
            backgroundColor: '#f1f5f9',
            boxSizing: 'border-box',
            fontSize: '9px',
            fontWeight: 700,
            color: '#64748b',
          }}
        >
          NF
        </span>
        {showLabel && (
          <span
            style={{
              fontSize: cfg.fontSize,
              fontWeight: 600,
              color: '#64748b',
            }}
          >
            Non-Food Exempt
          </span>
        )}
      </span>
    );
  }

  /* ── UNKNOWN / Unspecified fallback ── */
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        verticalAlign: 'middle',
        lineHeight: 1,
      }}
      title="Dietary Status Unverified"
    >
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: `${cfg.boxPx}px`,
          height: `${cfg.boxPx}px`,
          minWidth: `${cfg.boxPx}px`,
          borderRadius: '2px',
          border: '1.5px dashed #f59e0b',
          backgroundColor: '#fffbeb',
          boxSizing: 'border-box',
          fontSize: '10px',
          fontWeight: 700,
          color: '#d97706',
        }}
      >
        ?
      </span>
      {showLabel && (
        <span
          style={{
            fontSize: cfg.fontSize,
            fontWeight: 600,
            color: '#d97706',
          }}
        >
          Unspecified
        </span>
      )}
    </span>
  );
}
