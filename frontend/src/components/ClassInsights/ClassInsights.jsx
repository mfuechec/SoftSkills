import { Users, TrendingUp, MessageCircle, AlertCircle, CheckCircle, BarChart3 } from 'lucide-react';

export default function ClassInsights({ analysis }) {
  if (!analysis || !analysis.session_analysis) {
    return null;
  }

  const session = analysis.session_analysis;
  const students = analysis.students || [];

  // Calculate participation distribution
  const totalTurns = students.reduce((sum, s) => sum + (s.totalTurns || 0), 0);
  const participationData = students
    .map(s => ({
      name: s.student_id,
      turns: s.totalTurns || 0,
      percentage: totalTurns > 0 ? ((s.totalTurns || 0) / totalTurns * 100).toFixed(1) : 0,
    }))
    .sort((a, b) => b.turns - a.turns);

  // Equity score color
  const equityScore = session.participation_equity_score || 5;
  const equityColor = equityScore >= 7 ? 'text-green-600' : equityScore >= 4 ? 'text-yellow-600' : 'text-red-600';
  const equityBg = equityScore >= 7 ? 'bg-green-50 border-green-200' : equityScore >= 4 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  // Discussion quality color
  const qualityScore = session.discussion_depth_score || 5;
  const qualityColor = qualityScore >= 7 ? 'text-green-600' : qualityScore >= 4 ? 'text-yellow-600' : 'text-red-600';
  const qualityBg = qualityScore >= 7 ? 'bg-green-50 border-green-200' : qualityScore >= 4 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  // Interaction health color
  const interactionHealth = session.interaction_health || 'moderate';
  const interactionColor = interactionHealth === 'strong' ? 'text-green-600' : interactionHealth === 'moderate' ? 'text-yellow-600' : 'text-red-600';
  const interactionBg = interactionHealth === 'strong' ? 'bg-green-50 border-green-200' : interactionHealth === 'moderate' ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200';

  const environmentQuality = session.environment_quality || {};

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-bold text-gray-900">Discussion Environment</h2>
        </div>
        <div className="text-sm text-gray-500">
          {analysis.transcript_metadata?.week || 'Current Week'}
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Participation Equity */}
        <div className={`rounded-lg border p-4 ${equityBg}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Users className={`w-5 h-5 ${equityColor}`} />
              <span className="text-sm font-medium text-gray-700">Participation Equity</span>
            </div>
            <span className={`text-2xl font-bold ${equityColor}`}>{equityScore}/10</span>
          </div>
          <p className="text-xs text-gray-600">
            {session.participation_distribution === 'even' && 'Balanced participation across students'}
            {session.participation_distribution === 'skewed_to_few' && 'A few students dominate discussion'}
            {session.participation_distribution === 'dominated_by_one' && 'One student dominates discussion'}
            {!session.participation_distribution && 'Distribution pattern not analyzed'}
          </p>
        </div>

        {/* Discussion Quality */}
        <div className={`rounded-lg border p-4 ${qualityBg}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <TrendingUp className={`w-5 h-5 ${qualityColor}`} />
              <span className="text-sm font-medium text-gray-700">Discussion Depth</span>
            </div>
            <span className={`text-2xl font-bold ${qualityColor}`}>{qualityScore}/10</span>
          </div>
          <p className="text-xs text-gray-600">
            {qualityScore >= 7 && 'Deep, evidence-based discussion'}
            {qualityScore >= 4 && qualityScore < 7 && 'Some reasoning, needs more depth'}
            {qualityScore < 4 && 'Surface-level opinions'}
            {session.evidence_citation_count > 0 && ` · ${session.evidence_citation_count} text citations`}
          </p>
        </div>

        {/* Interaction Health */}
        <div className={`rounded-lg border p-4 ${interactionBg}`}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <MessageCircle className={`w-5 h-5 ${interactionColor}`} />
              <span className="text-sm font-medium text-gray-700">Interaction Quality</span>
            </div>
            <span className={`text-sm font-semibold ${interactionColor} uppercase`}>
              {interactionHealth}
            </span>
          </div>
          <p className="text-xs text-gray-600">
            {interactionHealth === 'strong' && 'Students frequently build on each other\'s ideas'}
            {interactionHealth === 'moderate' && 'Some idea-building, room for more collaboration'}
            {interactionHealth === 'weak' && 'Mostly parallel monologues, limited interaction'}
            {session.conversational_turns > 0 && ` · ${session.conversational_turns} conversational turns`}
          </p>
        </div>
      </div>

      {/* Participation Distribution Chart */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Speaking Turn Distribution</h3>
        <div className="space-y-2">
          {participationData.map((student, idx) => (
            <div key={student.name} className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-600 w-20 text-right">
                {student.name}
              </span>
              <div className="flex-1 bg-gray-100 rounded-full h-6 relative">
                <div
                  className={`h-6 rounded-full flex items-center justify-end pr-2 overflow-hidden ${
                    student.percentage > 30 ? 'bg-red-500' :
                    student.percentage > 20 ? 'bg-yellow-500' :
                    'bg-primary-500'
                  }`}
                  style={{ width: `${Math.max(student.percentage, 5)}%` }}
                >
                  <span className="text-xs font-semibold text-white whitespace-nowrap">
                    {student.turns} ({student.percentage}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Environment Quality Insights */}
      {environmentQuality && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Concerns */}
          {(environmentQuality.domination_concerns?.length > 0 || environmentQuality.exclusion_concerns?.length > 0) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-red-900 mb-2">Environment Concerns</h4>
                  <ul className="text-xs text-red-800 space-y-1">
                    {environmentQuality.domination_concerns?.map((concern, idx) => (
                      <li key={`dom-${idx}`}>• {concern}</li>
                    ))}
                    {environmentQuality.exclusion_concerns?.map((concern, idx) => (
                      <li key={`excl-${idx}`}>• {concern}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Positive Patterns */}
          {environmentQuality.positive_patterns?.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-start space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-green-900 mb-2">Positive Patterns</h4>
                  <ul className="text-xs text-green-800 space-y-1">
                    {environmentQuality.positive_patterns.map((pattern, idx) => (
                      <li key={idx}>• {pattern}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
