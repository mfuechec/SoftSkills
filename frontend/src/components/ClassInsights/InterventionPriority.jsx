import { AlertCircle, TrendingDown, MessageCircleOff, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function InterventionPriority({ analysis, previousAnalysis }) {
  const navigate = useNavigate();

  if (!analysis || !analysis.students) return null;

  const students = analysis.students || [];
  const prevStudents = previousAnalysis?.students || [];

  // Calculate priority scores for each student
  const priorities = students.map(student => {
    let score = 0;
    const concerns = [];

    // Find previous week data for this student
    const prevStudent = prevStudents.find(s => s.student_id === student.student_id);

    // Check for declining scores
    if (prevStudent) {
      const currentAvg = calculateAvgScore(student.suggested_score);
      const prevAvg = calculateAvgScore(prevStudent.suggested_score);
      const decline = prevAvg - currentAvg;

      if (decline > 0.5) {
        score += 3;
        concerns.push(`Scores declined by ${decline.toFixed(1)} points`);
      }

      // Check for declining participation
      const turnDecline = (prevStudent.totalTurns || 0) - (student.totalTurns || 0);
      if (turnDecline > 1) {
        score += 2;
        concerns.push(`${turnDecline} fewer turns than last week`);
      }
    }

    // Low participation
    if ((student.totalTurns || 0) < 3) {
      score += 3;
      concerns.push('Very low participation (< 3 turns)');
    }

    // No peer responses (exclusion)
    if (student.interaction_patterns?.received_responses_from?.length === 0 && (student.totalTurns || 0) > 0) {
      score += 2;
      concerns.push('Contributions received no peer responses');
    }

    // High interruption count
    if ((student.interaction_patterns?.interruption_count || 0) > 2) {
      score += 2;
      concerns.push('Frequent interruptions need addressing');
    }

    // Low engagement level
    if (student.discussion_behavior?.engagement_level === 'low') {
      score += 2;
      concerns.push('Low engagement level observed');
    }

    // Negative environment contribution
    if (student.discussion_behavior?.contribution_to_environment?.includes('detracts')) {
      score += 3;
      concerns.push('Negatively affecting discussion quality');
    }

    // Multiple skills with no evidence
    const zeroScores = Object.values(student.suggested_score || {}).filter(s => s === 0).length;
    if (zeroScores >= 3) {
      score += 2;
      concerns.push(`No evidence for ${zeroScores} skills`);
    }

    return {
      student_id: student.student_id,
      score,
      concerns,
      totalTurns: student.totalTurns || 0,
      avgScore: calculateAvgScore(student.suggested_score),
    };
  }).filter(p => p.score > 0)
    .sort((a, b) => b.score - a.score);

  if (priorities.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex items-center space-x-2 mb-4">
          <Users className="w-6 h-6 text-green-600" />
          <h2 className="text-xl font-semibold text-gray-900">Intervention Priority</h2>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <p className="text-sm text-green-800">
            No immediate intervention needs detected. All students showing healthy participation patterns.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <AlertCircle className="w-6 h-6 text-red-600" />
        <h2 className="text-xl font-semibold text-gray-900">Intervention Priority</h2>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Students who may need teacher attention based on participation patterns, score trends, and discussion behavior.
      </p>

      <div className="space-y-3">
        {priorities.slice(0, 5).map((priority, idx) => {
          const urgency = priority.score >= 6 ? 'high' : priority.score >= 4 ? 'medium' : 'low';
          const urgencyColor = urgency === 'high' ? 'red' : urgency === 'medium' ? 'yellow' : 'blue';
          const urgencyBg = urgency === 'high' ? 'bg-red-50 border-red-300' : urgency === 'medium' ? 'bg-yellow-50 border-yellow-300' : 'bg-blue-50 border-blue-300';

          return (
            <div
              key={priority.student_id}
              className={`border-2 rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow ${urgencyBg}`}
              onClick={() => navigate(`/student/${priority.student_id}`)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-${urgencyColor}-100 text-${urgencyColor}-700 font-bold text-sm`}>
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{priority.student_id}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${urgencyColor}-100 text-${urgencyColor}-800 uppercase`}>
                        {urgency} priority
                      </span>
                      <span className="text-xs text-gray-500">
                        Score: {priority.avgScore.toFixed(1)}/10 · {priority.totalTurns} turns
                      </span>
                    </div>
                  </div>
                </div>
                <div className={`text-2xl font-bold text-${urgencyColor}-600`}>
                  {priority.score}
                </div>
              </div>

              <div className="ml-11 space-y-1">
                {priority.concerns.map((concern, cIdx) => (
                  <div key={cIdx} className="flex items-start space-x-2">
                    <span className="text-xs text-gray-400 mt-0.5">•</span>
                    <p className="text-xs text-gray-700">{concern}</p>
                  </div>
                ))}
              </div>

              {/* Suggested Actions */}
              <div className="ml-11 mt-3 bg-white bg-opacity-50 rounded p-2">
                <p className="text-xs font-medium text-gray-700">Suggested Action:</p>
                <p className="text-xs text-gray-600 mt-1">
                  {generateSuggestion(priority)}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {priorities.length > 5 && (
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500">
            + {priorities.length - 5} more students with lower priority concerns
          </p>
        </div>
      )}
    </div>
  );
}

function calculateAvgScore(scores) {
  if (!scores) return 0;
  const values = Object.entries(scores)
    .filter(([key]) => key !== 'score_note')
    .map(([, value]) => value);
  if (values.length === 0) return 0;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function generateSuggestion(priority) {
  const concerns = priority.concerns;

  // Check for specific concern types and provide targeted suggestions
  if (concerns.some(c => c.includes('interruption'))) {
    return `Practice wait time strategies with ${priority.student_id}. Consider implementing a "raise hand" system or using a talking piece to help develop patience and turn-taking skills.`;
  }

  if (concerns.some(c => c.includes('low participation') || c.includes('Very low participation'))) {
    return `One-on-one check-in with ${priority.student_id} to understand barriers. Try direct questions, think-pair-share activities, or small group discussions to build confidence.`;
  }

  if (concerns.some(c => c.includes('no peer responses') || c.includes('received no peer responses'))) {
    return `Facilitate peer engagement for ${priority.student_id}. Use prompts like "What does everyone think about ${priority.student_id}'s point?" to ensure their contributions are acknowledged.`;
  }

  if (concerns.some(c => c.includes('declined') || c.includes('fewer turns'))) {
    return `Check in with ${priority.student_id} about recent drop in participation. May be experiencing personal issues, lack of preparation, or disengagement with current material.`;
  }

  if (concerns.some(c => c.includes('Low engagement'))) {
    return `Re-engage ${priority.student_id} with material. Try connecting topics to their interests, assigning a discussion role, or providing prep questions before class.`;
  }

  if (concerns.some(c => c.includes('No evidence'))) {
    return `${priority.student_id} needs more opportunities to demonstrate skills. Provide structured prompts targeting specific competencies (empathy, collaboration, etc.) during discussion.`;
  }

  // Default based on priority level
  if (priority.score >= 6) {
    return `Meet 1-on-1 with ${priority.student_id} this week to understand barriers and create an action plan for re-engagement.`;
  } else if (priority.score >= 4) {
    return `Check in with ${priority.student_id} during class. Consider peer pairing or assigning a discussion role for next session.`;
  } else {
    return `Monitor ${priority.student_id} next week. May benefit from facilitated participation or pre-discussion prep questions.`;
  }
}
