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
            borderRadius: '3px',
            border: `${cfg.borderWidth} solid #7A8450`, /* spec success olive */
            backgroundColor: '#FFF9F2', /* warm off-white surface-raised */
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              display: 'block',
              width: `${cfg.innerPx}px`,
              height: `${cfg.innerPx}px`,
              borderRadius: '50%',
              backgroundColor: '#7A8450',
            }}
          />
        </span>
        {showLabel && (
          <span
            style={{
              fontSize: cfg.fontSize,
              fontWeight: 700,
              color: '#7A8450',
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
            borderRadius: '3px',
            border: `${cfg.borderWidth} solid #B7410E`, /* spec rust/brown accent */
            backgroundColor: '#FFF9F2', /* warm off-white surface-raised */
            boxSizing: 'border-box',
          }}
        >
          <span
            style={{
              display: 'block',
              width: `${cfg.innerPx}px`,
              height: `${cfg.innerPx}px`,
              backgroundColor: '#B7410E',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
            }}
          />
        </span>
        {showLabel && (
          <span
            style={{
              fontSize: cfg.fontSize,
              fontWeight: 700,
              color: '#B7410E',
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
            borderRadius: '3px',
            border: '1.5px solid #E4CBB4',
            backgroundColor: '#F5E6D8',
            boxSizing: 'border-box',
            fontSize: '9px',
            fontWeight: 700,
            color: '#7A5C48',
          }}
        >
          NF
        </span>
        {showLabel && (
          <span
            style={{
              fontSize: cfg.fontSize,
              fontWeight: 600,
              color: '#7A5C48',
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
          borderRadius: '3px',
          border: '1.5px dashed #D98E04',
          backgroundColor: '#FFF9F2',
          boxSizing: 'border-box',
          fontSize: '10px',
          fontWeight: 700,
          color: '#D98E04',
        }}
      >
        ?
      </span>
      {showLabel && (
        <span
          style={{
            fontSize: cfg.fontSize,
            fontWeight: 600,
            color: '#D98E04',
          }}
        >
          Unspecified
        </span>
      )}
    </span>
  );
}
