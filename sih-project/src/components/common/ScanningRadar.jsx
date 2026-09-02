import React from 'react';

export default function ScanningRadar({ text = "AI Engine Analyzing Packaged Commodity Label..." }) {
  return (
    <div className="relative flex flex-col items-center justify-center p-8 bg-slate-900/90 rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl backdrop-blur-md">
      <div className="relative w-40 h-40 flex items-center justify-center">
        <div
          className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping"
          style={{ animationDuration: '3s' }}
        ></div>
        <div className="absolute inset-4 rounded-full border border-cyan-400/30 animate-pulse"></div>
        <div className="absolute inset-10 rounded-full border border-cyan-400/50"></div>
        <div
          className="absolute w-20 h-20 origin-bottom-right top-0 left-0 bg-gradient-to-br from-cyan-400/40 to-transparent rounded-tl-full animate-spin"
          style={{ animationDuration: '2s' }}
        ></div>
        <div className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_12px_#22d3ee]"></div>
      </div>
      <p className="mt-6 text-sm font-medium text-cyan-200 tracking-wide animate-pulse text-center">
        {text}
      </p>
      <div className="mt-3 flex items-center gap-2 text-xs text-slate-400">
        <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
        Extracting MRP, Net Wt, Mfg Date, FSSAI, Address...
      </div>
    </div>
  );
}
