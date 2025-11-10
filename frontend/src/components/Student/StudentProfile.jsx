import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { aggregateStudentData, getStudentName } from '../../utils/aggregateStudent';
import { generateSkillInsight, getStudentHealthStatus } from '../../utils/skillInsights';
import { ArrowLeft, TrendingUp, Lightbulb } from 'lucide-react';
import GrowthChart from './GrowthChart';
import WeekBreakdown from './WeekBreakdown';
import InteractionPatterns from './InteractionPatterns';

export default function StudentProfile() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { analyses, loading, error } = useData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading student data...</p>
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

  const { timeline, growthSummary } = aggregateStudentData(studentId, analyses);
  const studentName = getStudentName(studentId);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Student not found</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 text-primary-600 hover:text-primary-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const firstWeek = timeline[0];
  const lastWeek = timeline[timeline.length - 1];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <button
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{studentName}</h1>
              <p className="mt-1 text-sm text-gray-500">
                Growth over {timeline.length} weeks
              </p>
            </div>

            {/* Growth Summary Badge */}
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Turns Growth</p>
              <div className="flex items-center mt-1">
                <span className="text-2xl font-bold text-gray-900">
                  {firstWeek.totalTurns} → {lastWeek.totalTurns}
                </span>
                {growthSummary.turns.change > 0 && (
                  <TrendingUp className="w-6 h-6 text-green-600 ml-2" />
                )}
              </div>
              <p className="text-sm text-green-600 font-medium mt-1">
                +{growthSummary.turns.change} turns
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Growth Chart */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Skill Progression Over Time
          </h2>
          <GrowthChart timeline={timeline} />
        </div>

        {/* Overall Health Status */}
        {(() => {
          const healthStatus = getStudentHealthStatus(growthSummary);
          return (
            <div className={`mb-8 rounded-lg border-2 p-6 ${healthStatus.color}`}>
              <div className="flex items-center space-x-3">
                <span className="text-3xl">{healthStatus.icon}</span>
                <div>
                  <h3 className="font-semibold text-lg">Overall Progress</h3>
                  <p className="mt-1">{healthStatus.message}</p>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Interaction Patterns - NEW */}
        <InteractionPatterns latestWeekData={lastWeek} />

        {/* Skills Growth Summary with Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {[
            { label: 'Empathy', key: 'empathy', dataKey: 'empathy_perspective_taking' },
            { label: 'Collaboration', key: 'collaboration', dataKey: 'collaboration_relationship' },
            { label: 'Adaptability', key: 'adaptability', dataKey: 'adaptability_open_mindedness' },
            { label: 'Listening', key: 'listening', dataKey: 'active_listening_focus' },
            { label: 'Participation', key: 'participation', dataKey: 'participation_engagement' },
          ].map(({ label, key, dataKey }) => {
            const growth = growthSummary[key];
            const insight = generateSkillInsight(
              label,
              dataKey,
              growth,
              { ...lastWeek, studentId },
              analyses
            );

            return (
              <div key={key} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl">{insight.icon}</span>
                      <h3 className="text-lg font-semibold text-gray-900">{label}</h3>
                    </div>
                    <div className="mt-2 flex items-baseline space-x-2">
                      <span className="text-3xl font-bold text-gray-900">
                        {growth.start} → {growth.end}
                      </span>
                      <span
                        className={`text-lg font-medium ${
                          growth.change > 0
                            ? 'text-green-600'
                            : growth.change < 0
                            ? 'text-red-600'
                            : 'text-gray-500'
                        }`}
                      >
                        ({growth.change > 0 ? '+' : ''}{growth.change})
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">Why this score?</p>
                        <p className="text-sm text-blue-800 mt-1">{insight.reasoning}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start space-x-2">
                      <Lightbulb className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-green-900">Teacher Action</p>
                        <p className="text-sm text-green-800 mt-1">{insight.recommendation}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Week-by-Week Breakdown */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Week-by-Week Progress
          </h2>
          <div className="space-y-4">
            {timeline.map((weekData) => (
              <WeekBreakdown
                key={weekData.week}
                weekData={weekData}
                studentId={studentId}
                analysis={analyses[weekData.week]}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
