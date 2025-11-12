import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import EvidenceCard from './EvidenceCard';

export default function WeekBreakdown({ weekData, studentId, analysis }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Find the student data in the full analysis
  const studentData = analysis.students.find((s) => s.student_id === studentId);

  if (!studentData) {
    return null;
  }

  const skillsArray = [
    { name: 'Empathy', key: 'empathy_perspective_taking' },
    { name: 'Collaboration', key: 'collaboration_relationship' },
    { name: 'Adaptability', key: 'adaptability_open_mindedness' },
    { name: 'Listening', key: 'active_listening_focus' },
    { name: 'Participation', key: 'participation_engagement' },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Week {weekData.week}
            </h3>
            <p className="text-sm text-gray-500">{weekData.date}</p>
          </div>
          <div className="text-sm text-gray-600">
            {weekData.totalTurns} {weekData.totalTurns === 1 ? 'turn' : 'turns'}
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Quick Skill Scores */}
          <div className="hidden md:flex items-center space-x-2">
            {skillsArray.map(({ key }) => {
              const score = weekData.scores[key] || 0;
              return (
                <div
                  key={key}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                    score > 0 ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {score}
                </div>
              );
            })}
          </div>

          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 py-4 border-t border-gray-200 space-y-6">
          {/* Overall Impression */}
          {studentData.overall_impression && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Overall Impression</h4>
              <p className="text-gray-600">{studentData.overall_impression}</p>
            </div>
          )}

          {/* Skills with Evidence */}
          {skillsArray.map(({ name, key }) => {
            const skillData = studentData.skills[key];
            const score = weekData.scores[key] || 0;

            if (!skillData || !skillData.examples || skillData.examples.length === 0) {
              return null;
            }

            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">{name}</h4>
                  <span className="text-sm font-medium text-gray-900">Score: {score}/5</span>
                </div>

                {skillData.pattern && (
                  <p className="text-xs text-gray-500 mb-2">
                    Pattern: {skillData.pattern} | Confidence: {skillData.confidence}
                  </p>
                )}

                <div className="space-y-3">
                  {skillData.examples.map((evidence, idx) => (
                    <EvidenceCard key={idx} evidence={evidence} skillName={name} />
                  ))}
                </div>

                {skillData.confidence_rationale && (
                  <p className="text-xs text-gray-500 mt-2 italic">
                    {skillData.confidence_rationale}
                  </p>
                )}
              </div>
            );
          })}

          {/* Growth Indicators */}
          {studentData.growth_indicators && studentData.growth_indicators.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Growth Indicators</h4>
              <ul className="list-disc list-inside space-y-1">
                {studentData.growth_indicators.map((indicator, idx) => (
                  <li key={idx} className="text-sm text-gray-600">
                    {indicator}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
