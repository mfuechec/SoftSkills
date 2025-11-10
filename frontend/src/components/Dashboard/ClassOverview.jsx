import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import StudentCard from '../Student/StudentCard';
import WeekSelector from '../Shared/WeekSelector';
import ClassInsights from '../ClassInsights/ClassInsights';
import InterventionPriority from '../ClassInsights/InterventionPriority';
import { getAllStudents } from '../../utils/aggregateStudent';
import { Upload } from 'lucide-react';

export default function ClassOverview() {
  const navigate = useNavigate();
  const { loading, error, currentAnalysis, analyses, selectedWeek, availableWeeks } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 font-medium">Error loading data</p>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const students = currentAnalysis?.students || [];
  const metadata = currentAnalysis?.transcript_metadata || {};

  // Get previous week's analysis for comparison
  const currentWeekIdx = availableWeeks.indexOf(selectedWeek);
  const previousWeek = currentWeekIdx > 0 ? availableWeeks[currentWeekIdx - 1] : null;
  const previousAnalysis = previousWeek ? analyses[previousWeek] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                SoftSkills Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {metadata.class_context || '8th Grade Book Club'}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/upload')}
                className="flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Transcript
              </button>
              <WeekSelector />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Session Info */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Week</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {selectedWeek}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Date</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {metadata.date || 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Students</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900">
                {students.length}
              </p>
            </div>
          </div>
        </div>

        {/* Class Insights - NEW */}
        <ClassInsights analysis={currentAnalysis} />

        {/* Intervention Priority - NEW */}
        <InterventionPriority analysis={currentAnalysis} previousAnalysis={previousAnalysis} />

        {/* Students Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <StudentCard
              key={student.student_id}
              student={student}
              analyses={analyses}
            />
          ))}
        </div>

        {/* Session Analysis */}
        {currentAnalysis?.session_analysis && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Session Analysis
            </h2>
            <div className="space-y-4">
              {currentAnalysis.session_analysis.key_moments?.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Key Moments
                  </h3>
                  <ul className="list-disc list-inside space-y-1">
                    {currentAnalysis.session_analysis.key_moments.map((moment, idx) => (
                      <li key={idx} className="text-gray-600 text-sm">
                        {moment}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {currentAnalysis.session_analysis.teacher_recommendations && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">
                    Teacher Recommendations
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {currentAnalysis.session_analysis.teacher_recommendations}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
