import React, { useState, useMemo } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Edit3,
  SlidersHorizontal,
  Check,
  Sparkles,
} from 'lucide-react';
import VegNonVegBadge from '../common/VegNonVegBadge';
import './ComplianceChecklist.css';

export default function ComplianceChecklist({
  results = [],
  onOverrideChange,
  onSelectRule,
  activeRuleId,
}) {
  const [editingId, setEditingId] = useState(null);
  const [filter, setFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editValues, setEditValues] = useState({
    extractedText: '',
    status: 'PASS',
    notes: '',
    dietaryType: 'VEG',
  });

  const handleStartEdit = (item, e) => {
    e.stopPropagation();
    setEditingId(item.id || item.ruleId);
    setEditValues({
      extractedText: item.extractedText || item.value || '',
      status: item.status || 'PASS',
      notes: item.notes || '',
      dietaryType: item.dietaryType || 'VEG',
    });
  };

  const handleSaveEdit = (item, e) => {
    e.stopPropagation();
    if (onOverrideChange) {
      onOverrideChange(item.id || item.ruleId, editValues);
    }
    setEditingId(null);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setEditingId(null);
  };

  // Metrics calculation
  const totalRules = results.length;
  const passedRules = results.filter((r) => r.status === 'PASS').length;
  const failedRules = results.filter((r) => r.status === 'FAIL').length;
  const warningRules = results.filter(
    (r) => r.status === 'WARNING' || (r.status !== 'PASS' && r.status !== 'FAIL')
  ).length;

  const complianceScore =
    totalRules > 0 ? Math.round((passedRules / totalRules) * 100) : 0;

  // Filter & Search
  const filteredRules = useMemo(() => {
    return results.filter((rule) => {
      const statusMatch =
        filter === 'ALL'
          ? true
          : filter === 'PASS'
          ? rule.status === 'PASS'
          : filter === 'FAIL'
          ? rule.status === 'FAIL'
          : filter === 'WARNING'
          ? rule.status === 'WARNING'
          : filter === 'DIETARY'
          ? !!rule.dietaryType || rule.ruleId === 'FSSAI_VEG_RULE_01' || rule.ruleId === 'veg_non_veg_logo'
          : true;

      const q = searchQuery.toLowerCase().trim();
      if (!q) return statusMatch;

      const textMatch =
        (rule.ruleName || rule.name || '').toLowerCase().includes(q) ||
        (rule.ruleCode || rule.rule_id || '').toLowerCase().includes(q) ||
        (rule.description || rule.message || '').toLowerCase().includes(q) ||
        (rule.extractedText || rule.value || '').toLowerCase().includes(q);

      return statusMatch && textMatch;
    });
  }, [results, filter, searchQuery]);

  // Radial SVG dimensions
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (complianceScore / 100) * circumference;

  const scoreColor =
    complianceScore >= 80
      ? '#10b981'
      : complianceScore >= 50
      ? '#f59e0b'
      : '#f43f5e';

  return (
    <div className="compliance-panel">
      {/* ── HEADER WITH RADIAL SCORE GAUGE ── */}
      <div className="compliance-header">
        <div className="compliance-title-group">
          <div className="compliance-badge-row">
            <span className="compliance-official-badge">
              <ShieldCheck size={12} />
              <span>PCR 2011 Verified</span>
            </span>
          </div>
          <h2 className="compliance-main-title">Statutory Rules Checklist</h2>
          <p className="compliance-subtitle">
            Legal Metrology (Packaged Commodities) Rules & FSSAI 2022/2026
          </p>
        </div>

        <div className="compliance-score-box">
          <div className="radial-progress-wrapper">
            <svg className="radial-progress-svg" viewBox="0 0 48 48">
              <circle
                className="radial-bg"
                cx="24"
                cy="24"
                r={radius}
                strokeWidth="4"
                fill="none"
              />
              <circle
                className="radial-fill"
                cx="24"
                cy="24"
                r={radius}
                strokeWidth="4"
                fill="none"
                stroke={scoreColor}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
              />
            </svg>
            <span className="radial-score-text" style={{ color: scoreColor }}>
              {complianceScore}%
            </span>
          </div>

          <div className="compliance-score-meta">
            <span className="score-meta-label">Compliance</span>
            <span className="score-meta-count">
              {passedRules}/{totalRules}
            </span>
          </div>
        </div>
      </div>

      {/* ── FILTER & SEARCH STRIP ── */}
      <div className="compliance-controls">
        <div className="compliance-search-input-wrap">
          <Search size={14} className="compliance-search-icon" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search declarations, rule codes, extracted values..."
            className="compliance-search-input"
          />
        </div>

        <div className="compliance-filter-tabs">
          <button
            type="button"
            className={`compliance-filter-tab ${filter === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilter('ALL')}
          >
            <span>All Declarations</span>
            <span className="filter-count-chip">{totalRules}</span>
          </button>

          <button
            type="button"
            className={`compliance-filter-tab ${filter === 'PASS' ? 'active' : ''}`}
            onClick={() => setFilter('PASS')}
          >
            <span>Compliant</span>
            <span className="filter-count-chip">{passedRules}</span>
          </button>

          {failedRules > 0 && (
            <button
              type="button"
              className={`compliance-filter-tab ${filter === 'FAIL' ? 'active' : ''}`}
              onClick={() => setFilter('FAIL')}
            >
              <span>Violations</span>
              <span className="filter-count-chip">{failedRules}</span>
            </button>
          )}

          {warningRules > 0 && (
            <button
              type="button"
              className={`compliance-filter-tab ${filter === 'WARNING' ? 'active' : ''}`}
              onClick={() => setFilter('WARNING')}
            >
              <span>Review Needed</span>
              <span className="filter-count-chip">{warningRules}</span>
            </button>
          )}

          <button
            type="button"
            className={`compliance-filter-tab ${filter === 'DIETARY' ? 'active' : ''}`}
            onClick={() => setFilter('DIETARY')}
          >
            <span>Dietary Logo</span>
          </button>
        </div>
      </div>

      {/* ── RULE CARDS LIST ── */}
      <div className="compliance-list">
        {filteredRules.length === 0 ? (
          <div className="compliance-empty-state">
            <SlidersHorizontal size={28} className="text-slate-500 mb-1" />
            <p>No statutory declarations match your filter criteria.</p>
          </div>
        ) : (
          filteredRules.map((rule, idx) => {
            const ruleKey = rule.id || rule.ruleId || idx;
            const isSelected =
              activeRuleId === rule.ruleId ||
              activeRuleId === rule.ruleCode ||
              activeRuleId === rule.id;
            const isEditing = editingId === (rule.id || rule.ruleId);
            const statusLower = (rule.status || 'warning').toLowerCase();

            return (
              <div
                key={ruleKey}
                onClick={() =>
                  onSelectRule &&
                  onSelectRule(rule.ruleId || rule.ruleCode || rule.id)
                }
                className={`rule-card is-${statusLower} ${
                  isSelected ? 'is-selected' : ''
                }`}
              >
                {/* Header */}
                <div className="rule-card-header">
                  <div className="rule-card-title-wrap">
                    <div className="rule-title-row">
                      <h3 className="rule-title">
                        {rule.ruleName || rule.name || rule.rule || 'Statutory Declaration'}
                      </h3>
                      <span className="rule-code-chip">
                        {rule.ruleCode
                          ? rule.ruleCode.startsWith('Rule')
                            ? rule.ruleCode
                            : `Rule ${rule.ruleCode}`
                          : `Rule ${rule.ruleId || idx + 1}`}
                      </span>
                      {rule.dietaryType && (
                        <VegNonVegBadge
                          type={rule.dietaryType}
                          size="sm"
                          showLabel={false}
                        />
                      )}
                    </div>
                    <p className="rule-description">
                      {rule.description || rule.message}
                    </p>
                  </div>

                  <span className={`status-pill ${statusLower}`}>
                    {rule.status === 'PASS' ? (
                      <>
                        <CheckCircle2 size={12} />
                        <span>PASS</span>
                      </>
                    ) : rule.status === 'FAIL' ? (
                      <>
                        <XCircle size={12} />
                        <span>FAIL</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={12} />
                        <span>REVIEW</span>
                      </>
                    )}
                  </span>
                </div>

                {/* Evidence Detection Box */}
                {!isEditing ? (
                  <div className="rule-evidence-box">
                    <div className="evidence-content">
                      <span className="evidence-label">Detected:</span>
                      {rule.extractedText || rule.value ? (
                        <span className="evidence-value">
                          {rule.extractedText || rule.value}
                        </span>
                      ) : (
                        <span className="evidence-value not-found">
                          Not Found on Label
                        </span>
                      )}

                      {rule.confidence !== undefined &&
                        rule.confidence !== null && (
                          <div className="confidence-meter-wrap">
                            <div className="confidence-bar-bg">
                              <div
                                className="confidence-bar-fill"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(0, rule.confidence)
                                  )}%`,
                                }}
                              />
                            </div>
                            <span className="confidence-text">
                              {Math.round(rule.confidence)}%
                            </span>
                          </div>
                        )}
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleStartEdit(rule, e)}
                      className="override-trigger-btn"
                      title="Inspect and override this declaration"
                    >
                      <Edit3 size={11} />
                      <span>Override</span>
                    </button>
                  </div>
                ) : (
                  /* Inline Inspector Override Drawer */
                  <div
                    className="override-form-drawer"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="override-form-title">
                      <Sparkles size={13} />
                      <span>Official Inspector Override</span>
                    </div>

                    <div className="override-field-group">
                      <label className="override-label">Verified Extracted Value:</label>
                      <input
                        type="text"
                        value={editValues.extractedText}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            extractedText: e.target.value,
                          })
                        }
                        className="override-input"
                        placeholder="e.g. 200 g or Rs. 40.00"
                      />
                    </div>

                    <div className="override-field-group">
                      <label className="override-label">Inspector Decision:</label>
                      <select
                        value={editValues.status}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            status: e.target.value,
                          })
                        }
                        className="override-select"
                      >
                        <option value="PASS">PASS (Compliant with PCR 2011)</option>
                        <option value="FAIL">FAIL (Statutory Violation)</option>
                        <option value="WARNING">WARNING (Discretionary Review)</option>
                      </select>
                    </div>

                    {rule.dietaryType && (
                      <div className="override-field-group">
                        <label className="override-label">Dietary Classification:</label>
                        <select
                          value={editValues.dietaryType}
                          onChange={(e) =>
                            setEditValues({
                              ...editValues,
                              dietaryType: e.target.value,
                            })
                          }
                          className="override-select"
                        >
                          <option value="VEG">🟢 Vegetarian (Green Dot)</option>
                          <option value="NON_VEG">🔶 Non-Vegetarian (Brown Triangle)</option>
                          <option value="NON_FOOD">⬜ Non-Food Exempt</option>
                        </select>
                      </div>
                    )}

                    <div className="override-field-group">
                      <label className="override-label">Inspector Justification / Legal Note:</label>
                      <input
                        type="text"
                        placeholder="Provide reason for statutory override..."
                        value={editValues.notes}
                        onChange={(e) =>
                          setEditValues({
                            ...editValues,
                            notes: e.target.value,
                          })
                        }
                        className="override-input"
                      />
                    </div>

                    <div className="override-actions">
                      <button
                        type="button"
                        onClick={handleCancelEdit}
                        className="override-btn-cancel"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleSaveEdit(rule, e)}
                        className="override-btn-save"
                      >
                        <Check size={12} className="inline mr-1" />
                        Apply Override
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
