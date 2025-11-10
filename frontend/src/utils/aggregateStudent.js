/**
 * Aggregate student data across all weeks to show growth timeline
 */
export function aggregateStudentData(studentId, analyses) {
  const weeks = Object.keys(analyses)
    .map(Number)
    .sort((a, b) => a - b);

  const timeline = weeks.map((week) => {
    const analysis = analyses[week];
    const student = analysis.students.find((s) => s.student_id === studentId);

    if (!student) {
      return null;
    }

    return {
      week,
      date: analysis.transcript_metadata.date,
      totalTurns: student.total_turns,
      skills: student.skills || {},
      scores: student.suggested_score || {},
      participation: student.overall_impression || '',
    };
  }).filter(Boolean);

  // Compute growth metrics
  const growthSummary = computeGrowth(timeline);

  // Get student info from most recent week
  const latestWeek = timeline[timeline.length - 1];
  const studentInfo = latestWeek ? {
    id: studentId,
    name: studentId, // We'll derive the actual name from the ID
  } : null;

  return {
    studentInfo,
    timeline,
    growthSummary,
  };
}

/**
 * Compute growth metrics across timeline
 */
function computeGrowth(timeline) {
  if (timeline.length < 2) {
    return {
      participation: { start: 0, end: 0, change: 0 },
      collaboration: { start: 0, end: 0, change: 0 },
      empathy: { start: 0, end: 0, change: 0 },
      criticalThinking: { start: 0, end: 0, change: 0 },
      selfReflection: { start: 0, end: 0, change: 0 },
      turns: { start: 0, end: 0, change: 0 },
    };
  }

  const first = timeline[0];
  const last = timeline[timeline.length - 1];

  const calculateChange = (scoreKey) => {
    const start = first.scores[scoreKey] || 0;
    const end = last.scores[scoreKey] || 0;

    return {
      start,
      end,
      change: end - start,
    };
  };

  return {
    empathy: calculateChange('empathy_perspective_taking'),
    collaboration: calculateChange('collaboration_relationship'),
    adaptability: calculateChange('adaptability_open_mindedness'),
    listening: calculateChange('active_listening_focus'),
    participation: calculateChange('participation_engagement'),
    turns: {
      start: first.totalTurns,
      end: last.totalTurns,
      change: last.totalTurns - first.totalTurns,
    },
  };
}

/**
 * Get all unique students across all analyses
 */
export function getAllStudents(analyses) {
  const studentIds = new Set();

  Object.values(analyses).forEach((analysis) => {
    analysis.students.forEach((student) => {
      studentIds.add(student.student_id);
    });
  });

  return Array.from(studentIds).sort();
}

/**
 * Helper to convert student_id to display name
 */
export function getStudentName(studentId) {
  // Map student IDs to actual names
  const nameMap = {
    alex: 'Alex',
    jordan: 'Jordan',
    sam: 'Sam',
    taylor: 'Taylor',
    casey: 'Casey',
  };

  return nameMap[studentId.toLowerCase()] || studentId;
}
