import { MessageCircle, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

export default function InteractionPatterns({ latestWeekData }) {
  if (!latestWeekData) return null;

  const patterns = latestWeekData.interaction_patterns;
  const behavior = latestWeekData.discussion_behavior;

  // Skip if no interaction data
  if (!patterns && !behavior) return null;

  const hasInteractions = patterns && (
    patterns.responded_to?.length > 0 ||
    patterns.built_upon_ideas_from?.length > 0 ||
    patterns.received_responses_from?.length > 0
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
      <div className="flex items-center space-x-2 mb-4">
        <MessageCircle className="w-6 h-6 text-primary-600" />
        <h2 className="text-xl font-semibold text-gray-900">Discussion Behavior & Interactions</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interaction Patterns */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Peer Interactions</h3>

          {hasInteractions ? (
            <div className="space-y-3">
              {patterns.responded_to && patterns.responded_to.length > 0 && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-blue-900 mb-1">Responded to:</p>
                  <div className="flex flex-wrap gap-1">
                    {patterns.responded_to.map((name, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patterns.built_upon_ideas_from && patterns.built_upon_ideas_from.length > 0 && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-green-900 mb-1">Built upon ideas from:</p>
                  <div className="flex flex-wrap gap-1">
                    {patterns.built_upon_ideas_from.map((name, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patterns.received_responses_from && patterns.received_responses_from.length > 0 && (
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                  <p className="text-xs font-medium text-purple-900 mb-1">Received responses from:</p>
                  <div className="flex flex-wrap gap-1">
                    {patterns.received_responses_from.map((name, idx) => (
                      <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                        {name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {patterns.received_responses_from && patterns.received_responses_from.length === 0 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-yellow-800">
                      This student's contributions did not receive responses from peers. Consider facilitating engagement with their ideas.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No interaction data available for this week</p>
          )}
        </div>

        {/* Discussion Behavior Metrics */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Behavior Patterns</h3>

          <div className="space-y-3">
            {/* Speaking Time */}
            {latestWeekData.speaking_time_estimate && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Speaking Time</span>
                <span className="text-sm font-medium text-gray-900">{latestWeekData.speaking_time_estimate}</span>
              </div>
            )}

            {/* Turn Length */}
            {patterns?.turn_length && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Turn Length</span>
                <span className="text-sm font-medium text-gray-900 capitalize">{patterns.turn_length}</span>
              </div>
            )}

            {/* Topics Initiated */}
            {patterns?.initiated_topics !== undefined && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Topics Initiated</span>
                <span className="text-sm font-medium text-gray-900">{patterns.initiated_topics}</span>
              </div>
            )}

            {/* Interruptions */}
            {patterns?.interruption_count !== undefined && (
              <div className={`rounded-lg p-3 ${
                patterns.interruption_count === 0
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-700">Interruptions</span>
                  <span className={`text-sm font-bold ${
                    patterns.interruption_count === 0 ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {patterns.interruption_count}
                  </span>
                </div>
                {patterns.interruption_count > 0 && patterns.was_interrupted_by && patterns.was_interrupted_by.length > 0 && (
                  <p className="text-xs text-red-800 mt-1">
                    Interrupted by: {patterns.was_interrupted_by.join(', ')}
                  </p>
                )}
              </div>
            )}

            {/* Engagement Level */}
            {behavior?.engagement_level && (
              <div className="flex items-center justify-between py-2 border-b border-gray-200">
                <span className="text-sm text-gray-600">Engagement Level</span>
                <span className={`text-sm font-medium capitalize ${
                  behavior.engagement_level === 'high' ? 'text-green-600' :
                  behavior.engagement_level === 'medium' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {behavior.engagement_level}
                </span>
              </div>
            )}

            {/* Contribution to Environment */}
            {behavior?.contribution_to_environment && (
              <div className={`rounded-lg border p-3 ${
                behavior.contribution_to_environment.includes('Enhances')
                  ? 'bg-green-50 border-green-200'
                  : behavior.contribution_to_environment.includes('detracts')
                  ? 'bg-red-50 border-red-200'
                  : 'bg-gray-50 border-gray-200'
              }`}>
                <div className="flex items-start space-x-2">
                  {behavior.contribution_to_environment.includes('Enhances') ? (
                    <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                  ) : behavior.contribution_to_environment.includes('detracts') ? (
                    <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                  ) : (
                    <MessageCircle className="w-4 h-4 text-gray-600 flex-shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-xs font-medium text-gray-700">Environment Impact</p>
                    <p className="text-xs text-gray-600 mt-0.5">{behavior.contribution_to_environment}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Response Rate */}
            {behavior?.response_rate && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs font-medium text-blue-900">Peer Engagement</p>
                <p className="text-xs text-blue-800 mt-1">{behavior.response_rate}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
