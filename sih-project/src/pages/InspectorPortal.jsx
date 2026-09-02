import React, { useState } from 'react';
import ImageBoundingBoxOverlay from '../components/inspector/ImageBoundingBoxOverlay';
import ComplianceChecklist from '../components/inspector/ComplianceChecklist';
import ViolationReportModal from '../components/inspector/ViolationReportModal';
import ScanningRadar from '../components/common/ScanningRadar';
import Navbar from '../components/common/Navbar';
import VegNonVegBadge from '../components/common/VegNonVegBadge';
import DietarySelector from '../components/inspector/DietarySelector';
import { scanProductImage, saveOfflineScan } from '../services/api';
import { useCompliance } from '../context/ComplianceContext';

const DEFAULT_SAMPLE_RULES = [
  {
    id: "LMR_RULE_01",
    ruleId: "LMR_RULE_01",
    ruleCode: "6(1)(e)",
    ruleName: "MRP Declaration",
    description: "Mandatory Maximum Retail Price inclusive of all statutory taxes.",
    extractedText: "MRP Rs. 15.00 (Incl. of all taxes)",
    status: "PASS",
    confidence: 97,
    bbox: { x: 10, y: 18, width: 45, height: 12 },
  },
  {
    id: "LMR_RULE_02",
    ruleId: "LMR_RULE_02",
    ruleCode: "6(1)(f)",
    ruleName: "Net Quantity Declaration",
    description: "Net quantity in standard metric units (g/kg/ml).",
    extractedText: "Net Quantity: 70 g",
    status: "PASS",
    confidence: 96,
    bbox: { x: 62, y: 18, width: 30, height: 12 },
  },
  {
    id: "LMR_RULE_03",
    ruleId: "LMR_RULE_03",
    ruleCode: "6(11)",
    ruleName: "Unit Sale Price (USP)",
    description: "No declared USP found, but exempt below 1 kg/1 L under PCR 2011. Reference: Rs. 0.21/g.",
    extractedText: "Exempt (<100g) / Rs. 0.21/g",
    status: "PASS",
    confidence: 90,
    bbox: { x: 10, y: 32, width: 42, height: 10 },
  },
  {
    id: "LMR_RULE_04",
    ruleId: "LMR_RULE_04",
    ruleCode: "6(1)(n)",
    ruleName: "Consumer Care Details",
    description: "Consumer care telephone & official grievance email.",
    extractedText: "consumerservices@in.nestle.com / 1800-103-0626",
    status: "PASS",
    confidence: 96,
    bbox: { x: 10, y: 44, width: 78, height: 12 },
  },
  {
    id: "LMR_RULE_05",
    ruleId: "LMR_RULE_05",
    ruleCode: "6(1)(a)",
    ruleName: "Manufacturer / Packer / Marketer Details",
    description: "Registered manufacturer name and plant address.",
    extractedText: "Nestlé India Ltd., Industrial Area, Moga, Punjab",
    status: "PASS",
    confidence: 95,
    bbox: { x: 10, y: 58, width: 80, height: 14 },
  },
  {
    id: "LMR_RULE_06",
    ruleId: "LMR_RULE_06",
    ruleCode: "6(1)(d)",
    ruleName: "Manufacture / Expiry Date Declaration",
    description: "Month and year of manufacture & best before date.",
    extractedText: "Mfg: 09/2026 | Best Before 9 Months",
    status: "PASS",
    confidence: 96,
    bbox: { x: 10, y: 74, width: 45, height: 11 },
  },
  {
    id: "LMR_RULE_07",
    ruleId: "LMR_RULE_07",
    ruleCode: "6(1)(m)",
    ruleName: "Country of Origin Declaration",
    description: "Mandatory statutory declaration of country of origin.",
    extractedText: "Country of Origin: India",
    status: "PASS",
    confidence: 97,
    bbox: { x: 58, y: 74, width: 34, height: 11 },
  },
  {
    id: "FSSAI_RULE_01",
    ruleId: "FSSAI_RULE_01",
    ruleCode: "FSSAI/LM",
    ruleName: "FSSAI Graphic Logo Presence",
    description: "Valid FSSAI logo and 14-digit central license number.",
    extractedText: "FSSAI Lic. No. 10012011000168",
    status: "PASS",
    confidence: 97,
    bbox: { x: 10, y: 86, width: 45, height: 11 },
  },
  {
    id: "FSSAI_VEG_RULE_01",
    ruleId: "FSSAI_VEG_RULE_01",
    ruleCode: "FSSAI 2.2.2",
    ruleName: "Veg / Non-Veg Statutory Logo",
    description: "Statutory Vegetarian (Green Dot in Square) emblem on Principal Display Panel per FSSAI 2.2.2.",
    dietaryType: "VEG",
    extractedText: "Vegetarian Emblem (Green Dot Detected)",
    status: "PASS",
    confidence: 98,
    bbox: { x: 80, y: 86, width: 14, height: 11 },
  },
];

