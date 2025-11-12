/**
 * Generate insights and recommendations for a skill based on score trajectory and evidence
 */
export function generateSkillInsight(skillName, skillKey, growthData, latestWeekData, analyses) {
  const { start, end, change } = growthData;

  // Get evidence count from latest week
  const latestAnalysis = analyses[latestWeekData.week];
  const student = latestAnalysis?.students?.find(s => s.student_id === latestWeekData.studentId);
  const skillData = student?.skills?.[skillKey];
  const evidenceCount = skillData?.examples?.length || 0;
  const pattern = skillData?.pattern;
  const confidence = skillData?.confidence;

  let insight = {
    status: 'unknown',
    reasoning: '',
    recommendation: '',
    icon: '📊',
  };

  // No evidence case
  if (end === 0 && evidenceCount === 0) {
    insight.status = 'no-evidence';
    insight.icon = '🔍';
    insight.reasoning = `No evidence of ${skillName.toLowerCase()} observed in discussions. This could mean the student isn't demonstrating this skill, or opportunities to show it haven't arisen.`;
    insight.recommendation = `Create targeted opportunities for ${skillName.toLowerCase()}. Ask questions that specifically invite this skill (e.g., "What do you think about [peer's] perspective?" or "How would you approach this differently?").`;
  }
  // Low score with evidence
  else if (end > 0 && end <= 4) {
    insight.status = 'emerging';
    insight.icon = '🌱';
    insight.reasoning = `${skillName} is emerging but inconsistent. Student shows ${evidenceCount} instance(s) but hasn't developed a consistent pattern yet.`;
    insight.recommendation = `Acknowledge specific moments when you see ${skillName.toLowerCase()} (e.g., "I noticed when you..."). Scaffold more opportunities to practice this skill with gentle prompts.`;
  }
  // Growth detected
  else if (change > 0) {
    if (end >= 8) {
      insight.status = 'strong-growth';
      insight.icon = '🚀';
      insight.reasoning = `Excellent progress! ${skillName} has grown from ${start} to ${end}. Student now demonstrates this skill consistently with ${evidenceCount} clear example(s) in the latest session.`;
      insight.recommendation = `Celebrate this growth! Share specific examples with the student. Consider having them mentor peers who are still developing this skill.`;
    } else {
      insight.status = 'developing';
      insight.icon = '📈';
      insight.reasoning = `Positive trajectory from ${start} to ${end}. The student is developing ${skillName.toLowerCase()} with ${evidenceCount} example(s) in recent discussions.`;
      insight.recommendation = `Continue providing opportunities to practice. Point out progress: "You're getting better at [specific behavior]. Keep it up!"`;
    }
  }
  // Strong skill (8-10) with no growth needed
  else if (end >= 8 && change === 0) {
    insight.status = 'mastery';
    insight.icon = '⭐';
    insight.reasoning = `Strong mastery of ${skillName.toLowerCase()}. Consistently demonstrates this skill with ${evidenceCount} clear example(s).`;
    insight.recommendation = `Student is modeling excellent ${skillName.toLowerCase()}. Leverage this strength by having them facilitate discussions or help peers develop this skill.`;
  }
  // Stagnant or declining
  else if (change <= 0 && end > 0) {
    insight.status = 'needs-attention';
    insight.icon = '⚠️';
    insight.reasoning = `${skillName} score has ${change < 0 ? 'declined' : 'remained flat'} (${start} → ${end}). Pattern shows: ${pattern || 'inconsistent'}.`;
    insight.recommendation = `Check in with the student. Are they disengaged? Facing challenges? Consider differentiated support or pairing with a stronger peer for collaborative learning.`;
  }
  // Moderate score, no change
  else if (end >= 5 && end <= 6 && change === 0) {
    insight.status = 'steady';
    insight.icon = '➡️';
    insight.reasoning = `Moderate ${skillName.toLowerCase()} demonstrated consistently at level ${end}. Shows ${evidenceCount} example(s) but hasn't progressed further.`;
    insight.recommendation = `Student is competent but could push further. Introduce more challenging scenarios that require deeper application of ${skillName.toLowerCase()}.`;
  }

  // Add confidence note if low confidence
  if (confidence === 'low') {
    insight.reasoning += ` Note: Confidence in this assessment is low due to limited evidence.`;
  }

  return insight;
}

/**
 * Get overall student health status based on all skills
 */
export function getStudentHealthStatus(growthSummary) {
  const skills = [
    growthSummary.empathy,
    growthSummary.collaboration,
    growthSummary.adaptability,
    growthSummary.listening,
    growthSummary.participation,
  ];

  const growthCount = skills.filter(s => s.change > 0).length;
  const declineCount = skills.filter(s => s.change < 0).length;
  const highScores = skills.filter(s => s.end >= 8).length;
  const lowScores = skills.filter(s => s.end <= 2).length;

  if (growthCount >= 3 && highScores >= 2) {
    return {
      status: 'thriving',
      icon: '🌟',
      message: 'Student is thriving! Multiple skills showing strong growth.',
      color: 'text-green-700 bg-green-50 border-green-200',
    };
  } else if (growthCount >= 2) {
    return {
      status: 'growing',
      icon: '📈',
      message: 'Positive trajectory. Student is developing well across multiple skills.',
      color: 'text-blue-700 bg-blue-50 border-blue-200',
    };
  } else if (declineCount >= 2 || lowScores >= 3) {
    return {
      status: 'needs-support',
      icon: '⚠️',
      message: 'Student may need additional support. Consider intervention or 1-on-1 check-in.',
      color: 'text-red-700 bg-red-50 border-red-200',
    };
  } else {
    return {
      status: 'stable',
      icon: '➡️',
      message: 'Student is stable. Look for opportunities to encourage growth in specific areas.',
      color: 'text-gray-700 bg-gray-50 border-gray-200',
    };
  }
}
