import React, { useState } from 'react';
import RulesManager from '../components/authority/RulesManager';
import AuditLogTable from '../components/authority/AuditLogTable';
import AuthorityAnalytics from '../components/authority/AuthorityAnalytics';
import Navbar from '../components/common/Navbar';
import { useCompliance } from '../context/ComplianceContext';

const INITIAL_RULES = [
  {
    id: '1',
    code: '6(1)(e)',
    name: 'MRP Declaration',
    mandatory: true,
    regexPattern:
      '(?:MRP|M\\.R\\.P\\.?)[\\s:]*(?:Rs\\.?|₹)?[\\s]*([0-9]+(?:\\.[0-9]{2})?)',
    description: 'Requires Maximum Retail Price inclusive of all taxes.',
  },
  {
    id: '2',
    code: '6(1)(f)',
    name: 'Net Quantity',
    mandatory: true,
    regexPattern:
      '(?:Net\\s*(?:Qty|Quantity|Wt|Weight)?)[\\s:]*([0-9]+(?:\\.[0-9]+)?)[\\s]*(g|kg|ml|l|m|cm|units|pcs)',
    description: 'Requires standard metric units without non-standard abbreviations.',
  },
  {
    id: '3',
    code: '6(1)(d)',
    name: 'Date of Packing / Expiry',
    mandatory: true,
    regexPattern:
      '(?:Mfg|Pkd|Packed|Best Before|Exp)[\\s:]*([0-9]{2}/[0-9]{2,4}|[A-Za-z]{3}[\\s-][0-9]{2,4})',
    description: 'Requires month and year of packaging or expiry indication.',
  },
  {
    id: '4',
    code: '6(1)(a)',
    name: 'Manufacturer Coordinates',
    mandatory: true,
    regexPattern:
      '(?:Manufactured|Packed|Imported)\\s*(?:by|at)?[\\s:]*([A-Za-z0-9\\s,\\.-]+)',
    description: 'Requires complete postal name and address coordinates.',
  },
  {
    id: '5',
    code: 'FSSAI 2.2.2 / LM',
    name: 'Veg / Non-Veg Statutory Logo',
    mandatory: true,
    category: 'FOOD_ONLY',
    regexPattern:
      '(?:veg|vegetarian|non-veg|non-vegetarian|egg\\s*contains?)',
    description:
      'Mandatory Green Dot or Brown Triangle symbol on Principal Display Panel for all edible packaged commodities.',
  },
];

