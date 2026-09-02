import React, { useMemo, useState } from 'react';

const DEFAULT_SAMPLE = `MRP: Rs. 40.00 (Incl. of all taxes)
Net Wt. 200 g
Packed 06/2026
Lic No. 10018022008451`;

export default function RulesConfiguratorSandbox({ rule }) {
  const ruleId = rule?.id || 'RULE-001';
  const storageKey = `ruleSandbox:${ruleId}`;

  const saved = (() => {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || 'null');
    } catch {
      return null;
    }
  })();

  const [pattern, setPattern] = useState(
    saved?.pattern ||
      rule?.regexPattern ||
      '(?:MRP|M\\.R\\.P\\.?)[\\s:]*(?:Rs\\.?|₹)?[\\s]*([0-9]+(?:\\.[0-9]{2})?)'
  );
  const [sample, setSample] = useState(saved?.sample || DEFAULT_SAMPLE);
  const [flags, setFlags] = useState(saved?.flags || 'i');
  const [message, setMessage] = useState('');

  const result = useMemo(() => {
    try {
      const regex = new RegExp(pattern, flags.includes('g') ? flags : `${flags}g`);
      const matches = Array.from(sample.matchAll(regex)).map((match) => match[0]);
      return { matches, error: '' };
    } catch (error) {
      return { matches: [], error: error.message };
    }
  }, [pattern, sample, flags]);

  const saveDraft = () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({
        pattern,
        sample,
        flags,
        savedAt: new Date().toISOString(),
      })
    );
    setMessage('Sandbox test draft saved locally. It is not deployed to the rule engine.');
  };

  return (
    <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 space-y-4 my-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            SAFE TESTING SPACE
          </span>
          <h3 className="text-base font-bold text-slate-100">Rules Configurator Sandbox</h3>
          <p className="text-xs text-slate-400">
            Validate detection pattern against sample OCR text before proposing an amendment.
          </p>
        </div>
        <button
          type="button"
          onClick={saveDraft}
          className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold shadow transition-colors"
        >
          Save test draft
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        <div className="md:col-span-3">
          <label className="block text-slate-400 mb-1 font-medium">
            Detection regular expression
          </label>
          <input
            type="text"
            value={pattern}
            onChange={(e) => {
              setPattern(e.target.value);
              setMessage('');
            }}
            spellCheck="false"
            className="w-full p-2 bg-slate-950 border border-slate-700 font-mono text-cyan-300 rounded-xl focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div>
          <label className="block text-slate-400 mb-1 font-medium">Flags</label>
          <input
            type="text"
            value={flags}
            onChange={(e) => {
              setFlags(e.target.value.replace(/[^dgimsuvy]/g, ''));
              setMessage('');
            }}
            placeholder="i"
            className="w-full p-2 bg-slate-950 border border-slate-700 font-mono text-slate-200 rounded-xl focus:outline-none focus:border-cyan-400"
          />
        </div>
      </div>

      <div className="text-xs">
        <label className="block text-slate-400 mb-1 font-medium">Sample OCR label text</label>
        <textarea
          rows={4}
          value={sample}
          onChange={(e) => {
            setSample(e.target.value);
            setMessage('');
          }}
          spellCheck="false"
          className="w-full p-2 bg-slate-950 border border-slate-700 font-mono text-slate-300 rounded-xl focus:outline-none focus:border-cyan-400 text-xs"
        />
      </div>

      <div
        className={`p-3.5 rounded-xl border text-xs ${
          result.error
            ? 'bg-rose-950/40 border-rose-800 text-rose-300'
            : result.matches.length > 0
            ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
            : 'bg-amber-950/40 border-amber-800 text-amber-300'
        }`}
      >
        <span className="block text-[10px] uppercase font-bold text-slate-400 mb-1">
          Test Evaluation Result
        </span>
        {result.error ? (
          <strong>Invalid expression: {result.error}</strong>
        ) : result.matches.length > 0 ? (
          <div>
            <strong>
              {result.matches.length} match{result.matches.length === 1 ? '' : 'es'} found:
            </strong>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {result.matches.map((m, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded bg-emerald-900/60 border border-emerald-700 text-emerald-200 font-mono text-[11px]"
                >
                  {m}
                </span>
              ))}
            </div>
          </div>
        ) : (
          <strong>No declarations matched this pattern in sample text</strong>
        )}
      </div>

      {message && (
        <p className="text-xs text-cyan-400 bg-cyan-950/60 p-2.5 rounded-lg border border-cyan-800">
          {message}
        </p>
      )}
    </section>
  );
}
