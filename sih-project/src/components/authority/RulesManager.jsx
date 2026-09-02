import React, { useState, useMemo } from 'react';

const DEFAULT_SAMPLE_TEXT = `MRP Rs. 40.00 (Incl. of all taxes)
Net Wt: 200 g
Date of Pkd: 06/2026
Lic No. 10018022008451
Manufactured by Britannia Industries Ltd, Chennai
Consumer Helpline: 1800-425-4444 care@britannia.com`;

export default function RulesManager({ rules = [], onSaveRule }) {
  const [selectedRuleId, setSelectedRuleId] = useState(rules[0]?.id || '1');
  const [editForm, setEditForm] = useState(rules[0] || {});
  const [sandboxSample, setSandboxSample] = useState(DEFAULT_SAMPLE_TEXT);
  const [sandboxFlags, setSandboxFlags] = useState('i');
  const [statusMessage, setStatusMessage] = useState('');

  const activeRule = rules.find((r) => r.id === selectedRuleId) || rules[0] || {};

  const handleSelectRule = (rule) => {
    setSelectedRuleId(rule.id);
    const savedDraft = localStorage.getItem(`ruleSandbox:${rule.id}`);
    if (savedDraft) {
      try {
        const draft = JSON.parse(savedDraft);
        setEditForm({ ...rule, regexPattern: draft.pattern || rule.regexPattern });
        setSandboxSample(draft.sample || DEFAULT_SAMPLE_TEXT);
        setSandboxFlags(draft.flags || 'i');
        setStatusMessage('Loaded local sandbox draft for this rule.');
        return;
      } catch {}
    }
    setEditForm(rule);
    setStatusMessage('');
  };

  const sandboxResult = useMemo(() => {
    const pattern = editForm.regexPattern || '';
    if (!pattern) return { matches: [], error: 'Please enter a regular expression pattern.' };
    try {
      const flags = sandboxFlags.includes('g') ? sandboxFlags : `${sandboxFlags}g`;
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(sandboxSample.matchAll(regex)).map((m) => m[0]);
      return { matches, error: null };
    } catch (err) {
      return { matches: [], error: err.message };
    }
  }, [editForm.regexPattern, sandboxSample, sandboxFlags]);

  const handleSaveLocalDraft = () => {
    localStorage.setItem(
      `ruleSandbox:${editForm.id}`,
      JSON.stringify({
        pattern: editForm.regexPattern,
        sample: sandboxSample,
        flags: sandboxFlags,
        savedAt: new Date().toISOString(),
      })
    );
    setStatusMessage('Draft saved in local sandbox. Production rule is not affected.');
  };

  const handleDeployRule = () => {
    if (onSaveRule) {
      onSaveRule(editForm);
      setStatusMessage(`Rule ${editForm.code || editForm.id} deployed successfully.`);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-slate-100">
      {/* Rule Selection List */}
      <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="font-bold text-sm text-slate-100">PCR 2011 Rule Catalog</h3>
            <p className="text-[11px] text-slate-400">Select a rule to configure or test</p>
          </div>
          <span className="px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-[10px] font-bold">
            {rules.length} Rules
          </span>
        </div>

        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {rules.map((rule) => {
            const isSelected = selectedRuleId === rule.id;
            return (
              <div
                key={rule.id}
                onClick={() => handleSelectRule(rule)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800 border-cyan-500 ring-2 ring-cyan-500/20'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200">{rule.name || rule.ruleName}</h4>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                    Rule {rule.code || rule.ruleCode || rule.id}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{rule.description}</p>
                {rule.mandatory && (
                  <span className="inline-block mt-2 text-[9px] font-semibold text-amber-400 uppercase tracking-wider">
                    Mandatory Declaration
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Rules Editor & Regex Sandbox */}
      <div className="lg:col-span-8 space-y-6">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-100">
                  {editForm.name || activeRule.name}
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                  Rule {editForm.code || activeRule.code}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Configure Legal Metrology Statutory Rule Parameters & Regex OCR Extractor
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveLocalDraft}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
              >
                Save Sandbox Draft
              </button>
              <button
                type="button"
                onClick={handleDeployRule}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/30 transition-all"
              >
                Deploy Rule
              </button>
            </div>
          </div>

          {statusMessage && (
            <div className="p-3 bg-cyan-950/70 border border-cyan-500/40 text-cyan-200 text-xs rounded-xl flex justify-between items-center">
              <span>{statusMessage}</span>
              <button onClick={() => setStatusMessage('')} className="font-bold">
                &times;
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-400 mb-1">Rule Name</label>
              <input
                type="text"
                value={editForm.name || ''}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1">Statutory Clause Code</label>
              <input
                type="text"
                value={editForm.code || ''}
                onChange={(e) => setEditForm({ ...editForm, code: e.target.value })}
                className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-slate-400 mb-1">Statutory Rule Description</label>
            <textarea
              rows={2}
              value={editForm.description || ''}
              onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              className="w-full p-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-400 text-xs"
            />
          </div>

          {/* Regular Expression Sandbox */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                Safe Regex Sandbox & Pattern Evaluator
              </span>
              <span className="text-[10px] text-slate-400">Evaluates locally against test text</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="md:col-span-3">
                <label className="block text-slate-400 mb-1">OCR Regex Pattern</label>
                <input
                  type="text"
                  value={editForm.regexPattern || ''}
                  onChange={(e) => setEditForm({ ...editForm, regexPattern: e.target.value })}
                  spellCheck="false"
                  className="w-full p-2 bg-slate-900 border border-slate-700 font-mono text-cyan-300 rounded-xl focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Flags (e.g. i, m)</label>
                <input
                  type="text"
                  value={sandboxFlags}
                  onChange={(e) => setSandboxFlags(e.target.value)}
                  placeholder="i"
                  className="w-full p-2 bg-slate-900 border border-slate-700 font-mono text-slate-200 rounded-xl focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="text-xs">
              <label className="block text-slate-400 mb-1">Sample Commodity OCR Text</label>
              <textarea
                rows={4}
                value={sandboxSample}
                onChange={(e) => setSandboxSample(e.target.value)}
                spellCheck="false"
                className="w-full p-2 bg-slate-900 border border-slate-700 font-mono text-slate-300 rounded-xl focus:outline-none focus:border-cyan-400 text-xs"
              />
            </div>

            {/* Sandbox Evaluation Output */}
            <div
              className={`p-3 rounded-xl border text-xs ${
                sandboxResult.error
                  ? 'bg-rose-950/40 border-rose-800 text-rose-300'
                  : sandboxResult.matches.length > 0
                  ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                  : 'bg-amber-950/40 border-amber-800 text-amber-300'
              }`}
            >
              {sandboxResult.error ? (
                <div>
                  <strong>Invalid Regex Pattern:</strong> {sandboxResult.error}
                </div>
              ) : sandboxResult.matches.length > 0 ? (
                <div>
                  <div className="font-bold flex items-center gap-1.5 mb-1">
                    <span>✓ Matched {sandboxResult.matches.length} declaration(s):</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {sandboxResult.matches.map((m, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-200 font-mono text-[11px]"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <strong>No Match Found:</strong> The provided regex pattern did not match any text
                  in the sample.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
