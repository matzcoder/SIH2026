import React, { useState, useRef, useEffect } from 'react';

export default function ViolationReportModal({
  isOpen,
  onClose,
  scanData,
  onConfirmSubmit,
}) {
  const [inspectorNotes, setInspectorNotes] = useState('');
  const [officerName, setOfficerName] = useState('P R Matthew (Field Officer)');
  const [districtZone, setDistrictZone] = useState('Chennai South Zone');
  const [signatureUrl, setSignatureUrl] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#2563eb';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const violations =
    scanData?.results?.filter((r) => r.status === 'FAIL') ||
    scanData?.compliance_report?.filter((r) => !r.passed) ||
    [];

  const getCanvasCoords = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: ((clientX - rect.left) / rect.width) * canvas.width,
      y: ((clientY - rect.top) / rect.height) * canvas.height,
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const { x, y } = getCanvasCoords(e);
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    handleSaveSignature();
  };

  const handleClearSignature = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setSignatureUrl(null);
    }
  };

  const handleSaveSignature = () => {
    if (canvasRef.current) {
      setSignatureUrl(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div className="bg-white border border-slate-200 w-full max-w-2xl rounded-2xl shadow-2xl text-slate-900 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-200">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Legal Metrology Inspection Notice</h3>
            <p className="text-xs text-slate-500 font-medium">Formal Verification Record under PCR 2011</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto text-xs">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="text-slate-500 block mb-1 font-semibold">Inspector:</label>
              <input
                type="text"
                value={officerName}
                onChange={(e) => setOfficerName(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded-lg font-medium text-slate-900 border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1 font-semibold">Jurisdiction / Zone:</label>
              <input
                type="text"
                value={districtZone}
                onChange={(e) => setDistrictZone(e.target.value)}
                className="w-full bg-white px-2.5 py-1.5 rounded-lg font-medium text-slate-900 border border-slate-300 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <span className="text-slate-500 block mb-1 font-semibold">Product / Commodity:</span>
              <p className="font-bold text-slate-900">
                {scanData?.commodityName || scanData?.name || 'Packaged Commodity'}
              </p>
            </div>

            <div>
              <span className="text-slate-500 block mb-1 font-semibold">Inspection Timestamp:</span>
              <p className="font-mono text-slate-700 font-medium">{new Date().toLocaleString()}</p>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-sm text-slate-900 mb-2 flex items-center justify-between">
              <span>Detected Violations ({violations.length})</span>
              <span
                className={`text-[11px] font-semibold ${
                  violations.length === 0 ? 'text-emerald-600' : 'text-rose-600'
                }`}
              >
                {violations.length === 0 ? 'Fully Compliant' : 'Requires Statutory Notice'}
              </span>
            </h4>

            {violations.length === 0 ? (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium">
                No non-compliances detected. All mandatory declarations conform to Legal Metrology
                standards.
              </div>
            ) : (
              <ul className="space-y-2">
                {violations.map((v, i) => (
                  <li
                    key={v.id || i}
                    className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5"
                  >
                    <span className="text-rose-600 font-bold text-sm">•</span>
                    <div>
                      <p className="font-bold text-rose-900">
                        {v.ruleName || v.name || v.rule || 'Violation'} (Rule {v.ruleCode || v.rule_id || i + 1})
                      </p>
                      <p className="text-[11.5px] text-rose-700 font-medium mt-0.5">{v.description || v.message}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label className="block text-slate-700 font-semibold mb-1">
              Inspector Observations & Seizure Notes:
            </label>
            <textarea
              rows={3}
              value={inspectorNotes}
              onChange={(e) => setInspectorNotes(e.target.value)}
              placeholder="e.g. Discrepancy observed on primary display panel. Retail sample collected for verification."
              className="w-full p-3 bg-white border border-slate-300 rounded-xl text-slate-900 focus:outline-none focus:border-blue-500 text-xs shadow-sm"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-slate-700 font-semibold">
                Digital Verification Signature:
              </label>
              <button
                type="button"
                onClick={handleClearSignature}
                className="text-[10.5px] text-rose-600 font-semibold hover:underline"
              >
                Clear
              </button>
            </div>
            <div className="border border-slate-300 rounded-xl bg-slate-50 p-1">
              <canvas
                ref={canvasRef}
                width={480}
                height={90}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                className="w-full bg-white rounded-lg border border-slate-200 cursor-crosshair touch-none"
              />
            </div>
            <p className="text-[10.5px] text-slate-500 font-medium mt-1">
              Draw inspector signature above with mouse or touch
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 p-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (onConfirmSubmit) {
                onConfirmSubmit({
                  officerName,
                  districtZone,
                  inspectorNotes,
                  signatureUrl,
                  violations,
                  submittedAt: new Date().toISOString(),
                });
              }
              onClose();
            }}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/20 transition-all"
          >
            Submit Formal Notice & Export
          </button>
        </div>
      </div>
    </div>
  );
}
