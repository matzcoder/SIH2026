import React from 'react';
import VegNonVegBadge from '../common/VegNonVegBadge';
import { useCompliance } from '../../context/ComplianceContext';

export default function AuthorityAnalytics({ metrics }) {
  const { analytics, inspections } = useCompliance();

  const data = metrics || {
    totalScans: String(analytics?.totalScans ?? inspections?.length ?? 0),
    totalScansDelta: '+18% this month',
    overallCompliance: `${analytics?.complianceRate ?? 100}%`,
    complianceDistricts: 'Across 14 Districts',
    noticesIssued: String(analytics?.noticesIssued ?? 0),
    noticesSubtext: 'Requires Compounding / Fines',
    activeRules: '18',
    activeRulesSubtext: 'PCR 2011 Active Standard',
  };

  const dietary = analytics?.dietaryBreakdown || {
    veg: inspections.filter((i) => (i.dietaryType || '').toUpperCase() === 'VEG').length,
    nonVeg: inspections.filter((i) => (i.dietaryType || '').toUpperCase() === 'NON_VEG').length,
    nonFood: inspections.filter((i) => (i.dietaryType || '').toUpperCase() === 'NON_FOOD').length,
  };

  const topViolations = [
    { rule: 'Rule 6(1)(e) - Non-standard MRP declaration format', count: 74, pct: 38 },
    { rule: 'Rule 6(1)(f) - Missing standard SI units for net quantity', count: 52, pct: 26 },
    { rule: 'Rule 6(1)(a) - Incomplete manufacturer / packer postal address', count: 39, pct: 20 },
    { rule: 'Rule 6(1)(n) - Unreachable consumer care contact / email', count: 21, pct: 11 },
    { rule: 'FSSAI - Absent 14-digit license mark', count: 11, pct: 5 },
  ];

  const districtPerformance = [
    { district: 'Chennai South', scans: 412, compliance: 89 },
    { district: 'Chennai Central', scans: 340, compliance: 82 },
    { district: 'Coimbatore Urban', scans: 286, compliance: 86 },
    { district: 'Madurai North', scans: 210, compliance: 78 },
  ];

  return (
    <div className="space-y-6 text-slate-100">
      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Total Field Scans</span>
          <div className="text-2xl font-black text-white mt-1">{data.totalScans}</div>
          <span className="text-[11px] text-cyan-400 mt-1 block font-medium">
            ↑ {data.totalScansDelta}
          </span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Overall Compliance</span>
          <div className="text-2xl font-black text-emerald-400 mt-1">{data.overallCompliance}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">{data.complianceDistricts}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Notices Issued</span>
          <div className="text-2xl font-black text-rose-400 mt-1">{data.noticesIssued}</div>
          <span className="text-[11px] text-rose-400 mt-1 block">{data.noticesSubtext}</span>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <span className="text-xs text-slate-400 font-semibold uppercase">Active Rules Enforced</span>
          <div className="text-2xl font-black text-cyan-400 mt-1">{data.activeRules}</div>
          <span className="text-[11px] text-slate-400 mt-1 block">{data.activeRulesSubtext}</span>
        </div>
      </div>

      {/* Dietary Classification Live Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-100">FSSAI / PCR 2011 Dietary Classification Summary</h3>
            <p className="text-xs text-slate-400">Live verified commodity distribution in database</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <VegNonVegBadge type="VEG" size="sm" showLabel={true} />
              <span className="text-xs font-bold text-slate-200 ml-1">({dietary.veg || 0})</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <VegNonVegBadge type="NON_VEG" size="sm" showLabel={true} />
              <span className="text-xs font-bold text-slate-200 ml-1">({dietary.nonVeg || 0})</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <VegNonVegBadge type="NON_FOOD" size="sm" showLabel={true} />
              <span className="text-xs font-bold text-slate-200 ml-1">({dietary.nonFood || 0})</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Top Non-Compliance Breakdown */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">Top Statutory Non-Compliances</h3>
              <p className="text-xs text-slate-400">
                Frequency distribution under PCR 2011 declarations
              </p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {topViolations.map((v, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">{v.rule}</span>
                  <span className="text-rose-400 font-bold">
                    {v.count} violations ({v.pct}%)
                  </span>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${v.pct * 2.2}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* District Compliance Overview */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-slate-100">District Enforcement Index</h3>
              <p className="text-xs text-slate-400">Jurisdiction compliance rates</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            {districtPerformance.map((d, i) => (
              <div
                key={i}
                className="p-3 bg-slate-950/70 border border-slate-800 rounded-xl flex items-center justify-between"
              >
                <div>
                  <h4 className="text-xs font-bold text-slate-200">{d.district}</h4>
                  <span className="text-[10px] text-slate-400">{d.scans} verified inspections</span>
                </div>
                <div className="text-right">
                  <span
                    className={`text-sm font-black ${
                      d.compliance >= 85
                        ? 'text-emerald-400'
                        : d.compliance >= 80
                        ? 'text-amber-400'
                        : 'text-rose-400'
                    }`}
                  >
                    {d.compliance}%
                  </span>
                  <span className="block text-[9px] text-slate-500 uppercase">Compliance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
