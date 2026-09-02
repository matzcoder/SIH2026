import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import apiClient, { saveOfflineScan } from '../services/api';

const ComplianceContext = createContext();

export function ComplianceProvider({ children }) {
  const [inspections, setInspections] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalScans: 0,
    complianceRate: 100,
    noticesIssued: 0,
    dietaryBreakdown: { veg: 0, nonVeg: 0, nonFood: 0 }
  });
  const [loading, setLoading] = useState(false);

  const refreshData = useCallback(async () => {
    try {
      setLoading(true);
      const [inspectionsRes, analyticsRes] = await Promise.all([
        apiClient.get('/inspections'),
        apiClient.get('/analytics/overview')
      ]);

      if (inspectionsRes.data) {
        setInspections(inspectionsRes.data);
        localStorage.setItem('cached_inspections', JSON.stringify(inspectionsRes.data));
      }
      if (analyticsRes.data) {
        setAnalytics(analyticsRes.data);
        localStorage.setItem('cached_analytics', JSON.stringify(analyticsRes.data));
      }
    } catch (err) {
      console.warn('Backend offline, loading cached data from local storage:', err);
      const cachedInspections = localStorage.getItem('cached_inspections');
      const cachedAnalytics = localStorage.getItem('cached_analytics');
      if (cachedInspections) {
        try {
          setInspections(JSON.parse(cachedInspections));
        } catch (e) {
          console.error('Error parsing cached inspections:', e);
        }
      }
      if (cachedAnalytics) {
        try {
          setAnalytics(JSON.parse(cachedAnalytics));
        } catch (e) {
          console.error('Error parsing cached analytics:', e);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  const recordNewInspection = async (reportPayload) => {
    try {
      const response = await apiClient.post('/inspections/submit', reportPayload);
      await refreshData();
      return response.data;
    } catch (err) {
      console.warn('Offline mode: saving scan locally and applying optimistic update', err);
      saveOfflineScan(reportPayload);
      const optimisticItem = {
        id: Date.now(),
        commodityName: reportPayload.commodityName || reportPayload.product || 'Packaged Commodity',
        dietaryType: reportPayload.dietaryType || 'VEG',
        officerName: reportPayload.officerName || 'Field Inspector',
        districtZone: reportPayload.districtZone || 'General Zone',
        complianceScore: reportPayload.score || 100.0,
        violationsCount: reportPayload.violations?.length || 0,
        inspectorNotes: reportPayload.inspectorNotes || '',
        status: reportPayload.violations?.length > 0 ? 'VIOLATION' : 'COMPLIANT',
        results: reportPayload.results || [],
        timestamp: new Date().toISOString(),
        ...reportPayload
      };
      setInspections(prev => [optimisticItem, ...prev]);
      setAnalytics(prev => {
        const isViolation = optimisticItem.status === 'VIOLATION';
        const newTotal = (prev.totalScans || 0) + 1;
        const newNotices = (prev.noticesIssued || 0) + (isViolation ? 1 : 0);
        const compliantCount = newTotal - newNotices;
        const newRate = roundRate(compliantCount / newTotal * 100);
        const dType = optimisticItem.dietaryType || 'VEG';
        return {
          ...prev,
          totalScans: newTotal,
          noticesIssued: newNotices,
          complianceRate: newRate,
          dietaryBreakdown: {
            ...prev.dietaryBreakdown,
            veg: (prev.dietaryBreakdown?.veg || 0) + (dType === 'VEG' ? 1 : 0),
            nonVeg: (prev.dietaryBreakdown?.nonVeg || 0) + (dType === 'NON_VEG' ? 1 : 0),
            nonFood: (prev.dietaryBreakdown?.nonFood || 0) + (dType === 'NON_FOOD' ? 1 : 0),
          }
        };
      });
      return { status: 'queued_offline', id: optimisticItem.id };
    }
  };

  return (
    <ComplianceContext.Provider
      value={{
        inspections,
        analytics,
        loading,
        refreshData,
        recordNewInspection
      }}
    >
      {children}
    </ComplianceContext.Provider>
  );
}

function roundRate(val) {
  return Math.round(val * 10) / 10;
}

export const useCompliance = () => {
  const context = useContext(ComplianceContext);
  if (!context) {
    throw new Error('useCompliance must be used within a ComplianceProvider');
  }
  return context;
};

export default ComplianceContext;