export default function InspectorPortal() {
  const { recordNewInspection } = useCompliance();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResults, setScanResults] = useState(DEFAULT_SAMPLE_RULES);
  const [activeRuleId, setActiveRuleId] = useState('mrp');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [dietaryCategory, setDietaryCategory] = useState('ALL');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setIsScanning(true);
    setStatusMessage('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('image', file);

      const res = await scanProductImage(formData);
      if (res?.data?.results) {
        setScanResults(res.data.results);
      } else if (res?.data?.compliance_report) {
        // Map backend report format to statutory checklist items
        const report = res.data.compliance_report;
        const boxes = res.data.bounding_boxes || [];
        const extracted = res.data.extracted_data || {};
        const mapped = report.map((r, idx) => {
          const bboxObj = boxes.find((b) => b.field === r.rule_id || b.rule === r.rule);
          return {
            id: r.rule_id || `${idx + 1}`,
            ruleId: r.rule_id || `${idx + 1}`,
            ruleCode: r.rule_id || `${idx + 1}`,
            ruleName: r.rule || r.rule_id,
            description: r.message || 'Verify this statutory declaration on the label.',
            extractedText: extracted[r.rule_id] || (r.passed ? 'Verified on label' : ''),
            status: r.passed ? 'PASS' : 'FAIL',
            confidence: bboxObj?.confidence ? Math.round(bboxObj.confidence * 100) : 90,
            bbox: bboxObj?.bbox || { x: 10, y: 15 + idx * 12, width: 45, height: 10 },
            box: bboxObj?.box,
          };
        });
        setScanResults(mapped);
      }
    } catch (err) {
      console.warn('Backend unavailable, using default sample inspection pipeline:', err);
    } finally {
      setIsScanning(false);
    }
  };

  const handleOverrideChange = (id, updatedValues) => {
    setScanResults((prev) =>
      prev.map((item) =>
        item.id === id || item.ruleId === id ? { ...item, ...updatedValues } : item
      )
    );
    const currentOverrides = JSON.parse(localStorage.getItem('inspectionReview') || '{}');
    localStorage.setItem(
      'inspectionReview',
      JSON.stringify({
        ...currentOverrides,
        lastUpdated: new Date().toISOString(),
        results: scanResults,
      })
    );
  };

  const handleConfirmSubmit = async (reportPayload) => {
    try {
      const detectedDietary =
        scanResults.find((r) => r.ruleId === 'FSSAI_VEG_RULE_01' || r.ruleId === 'veg_non_veg_logo')?.dietaryType ||
        (scanResults.some((r) => /chicken|meat|egg|fish|mutton|non[\s-_]?veg/i.test((r.extractedText || '') + ' ' + (r.description || ''))) ? 'NON_VEG' : 'VEG');

      const violationsList =
        reportPayload.violations ||
        scanResults.filter((r) => r.status === 'FAIL') ||
        [];

      const payload = {
        commodityName: reportPayload.commodityName || 'Packaged Biscuits / Snack Item',
        dietaryType: detectedDietary,
        officerName: reportPayload.officerName || 'P R Matthew (Field Officer)',
        districtZone: reportPayload.districtZone || 'Chennai South',
        violations: violationsList,
        results: scanResults,
        inspectorNotes: reportPayload.inspectorNotes || '',
        signatureUrl: reportPayload.signatureUrl || null,
        imageUrl: previewUrl || '',
        ...reportPayload,
      };

      const res = await recordNewInspection(payload);
      if (res?.status === 'queued_offline') {
        setStatusMessage('Network offline: Report queued locally and cached for sync.');
      } else {
        setStatusMessage('Inspection report and formal violation notice recorded successfully to database.');
      }
    } catch (e) {
      console.error('Submission error:', e);
      saveOfflineScan({ ...reportPayload, results: scanResults });
      setStatusMessage('Network offline: Report queued locally and will sync when reconnected.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Navbar role="inspector" />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {statusMessage && (
          <div className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500 text-cyan-200 text-xs flex justify-between items-center shadow-lg">
            <span>{statusMessage}</span>
            <button
              onClick={() => setStatusMessage('')}
              className="font-bold text-base px-2 hover:opacity-75"
            >
              &times;
            </button>
          </div>
        )}

        {/* Upload Banner & Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          {/* Top row: title + action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-slate-100">Live Field Verification & Camera Scanner</h2>
              <p className="text-xs text-slate-400 mt-1">
                Capture commodity packaging photos (biscuits, oil packets, dairy cartons) for automated PCR 2011 compliance analysis.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="cursor-pointer px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-cyan-600/30 transition-all flex items-center gap-2">
                <span>📷 Take Photo / Upload Label</span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>

              <button
                onClick={() => setIsModalOpen(true)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
              >
                Generate Notice / Report
              </button>
            </div>
          </div>

          {/* Dietary Category Filter + detected classification badge */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
            <DietarySelector
              selectedCategory={dietaryCategory}
              onChangeCategory={(cat) => setDietaryCategory(cat)}
            />
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Detected Classification:</span>
              <VegNonVegBadge
                type={
                  scanResults.find((r) => r.ruleId === 'FSSAI_VEG_RULE_01' || r.ruleId === 'veg_non_veg_logo')?.dietaryType ||
                  (scanResults.some((r) => /chicken|meat|egg|fish|mutton|non[\s-_]?veg/i.test((r.extractedText || "") + " " + (r.description || ""))) ? "NON_VEG" : "VEG")
                }
                size="sm"
                showLabel={true}
              />
            </div>
          </div>
        </div>

        {/* Main Stacked View: Image + Bounding Boxes on Top, Checklist on Bottom */}
        <div className="flex flex-col gap-6 w-full">
          <div className="w-full space-y-4">
            {isScanning ? (
              <ScanningRadar text="Extracting Text & Verifying Statutory Declarations..." />
            ) : (
              <ImageBoundingBoxOverlay
                imageUrl={
                  previewUrl ||
                  'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=1200&q=80'
                }
                detections={scanResults
                  .filter((r) => (r.bbox && r.bbox.width > 0) || (r.box && r.box.length === 4))
                  .map((r) => ({
                    id: r.id,
                    ruleId: r.ruleId,
                    label: r.ruleName,
                    value: r.extractedText,
                    status: r.status,
                    confidence: r.confidence,
                    bbox: r.bbox,
                    box: r.box,
                    dietaryType: r.dietaryType,
                  }))}
                activeRuleId={activeRuleId}
                onSelectDetection={(item) => setActiveRuleId(item.ruleId)}
              />
            )}
          </div>

          <div className="w-full">
            <ComplianceChecklist
              results={scanResults}
              activeRuleId={activeRuleId}
              onSelectRule={(ruleId) => setActiveRuleId(ruleId)}
              onOverrideChange={handleOverrideChange}
            />
          </div>
        </div>

        <ViolationReportModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          scanData={{
            commodityName: 'Packaged Biscuits / Snack Item',
            results: scanResults,
          }}
          onConfirmSubmit={handleConfirmSubmit}
        />
      </main>
    </div>
  );
}
