import { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}

export function DataProvider({ children }) {
  const [availableWeeks, setAvailableWeeks] = useState([10, 12, 15, 17, 19]);
  const [analyses, setAnalyses] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWeek, setSelectedWeek] = useState(availableWeeks[availableWeeks.length - 1]);

  useEffect(() => {
    async function loadAnalyses() {
      try {
        setLoading(true);

        // Load all week analyses in parallel
        const loadPromises = availableWeeks.map(async (week) => {
          const response = await fetch(`/data/analysis/week-${week}-analysis.json`);
          if (!response.ok) {
            throw new Error(`Failed to load week ${week} analysis`);
          }
          const data = await response.json();
          return { week, data };
        });

        const results = await Promise.all(loadPromises);

        // Convert array to object keyed by week
        const analysesMap = results.reduce((acc, { week, data }) => {
          acc[week] = data;
          return acc;
        }, {});

        setAnalyses(analysesMap);
        setError(null);
      } catch (err) {
        console.error('Error loading analyses:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAnalyses();
  }, []);

  // Function to add a new analysis (for live upload)
  const addAnalysis = (weekNumber, analysisData) => {
    setAnalyses(prev => ({
      ...prev,
      [weekNumber]: analysisData
    }));

    // Add week to available weeks if not already there
    if (!availableWeeks.includes(weekNumber)) {
      setAvailableWeeks(prev => [...prev, weekNumber].sort((a, b) => a - b));
    }

    // Automatically switch to the new week
    setSelectedWeek(weekNumber);
  };

  // Get current week's analysis
  const currentAnalysis = analyses[selectedWeek];

  // Get list of all students (from any week, they should be consistent)
  const allStudents = currentAnalysis?.students || [];

  const value = {
    analyses,
    loading,
    error,
    selectedWeek,
    setSelectedWeek,
    availableWeeks,
    currentAnalysis,
    allStudents,
    addAnalysis, // Export the new function
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