export default function AuthorityPortal() {
  const { inspections, analytics, refreshData, loading } = useCompliance();
  const [rules, setRules] = useState(INITIAL_RULES);
  const [saveToast, setSaveToast] = useState('');
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' | 'analytics' | 'logs'

  const handleSaveRule = (updatedRule) => {
    setRules((prev) =>
      prev.map((r) => (r.id === updatedRule.id ? updatedRule : r))
    );
    setSaveToast(`Rule ${updatedRule.code || updatedRule.id} amended and deployed successfully.`);
    setTimeout(() => setSaveToast(''), 4000);
  };

  const dynamicMetrics = {
    totalScans: String(analytics?.totalScans ?? inspections?.length ?? 0),
    totalScansDelta: '+18% this month',
    overallCompliance: `${analytics?.complianceRate ?? 100}%`,
    complianceDistricts: 'Across 14 Districts',
    noticesIssued: String(analytics?.noticesIssued ?? 0),
    noticesSubtext: 'Requires Compounding / Fines',
    activeRules: String(rules.length),
    activeRulesSubtext: 'PCR 2011 Active Standard',
  };

  return (
    <div className="min-h-screen bg-[#FBF3EC] text-[#3B2A22] flex flex-col">
      <Navbar role="authority" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {saveToast && (
          <div className="p-3.5 rounded-[10px] bg-[#FFF9F2] border border-[#7A8450] text-[#7A8450] text-xs shadow-[0_4px_12px_rgba(139,69,19,0.1)] flex justify-between items-center">
            <span className="font-semibold">✓ {saveToast}</span>
            <button onClick={() => setSaveToast('')} className="font-bold text-base px-2 text-[#7A8450]">
              &times;
            </button>
          </div>
        )}

        {/* Tab Navigation & Live Sync Indicator */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E4CBB4] pb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('rules')}
              className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
                activeTab === 'rules'
                  ? 'bg-[#C1502D] text-[#FFF9F2] shadow-md shadow-[#C1502D]/20'
                  : 'bg-[#FFF9F2] text-[#7A5C48] hover:text-[#3B2A22] border border-[#E4CBB4]'
              }`}
            >
              Rules Configurator & Sandbox
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
                activeTab === 'analytics'
                  ? 'bg-[#C1502D] text-[#FFF9F2] shadow-md shadow-[#C1502D]/20'
                  : 'bg-[#FFF9F2] text-[#7A5C48] hover:text-[#3B2A22] border border-[#E4CBB4]'
              }`}
            >
              Governance Analytics
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-4 py-2 rounded-[8px] text-xs font-bold transition-all ${
                activeTab === 'logs'
                  ? 'bg-[#C1502D] text-[#FFF9F2] shadow-md shadow-[#C1502D]/20'
                  : 'bg-[#FFF9F2] text-[#7A5C48] hover:text-[#3B2A22] border border-[#E4CBB4]'
              }`}
            >
              Audit Log Trail ({inspections.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs bg-[#FFF9F2] border border-[#E4CBB4] px-3 py-1.5 rounded-full">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#7A8450] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#7A8450]"></span>
            </span>
            <span className="text-[#7A5C48] text-[11px]">
              SQLite Live Sync: <strong className="text-[#3B2A22]">{inspections.length}</strong> records
            </span>
            <button
              onClick={refreshData}
              disabled={loading}
              className="ml-2 px-2.5 py-1 bg-[#C1502D] hover:bg-[#A63F22] text-[#FFF9F2] rounded-[6px] text-[11px] font-semibold disabled:opacity-50 transition-colors"
            >
              {loading ? 'Syncing...' : '↻ Sync'}
            </button>
          </div>
        </div>

        {/* Live KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#F5E6D8] border border-[#E4CBB4] p-5 rounded-[10px] shadow-[0_2px_8px_rgba(139,69,19,0.08)]">
            <span className="text-xs text-[#7A5C48] font-semibold uppercase">Total Field Scans</span>
            <div className="text-2xl font-black text-[#3B2A22] mt-1">{dynamicMetrics.totalScans}</div>
            <span className="text-[11px] text-[#B7410E] mt-1 block font-medium">↑ 18% this month</span>
          </div>

          <div className="bg-[#F5E6D8] border border-[#E4CBB4] p-5 rounded-[10px] shadow-[0_2px_8px_rgba(139,69,19,0.08)]">
            <span className="text-xs text-[#7A5C48] font-semibold uppercase">Overall Compliance</span>
            <div className="text-2xl font-black text-[#7A8450] mt-1">
              {dynamicMetrics.overallCompliance}
            </div>
            <span className="text-[11px] text-[#7A5C48] mt-1 block">Across 14 Districts</span>
          </div>

          <div className="bg-[#F5E6D8] border border-[#E4CBB4] p-5 rounded-[10px] shadow-[0_2px_8px_rgba(139,69,19,0.08)]">
            <span className="text-xs text-[#7A5C48] font-semibold uppercase">Notices Issued</span>
            <div className="text-2xl font-black text-[#A63A32] mt-1">{dynamicMetrics.noticesIssued}</div>
            <span className="text-[11px] text-[#A63A32] mt-1 block font-medium">Requires Compounding/Fines</span>
          </div>

          <div className="bg-[#F5E6D8] border border-[#E4CBB4] p-5 rounded-[10px] shadow-[0_2px_8px_rgba(139,69,19,0.08)]">
            <span className="text-xs text-[#7A5C48] font-semibold uppercase">Active Rules Enforced</span>
            <div className="text-2xl font-black text-[#C1502D] mt-1">{rules.length}</div>
            <span className="text-[11px] text-[#7A5C48] mt-1 block">PCR 2011 Active Standard</span>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'rules' && (
          <RulesManager rules={rules} onSaveRule={handleSaveRule} />
        )}

        {activeTab === 'analytics' && (
          <AuthorityAnalytics metrics={dynamicMetrics} />
        )}

        {activeTab === 'logs' && (
          <AuditLogTable logs={inspections} onRefresh={refreshData} />
        )}
      </main>
    </div>
  );
}
