import { useNavigate } from 'react-router-dom';
import { getStudentName, aggregateStudentData } from '../../utils/aggregateStudent';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function StudentCard({ student, analyses }) {
  const navigate = useNavigate();
  const studentName = getStudentName(student.student_id);
  const { growthSummary } = aggregateStudentData(student.student_id, analyses);

  // Skills are stored as objects with keys, convert to array for display
  const skillsArray = [
    { name: 'Empathy', key: 'empathy_perspective_taking', score: student.suggested_score?.empathy_perspective_taking ?? 0 },
    { name: 'Collaboration', key: 'collaboration_relationship', score: student.suggested_score?.collaboration_relationship ?? 0 },
    { name: 'Adaptability', key: 'adaptability_open_mindedness', score: student.suggested_score?.adaptability_open_mindedness ?? 0 },
    { name: 'Listening', key: 'active_listening_focus', score: student.suggested_score?.active_listening_focus ?? 0 },
    { name: 'Participation', key: 'participation_engagement', score: student.suggested_score?.participation_engagement ?? 0 },
  ];

  // Calculate average score across all skills (including 0s)
  const avgScore = skillsArray.length > 0
    ? Math.round((skillsArray.reduce((sum, skill) => sum + skill.score, 0) / skillsArray.length) * 10) / 10
    : 0;

  // Get participation growth indicator
  const participationGrowth = growthSummary.participation.change;

  const GrowthIndicator = ({ change }) => {
    if (change > 0) {
      return <TrendingUp className="w-5 h-5 text-green-600" />;
    } else if (change < 0) {
      return <TrendingDown className="w-5 h-5 text-red-600" />;
    }
    return <Minus className="w-5 h-5 text-gray-400" />;
  };

  return (
    <div
      onClick={() => navigate(`/student/${student.student_id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{studentName}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {student.total_turns} {student.total_turns === 1 ? 'turn' : 'turns'}
          </p>
        </div>
        <GrowthIndicator change={participationGrowth} />
      </div>

      {/* Skills Summary */}
      <div className="mt-4 space-y-2">
        {skillsArray.map((skill) => (
          <div key={skill.key}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-700">{skill.name}</span>
              <span className="font-medium text-gray-900">
                {skill.score}/5
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-600 h-2 rounded-full transition-all"
                style={{ width: `${(skill.score / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Overall Impression */}
      {student.overall_impression && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600 line-clamp-2">
            {student.overall_impression}
          </p>
        </div>
      )}

      {/* Average Score Badge */}
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xs text-gray-500">Average Score</span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
          {avgScore > 0 ? avgScore.toFixed(1) : 'N/A'}/5
        </span>
      </div>
    </div>
  );
}
