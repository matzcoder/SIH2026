import React, { useState } from 'react';
import VegNonVegBadge from '../common/VegNonVegBadge';
import { useCompliance } from '../../context/ComplianceContext';

export default function AuditLogTable({ logs: propLogs, onRefresh: propOnRefresh }) {
  const complianceContext = useCompliance();
  const logs = propLogs !== undefined ? propLogs : (complianceContext?.inspections || []);
  const onRefresh = propOnRefresh || complianceContext?.refreshData;

  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const filteredLogs = logs.filter((log) => {
    const matchesText =
      !filter ||
      (log.commodityName || log.product || log.productName || '')
        .toLowerCase()
        .includes(filter.toLowerCase()) ||
      (log.officerName || log.inspector || '').toLowerCase().includes(filter.toLowerCase()) ||
      (log.districtZone || log.location || '').toLowerCase().includes(filter.toLowerCase()) ||
      String(log.id || '').toLowerCase().includes(filter.toLowerCase());

    const matchesStatus =
      statusFilter === 'ALL' ||
      (log.status || '').toUpperCase() === statusFilter.toUpperCase();

    return matchesText && matchesStatus;
  });

  const formatTimestamp = (ts, dateFallback) => {
    if (ts) {
      try {
        const d = new Date(ts);
        if (!isNaN(d.getTime())) {
          return d.toLocaleDateString('en-CA'); // YYYY-MM-DD
        }
      } catch {
        // ignore
      }
    }
    return dateFallback || 'Today';
  };

  const formatScore = (log) => {
    if (log.complianceScore !== undefined && log.complianceScore !== null) {
      return `${typeof log.complianceScore === 'number' ? log.complianceScore.toFixed(1) : log.complianceScore}%`;
    }
    if (log.score !== undefined && log.score !== null) {
      return typeof log.score === 'number' ? `${log.score}%` : String(log.score);
    }
    return '100.0%';
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h3 className="text-base font-bold text-slate-100">Inspection & Verification Audit Trail</h3>
          <p className="text-xs text-slate-400">
            Immutable log of statutory verifications, OCR analyses, and persistent database records
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLIANT">Compliant</option>
            <option value="VIOLATION">Violation</option>
          </select>
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="px-3 py-1.5 bg-cyan-900/60 hover:bg-cyan-800 border border-cyan-600/50 text-cyan-200 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-sm"
              title="Sync with SQLite database"
            >
              <span>↻</span> Refresh Live Data
            </button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-950/70 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Commodity</th>
              <th className="py-3 px-4">Classification</th>
              <th className="py-3 px-4">Zone</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, idx) => {
                const isCompliant =
                  (log.status || '').toUpperCase() === 'COMPLIANT' ||
                  (log.violationsCount === 0 && (log.status || '').toUpperCase() !== 'VIOLATION');

                return (
                  <tr key={log.id || idx} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                      #{log.id || 1000 + idx}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-200">
                      <div>{log.commodityName || log.product || log.productName || 'Packaged Commodity'}</div>
                      <div className="text-[10px] text-slate-400 font-normal">
                        {log.officerName || log.inspector || 'Field Inspector'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <VegNonVegBadge
                        type={log.dietaryType || (log.category === 'Food' ? 'VEG' : 'VEG')}
                        size="sm"
                        showLabel={true}
                      />
                    </td>
                    <td className="py-3 px-4 text-slate-300">
                      {log.districtZone || log.location || 'Chennai South'}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-100">
                      <span className={isCompliant ? 'text-emerald-400' : 'text-rose-400'}>
                        {formatScore(log)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                          isCompliant
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isCompliant ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                        {isCompliant ? 'COMPLIANT' : 'VIOLATION'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 font-mono">
                      {formatTimestamp(log.timestamp, log.date)}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="7" className="py-8 text-center text-slate-500 italic">
                  No inspection audit records found matching criteria in database.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
