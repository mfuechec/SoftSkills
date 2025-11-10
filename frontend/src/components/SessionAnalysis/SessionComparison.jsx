import { TrendingUp, TrendingDown, Minus, Lightbulb, CheckCircle, AlertCircle } from 'lucide-react';

export default function SessionComparison({ currentAnalysis, previousAnalysis }) {
  if (!currentAnalysis || !previousAnalysis) {
    return null;
  }

  const current = currentAnalysis.session_analysis || {};
  const previous = previousAnalysis.session_analysis || {};
  const currentMeta = currentAnalysis.transcript_metadata || {};
  const previousMeta = previousAnalysis.transcript_metadata || {};

  // Calculate changes
  const changes = calculateChanges(current, previous, currentAnalysis.students, previousAnalysis.students);

  if (changes.improvements.length === 0 && changes.declines.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Compared to {previousMeta.week ? `Week ${previousMeta.week.replace('Week ', '')}` : 'Previous Week'}
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          What changed this week and how it affected the discussion:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Improvements */}
          {changes.improvements.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <h4 className="text-sm font-semibold text-green-900">What Got Better</h4>
              </div>
              <ul className="space-y-2">
                {changes.improvements.map((improvement, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-900">{improvement.metric}</p>
                      <p className="text-xs text-green-700 mt-0.5">{improvement.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Declines */}
          {changes.declines.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <TrendingDown className="w-5 h-5 text-red-600" />
                <h4 className="text-sm font-semibold text-red-900">What Declined</h4>
              </div>
              <ul className="space-y-2">
                {changes.declines.map((decline, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900">{decline.metric}</p>
                      <p className="text-xs text-red-700 mt-0.5">{decline.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Insights */}
        {changes.insights.length > 0 && (
          <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900 mb-2">Possible Correlations</h4>
                <ul className="space-y-1">
                  {changes.insights.map((insight, idx) => (
                    <li key={idx} className="text-xs text-blue-800">
                      • {insight}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Context Changes */}
        {(currentMeta.topic !== previousMeta.topic || currentMeta.duration_minutes !== previousMeta.duration_minutes) && (
          <div className="mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
            <h4 className="text-xs font-semibold text-gray-700 mb-2">Session Context</h4>
            <div className="space-y-1 text-xs text-gray-600">
              {currentMeta.topic !== previousMeta.topic && (
                <p>
                  <span className="font-medium">Topic changed:</span> "{previousMeta.topic}" → "{currentMeta.topic}"
                </p>
              )}
              {currentMeta.duration_minutes !== previousMeta.duration_minutes && (
                <p>
                  <span className="font-medium">Duration:</span> {previousMeta.duration_minutes || 'N/A'} min → {currentMeta.duration_minutes || 'N/A'} min
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function calculateChanges(current, previous, currentStudents, previousStudents) {
  const improvements = [];
  const declines = [];
  const insights = [];

  // Compare participation equity
  const equityChange = (current.participation_equity_score || 0) - (previous.participation_equity_score || 0);
  if (equityChange > 0.5) {
    improvements.push({
      metric: 'Participation Equity',
      description: `Improved by ${equityChange.toFixed(1)} points (${previous.participation_equity_score || 0} → ${current.participation_equity_score || 0}). Speaking turns more evenly distributed.`
    });
    insights.push('More balanced participation may indicate better facilitation or increased comfort among quieter students.');
  } else if (equityChange < -0.5) {
    declines.push({
      metric: 'Participation Equity',
      description: `Declined by ${Math.abs(equityChange).toFixed(1)} points (${previous.participation_equity_score || 0} → ${current.participation_equity_score || 0}). Discussion became more dominated.`
    });
    insights.push('Consider strategies to bring in quieter voices: direct questions, think-pair-share, or assigning roles.');
  }

  // Compare discussion depth
  const depthChange = (current.discussion_depth_score || 0) - (previous.discussion_depth_score || 0);
  if (depthChange > 0.5) {
    improvements.push({
      metric: 'Discussion Depth',
      description: `Improved by ${depthChange.toFixed(1)} points (${previous.discussion_depth_score || 0} → ${current.discussion_depth_score || 0}). More evidence-based reasoning.`
    });
    if ((current.evidence_citation_count || 0) > (previous.evidence_citation_count || 0)) {
      insights.push('Increased text citations may have driven deeper analysis. Consider requiring evidence in future discussions.');
    }
  } else if (depthChange < -0.5) {
    declines.push({
      metric: 'Discussion Depth',
      description: `Declined by ${Math.abs(depthChange).toFixed(1)} points (${previous.discussion_depth_score || 0} → ${current.discussion_depth_score || 0}). More surface-level discussion.`
    });
    insights.push('Try pre-discussion prompts, Socratic questioning, or requiring students to cite text before opining.');
  }

  // Compare evidence citations
  const citationChange = (current.evidence_citation_count || 0) - (previous.evidence_citation_count || 0);
  if (citationChange > 2) {
    improvements.push({
      metric: 'Evidence Use',
      description: `${citationChange} more text citations (${previous.evidence_citation_count || 0} → ${current.evidence_citation_count || 0}). Students grounded claims in evidence.`
    });
  } else if (citationChange < -2) {
    declines.push({
      metric: 'Evidence Use',
      description: `${Math.abs(citationChange)} fewer text citations (${previous.evidence_citation_count || 0} → ${current.evidence_citation_count || 0}). Less grounded in text.`
    });
  }

  // Compare interaction health
  if (current.interaction_health !== previous.interaction_health) {
    const healthMap = { 'weak': 1, 'moderate': 2, 'strong': 3 };
    const currentHealth = healthMap[current.interaction_health] || 2;
    const previousHealth = healthMap[previous.interaction_health] || 2;

    if (currentHealth > previousHealth) {
      improvements.push({
        metric: 'Interaction Quality',
        description: `Improved from ${previous.interaction_health} to ${current.interaction_health}. Students building on each other's ideas more.`
      });
      insights.push('Strong peer interaction creates momentum. Note what facilitation moves encouraged this.');
    } else if (currentHealth < previousHealth) {
      declines.push({
        metric: 'Interaction Quality',
        description: `Declined from ${previous.interaction_health} to ${current.interaction_health}. Less peer-to-peer engagement.`
      });
      insights.push('Try "agree, disagree, or build" protocol to increase student-to-student interaction.');
    }
  }

  // Compare perspective diversity
  if (current.perspective_diversity !== previous.perspective_diversity) {
    const diversityMap = { 'low': 1, 'medium': 2, 'high': 3 };
    const currentDiv = diversityMap[current.perspective_diversity] || 2;
    const previousDiv = diversityMap[previous.perspective_diversity] || 2;

    if (currentDiv > previousDiv) {
      improvements.push({
        metric: 'Perspective Diversity',
        description: `Improved from ${previous.perspective_diversity} to ${current.perspective_diversity}. Multiple viewpoints explored.`
      });
    } else if (currentDiv < previousDiv) {
      declines.push({
        metric: 'Perspective Diversity',
        description: `Declined from ${previous.perspective_diversity} to ${current.perspective_diversity}. Less variety in viewpoints.`
      });
      insights.push('Consider assigning devil\'s advocate roles or using "what if..." prompts to surface diverse views.');
    }
  }

  // Compare average class scores
  const currentAvg = calculateClassAverage(currentStudents);
  const previousAvg = calculateClassAverage(previousStudents);
  const avgChange = currentAvg - previousAvg;

  if (avgChange > 0.3) {
    improvements.push({
      metric: 'Class Average Scores',
      description: `Improved by ${avgChange.toFixed(1)} points (${previousAvg.toFixed(1)} → ${currentAvg.toFixed(1)}). Overall skill demonstration increased.`
    });
  } else if (avgChange < -0.3) {
    declines.push({
      metric: 'Class Average Scores',
      description: `Declined by ${Math.abs(avgChange).toFixed(1)} points (${previousAvg.toFixed(1)} → ${currentAvg.toFixed(1)}). Overall skill demonstration decreased.`
    });
  }

  // Compare participation count
  const currentTurns = (currentStudents || []).reduce((sum, s) => sum + (s.totalTurns || 0), 0);
  const previousTurns = (previousStudents || []).reduce((sum, s) => sum + (s.totalTurns || 0), 0);
  const turnChange = currentTurns - previousTurns;

  if (turnChange > 5) {
    improvements.push({
      metric: 'Total Participation',
      description: `${turnChange} more turns (${previousTurns} → ${currentTurns}). Students spoke more overall.`
    });
  } else if (turnChange < -5) {
    declines.push({
      metric: 'Total Participation',
      description: `${Math.abs(turnChange)} fewer turns (${previousTurns} → ${currentTurns}). Less overall participation.`
    });
  }

  // Generate correlation insights
  if (improvements.length > 0 && declines.length > 0) {
    insights.push('Mixed results suggest the discussion format had both strengths and weaknesses worth analyzing.');
  } else if (improvements.length >= 3) {
    insights.push('Multiple positive indicators suggest this discussion format was particularly effective. Replicate these conditions.');
  } else if (declines.length >= 3) {
    insights.push('Several declining metrics suggest the discussion format needs adjustment. Consider what changed.');
  }

  return { improvements, declines, insights };
}

function calculateClassAverage(students) {
  if (!students || students.length === 0) return 0;

  let totalScore = 0;
  let scoreCount = 0;

  students.forEach(student => {
    const scores = student.suggested_score || {};
    Object.entries(scores).forEach(([key, value]) => {
      if (key !== 'score_note' && typeof value === 'number') {
        totalScore += value;
        scoreCount++;
      }
    });
  });

  return scoreCount > 0 ? totalScore / scoreCount : 0;
}
