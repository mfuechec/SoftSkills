# UI Specification & Data Requirements
## Middle School Non-Academic Skills Measurement Engine

**Date**: November 10, 2025
**Purpose**: Define UI layouts and derive data requirements
**Approach**: UI-first design → Data needs

---

## Design Philosophy

### Core Principles

1. **Evidence-First Visual Hierarchy**
   - Quotes are the hero (large, highlighted)
   - Scores are secondary (smaller, de-emphasized)
   - Context is always present (never just a number alone)

2. **Progressive Disclosure**
   - Dashboard: High-level overview (5 students at a glance)
   - Student Page: Deep dive (one student, all skills, all weeks)
   - Evidence Card: Maximum detail (quote, context, behavior)

3. **Growth Over Static State**
   - Always show progression (Week 10 → current)
   - Trends are visual (charts, arrows, color coding)
   - Celebrate improvement (highlight positive deltas)

4. **Teacher-Centric Language**
   - "Evidence" not "data"
   - "Observations" not "scores"
   - "Coaching opportunities" not "problems"

---

## Page 1: Class Dashboard

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER                                                      │
│  📚 8th Grade Book Club - Week 19 Analysis                  │
│  [Week Selector: 10 | 12 | 15 | 17 | ►19 | Upload Week 20] │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  CLASS OVERVIEW (Session Analysis)                          │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ 📊 Session Quality: High Engagement                     ││
│  │ 💡 Key Moment: Alex's synthesis of multiple viewpoints  ││
│  │ ⚠️  Areas to Watch: None this week                      ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STUDENT CARDS (Grid: 2-3 columns responsive)               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  👤 MAYA     │  │  👤 JORDAN   │  │  👤 ALEX     │      │
│  │  9 turns     │  │  8 turns     │  │  6 turns     │      │
│  │  ────────    │  │  ────────    │  │  ────────    │      │
│  │  Skills:     │  │  Skills:     │  │  Skills:     │      │
│  │  😊 Emp  4↑  │  │  😊 Emp  4→  │  │  😊 Emp  0→  │      │
│  │  🤝 Col  4→  │  │  🤝 Col  4→  │  │  🤝 Col  3↑  │      │
│  │  🧠 Adapt 3→ │  │  🧠 Adapt 3→ │  │  🧠 Adapt 0→ │      │
│  │  👂 List 4→  │  │  👂 List 4→  │  │  👂 List 3→  │      │
│  │  💬 Part 4→  │  │  💬 Part 4→  │  │  💬 Part 3↑  │      │
│  │              │  │              │  │              │      │
│  │ [View Profile]  │ [View Profile]  │ [View Profile]      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐                        │
│  │  👤 SAM      │  │  👤 CASEY    │                        │
│  │  6 turns     │  │  7 turns     │                        │
│  │  ────────    │  │  ────────    │                        │
│  │  Skills:     │  │  Skills:     │                        │
│  │  😊 Emp  0→  │  │  😊 Emp  3→  │                        │
│  │  🤝 Col  0→  │  │  🤝 Col  3→  │                        │
│  │  🧠 Adapt 0→ │  │  🧠 Adapt 2→ │                        │
│  │  👂 List 2→  │  │  👂 List 3→  │                        │
│  │  💬 Part 3→  │  │  💬 Part 3→  │                        │
│  │              │  │              │                        │
│  │ [View Profile]  │ [View Profile]                        │
│  └──────────────┘  └──────────────┘                        │
└─────────────────────────────────────────────────────────────┘
```

### Data Requirements (Dashboard)

```javascript
// For selected week (e.g., Week 19)
{
  "week": 19,
  "date": "2025-03-19",
  "topic": "Discussion topic",

  // Session-level summary
  "session_summary": {
    "overall_engagement": "high",  // Display as badge
    "key_moment": "String to display",  // 1 most important
    "concerns": ["String"] | [],  // Empty if none
    "student_count": 5,
    "total_turns": 36
  },

  // Per-student cards
  "students": [
    {
      "student_id": "Alex",
      "display_name": "Alex",  // For UI
      "avatar_initials": "A",  // For avatar
      "total_turns": 6,

      // Skill scores for this week
      "skills": {
        "empathy": {
          "score": 0,  // 0-5
          "delta": 0,  // Change from previous week
          "trend": "stable"  // "improving", "declining", "stable"
        },
        "collaboration": {
          "score": 3,
          "delta": +1,
          "trend": "improving"
        },
        "adaptability": {
          "score": 0,
          "delta": 0,looks
          "trend": "stable"
        },
        "listening": {
          "score": 3,
          "delta": 0,
          "trend": "stable"
        },
        "participation": {
          "score": 3,
          "delta": +1,
          "trend": "improving"
        }
      }
    }
  ]
}
```

### UI Elements Breakdown

**Week Selector**:
- Shows weeks 10, 12, 15, 17, 19
- Active week highlighted
- "Upload Week 20" button (different style)

**Session Overview Card**:
- Engagement badge (color-coded: green=high, yellow=medium, red=low)
- 1 key moment (most important)
- Concerns (show if any, hide if none)

**Student Card**:
- Avatar (initials in colored circle)
- Name + turn count
- 5 skill rows:
  - Icon + Label + Score + Trend arrow
  - Trend arrows: ↑ (green), ↓ (red), → (gray)
- "View Profile" button

---

## Page 2: Student Profile (Alex)

### Layout

```
┌─────────────────────────────────────────────────────────────┐
│  [← Back to Dashboard]                                       │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  STUDENT HEADER                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  👤 Alex                                    Week 10 → 19 ││
│  │  Journey: From minimal participation to active engagement││
│  │  Latest: 6 turns in Week 19                             ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  GROWTH TIMELINE (Chart)                                     │
│  ┌──────────────────────────────────────────────────────────┐│
│  │      5 │                                          📊    ││
│  │        │                                    🤝──────    ││
│  │      4 │                                  /             ││
│  │        │                              💬─/              ││
│  │      3 │                          👂/                   ││
│  │        │                        /                       ││
│  │      2 │                                                ││
│  │        │                                                ││
│  │      1 │        💬                                      ││
│  │        │                                                ││
│  │      0 │  😊🤝🧠👂─────────────────────😊🧠              ││
│  │        └────────────────────────────────────────        ││
│  │          W10   W12   W15   W17   W19                    ││
│  │                                                          ││
│  │  Legend: 😊 Empathy  🤝 Collaboration  🧠 Adaptability  ││
│  │          👂 Listening  💬 Participation                 ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  SKILL TABS                                                  │
│  [ 😊 Empathy ][ 🤝 Collaboration ][ 🧠 Adapt ][ 👂 Listen ][ 💬 Part ]
│                                                              │
│  ──────────────────────────────────────────────────────────  │
│                                                              │
│  COLLABORATION & RELATIONSHIP SKILLS              Score: 3  │
│  Pattern: Developing  |  Confidence: Medium                 │
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  WEEK 19                                    3 🟢 Medium ││
│  │  "It reminds me of what Jordan said about social media."││
│  │  📍 Context: Connecting Jordan's point to broader theme ││
│  │  ✨ Behavior: Synthesizing multiple viewpoints          ││
│  │  📝 Reference: Line 27                                  ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  WEEK 15                                    2 🟡 Medium ││
│  │  "What if we thought about it like..."                  ││
│  │  📍 Context: Proposing alternative perspective          ││
│  │  ✨ Behavior: Building on others' ideas                ││
│  │  📝 Reference: Line 18                                  ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  WEEK 10-12                                 0 ⚪ Low    ││
│  │  Insufficient evidence - too few turns to assess        ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Data Requirements (Student Profile)

```javascript
// Aggregated student data across all weeks
{
  "student_id": "Alex",
  "display_name": "Alex",
  "avatar_initials": "A",

  // Summary across all weeks
  "summary": {
    "first_week": 10,
    "latest_week": 19,
    "total_weeks": 5,
    "journey_description": "From minimal participation to active engagement",
    "latest_turns": 6,
    "total_turns_all_time": 22  // Sum across all weeks
  },

  // Timeline data (for chart)
  "timeline": [
    {
      "week": 10,
      "date": "2025-01-15",
      "turns": 2,
      "scores": {
        "empathy": 0,
        "collaboration": 0,
        "adaptability": 0,
        "listening": 0,
        "participation": 1
      }
    },
    {
      "week": 12,
      "date": "2025-01-29",
      "turns": 3,
      "scores": {
        "empathy": 0,
        "collaboration": 0,
        "adaptability": 0,
        "listening": 0,
        "participation": 1
      }
    },
    // ... weeks 15, 17, 19
  ],

  // Per-skill evidence (for skill tabs)
  "skills": {
    "collaboration": {
      "current_score": 3,
      "pattern": "developing",  // From latest week
      "confidence": "medium",
      "confidence_rationale": "Multiple examples across recent weeks",

      // All evidence across all weeks, newest first
      "evidence_timeline": [
        {
          "week": 19,
          "score": 3,
          "confidence": "medium",
          "items": [
            {
              "quote": "It reminds me of what Jordan said about social media.",
              "context": "Connecting Jordan's point to broader theme",
              "behavior_observed": "Synthesizing multiple viewpoints",
              "line_reference": "Line 27"
            }
          ]
        },
        {
          "week": 17,
          "score": 0,
          "confidence": "low",
          "items": []  // No evidence
        },
        {
          "week": 15,
          "score": 2,
          "confidence": "medium",
          "items": [
            {
              "quote": "What if we thought about it like...",
              "context": "Proposing alternative perspective",
              "behavior_observed": "Building on others' ideas",
              "line_reference": "Line 18"
            }
          ]
        },
        {
          "week": 12,
          "score": 0,
          "confidence": "low",
          "items": []
        },
        {
          "week": 10,
          "score": 0,
          "confidence": "low",
          "items": []
        }
      ]
    },
    // ... other skills
  }
}
```

### UI Elements Breakdown

**Student Header**:
- Name + avatar
- Journey description (auto-generated or manual)
- Date range (Week 10 → 19)
- Latest turn count

**Growth Timeline Chart**:
- Line chart (Recharts)
- 5 lines (one per skill)
- X-axis: Weeks (10, 12, 15, 17, 19)
- Y-axis: Scores (0-5)
- Legend with skill icons

**Skill Tabs**:
- 5 tabs (one per skill)
- Active tab shows:
  - Skill name + current score
  - Pattern + confidence badge
  - Evidence timeline (reverse chronological)

**Evidence Card**:
- Week badge + score + confidence indicator
- Quote (large, highlighted)
- Context (smaller text)
- Behavior observed
- Line reference (link-style, clickable later)

---

## Page 3: Upload Week 20

### Layout (Pre-Upload)

```
┌─────────────────────────────────────────────────────────────┐
│  UPLOAD WEEK 20 TRANSCRIPT                                   │
│  ┌──────────────────────────────────────────────────────────┐│
│  │  📄 Week 20 - Ready to Analyze                          ││
│  │                                                          ││
│  │  The dashboard currently shows Weeks 10-19.             ││
│  │  Upload Week 20 to see the latest student progress.     ││
│  │                                                          ││
│  │  ┌────────────────────────────────────────────────────┐ ││
│  │  │                                                    │ ││
│  │  │  [Paste transcript here or select file]           │ ││
│  │  │                                                    │ ││
│  │  │  # Week 20 - The Giver Book Club Discussion       │ ││
│  │  │  **Date:** March 26, 2025                          │ ││
│  │  │  **Topic:** Control vs. Freedom...                 │ ││
│  │  │  ...                                               │ ││
│  │  │                                                    │ ││
│  │  └────────────────────────────────────────────────────┘ ││
│  │                                                          ││
│  │  [Cancel]                          [Analyze Week 20 →] ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Layout (Processing)

```
┌─────────────────────────────────────────────────────────────┐
│  ANALYZING WEEK 20...                                        │
│  ┌──────────────────────────────────────────────────────────┐│
│  │                                                          ││
│  │          🤖 AI is analyzing the discussion...            ││
│  │                                                          ││
│  │          ████████████░░░░░░░░░░░  60%                   ││
│  │                                                          ││
│  │          Extracting evidence from 36 conversational     ││
│  │          turns across 5 students...                     ││
│  │                                                          ││
│  │          Estimated time: 30-45 seconds                  ││
│  │                                                          ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Layout (Key Learnings Modal - After Analysis)

```
┌─────────────────────────────────────────────────────────────┐
│  ✨ WEEK 20 KEY LEARNINGS                            [Close]│
│  ┌──────────────────────────────────────────────────────────┐│
│  │  🎯 BREAKTHROUGH MOMENTS                                ││
│  │                                                          ││
│  │  ┌────────────────────────────────────────────────────┐ ││
│  │  │  👤 Alex                                           │ ││
│  │  │  "Staying comfortable means losing yourself."      │ ││
│  │  │  First instance of philosophical synthesis -       │ ││
│  │  │  entire class impressed                            │ ││
│  │  │  Growth: Participation 3→4, Collaboration 0→4      │ ││
│  │  └────────────────────────────────────────────────────┘ ││
│  │                                                          ││
│  │  ┌────────────────────────────────────────────────────┐ ││
│  │  │  👤 Sam                                            │ ││
│  │  │  "Oh, sorry Casey. Go ahead."                      │ ││
│  │  │  Self-corrected interruption - shows listening    │ ││
│  │  │  growth                                            │ ││
│  │  │  Growth: Empathy 0→3, Listening 0→2               │ ││
│  │  └────────────────────────────────────────────────────┘ ││
│  │                                                          ││
│  │  📊 SESSION QUALITY                                     ││
│  │  Engagement: Very High 🟢                               ││
│  │  Quality: Highest quality discussion yet - sophisticated││
│  │           philosophical inquiry                         ││
│  │  Participation: Most balanced session - all students   ││
│  │                 contributed substantively               ││
│  │                                                          ││
│  │  💡 KEY MOMENTS                                         ││
│  │  • Alex's profound insight about comfort vs. authenticity│
│  │  • Jordan mediating between Sam and Casey              ││
│  │  • Maya connecting to previous week's discussion       ││
│  │  • Class-wide synthesis of both books                  ││
│  │                                                          ││
│  │  ✅ TEACHER RECOMMENDATIONS                             ││
│  │  • Continue fostering this level of philosophical depth││
│  │  • Consider extending discussion time                  ││
│  │  • Highlight Alex's contribution as model              ││
│  │                                                          ││
│  │  [View Updated Dashboard →]                            ││
│  └──────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Data Requirements (Upload Flow)

```javascript
// Request to serverless function
POST /api/analyze
{
  "transcript": "# Week 20 - The Giver...",
  "week": 20
}

// Response from serverless function
{
  "success": true,
  "analysis": {
    // Full week-20-analysis.json structure
    "transcript_metadata": {...},
    "session_analysis": {...},
    "students": [...]
  },

  // Computed insights for Key Learnings modal
  "key_learnings": {
    "breakthroughs": [
      {
        "student_id": "Alex",
        "student_name": "Alex",
        "quote": "Staying comfortable means losing yourself.",
        "impact": "First instance of philosophical synthesis - entire class impressed",
        "growth_summary": "Participation 3→4, Collaboration 0→4, Turns 6→7"
      },
      {
        "student_id": "Sam",
        "student_name": "Sam",
        "quote": "Oh, sorry Casey. Go ahead.",
        "impact": "Self-corrected interruption - shows active listening growth",
        "growth_summary": "Empathy 0→3, Listening 0→2"
      }
    ],

    "session_quality": {
      "engagement": "very high",
      "engagement_color": "green",
      "quality_description": "Highest quality discussion yet - sophisticated philosophical inquiry",
      "participation_note": "Most balanced session - all students contributed substantively"
    },

    "key_moments": [
      "Alex's profound insight about comfort vs. authenticity",
      "Jordan mediating between Sam and Casey - excellent facilitation",
      "Maya connecting discussion to previous week - strong continuity",
      "Class-wide synthesis of both books (Giver + Brave New World)"
    ],

    "concerns": [],  // Empty for Week 20

    "recommendations": [
      "Continue fostering this level of philosophical depth",
      "Consider extending discussion time - students have more to explore",
      "Highlight Alex's contribution as model for other emerging students"
    ]
  },

  "metadata": {
    "processed_at": "2025-03-26T10:30:00Z",
    "model": "gpt-4o",
    "processing_time_seconds": 42
  }
}
```

---

## Component Data Requirements Summary

### Dashboard Needs

**From Weekly Analysis JSON**:
- ✅ `transcript_metadata.week`
- ✅ `transcript_metadata.date`
- ✅ `session_analysis.overall_engagement`
- ✅ `session_analysis.key_moments[0]` (first one only)
- ✅ `session_analysis.concerns`
- ✅ `students[].student_id`
- ✅ `students[].total_turns`
- ✅ `students[].suggested_score.*` (all 5 skills)

**Computed (Client-Side)**:
- ❌ `delta` for each skill (compare to previous week)
- ❌ `trend` for each skill (improving/declining/stable)
- ❌ `display_name` (from student_id)
- ❌ `avatar_initials` (from student_id)

### Student Profile Needs

**From Weekly Analysis JSON (All Weeks)**:
- ✅ All weeks for one student
- ✅ `students[].skills.*.evidence[]` (all evidence items)
- ✅ `students[].skills.*.pattern`
- ✅ `students[].skills.*.confidence`
- ✅ `students[].suggested_score.*`

**Computed (Client-Side)**:
- ❌ Timeline array (aggregate all weeks)
- ❌ Journey description (auto-generate from trend)
- ❌ Total turns across all weeks
- ❌ Evidence sorted by week (reverse chronological)

### Upload/Key Learnings Needs

**From API Response**:
- ✅ Full `analysis` object (standard weekly structure)
- ❌ `key_learnings.breakthroughs` (NEW - needs computing)
- ❌ `key_learnings.session_quality` (NEW - needs formatting)
- ❌ `key_learnings.key_moments` (exists in session_analysis)
- ❌ `key_learnings.recommendations` (exists in session_analysis)

**Computed (Server-Side in API)**:
- ❌ Breakthroughs (identify students with biggest growth)
- ❌ Growth summaries (compare Week 20 vs Week 19)
- ❌ Impact statements (why each moment matters)

---

## NEW Data Structures Needed

### 1. Student Metadata (Static)

We need a mapping of student IDs to display info:

```javascript
// src/data/student-metadata.js
export const STUDENT_METADATA = {
  "Maya": {
    "display_name": "Maya",
    "avatar_initials": "M",
    "avatar_color": "#10B981"  // Green
  },
  "Jordan": {
    "display_name": "Jordan",
    "avatar_initials": "J",
    "avatar_color": "#3B82F6"  // Blue
  },
  "Alex": {
    "display_name": "Alex",
    "avatar_initials": "A",
    "avatar_color": "#8B5CF6"  // Purple
  },
  "Sam": {
    "display_name": "Sam",
    "avatar_initials": "S",
    "avatar_color": "#F59E0B"  // Orange
  },
  "Casey": {
    "display_name": "Casey",
    "avatar_initials": "C",
    "avatar_color": "#EC4899"  // Pink
  }
};
```

### 2. Skill Metadata (Static)

```javascript
// src/data/skill-metadata.js
export const SKILL_METADATA = {
  "empathy_perspective_taking": {
    "short_name": "Empathy",
    "full_name": "Empathy & Perspective-Taking",
    "icon": "😊",
    "color": "#10B981",
    "description": "Acknowledging others' viewpoints and validating contributions"
  },
  "collaboration_relationship": {
    "short_name": "Collaboration",
    "full_name": "Collaboration & Relationship Skills",
    "icon": "🤝",
    "color": "#3B82F6",
    "description": "Building on ideas and asking clarifying questions"
  },
  "adaptability_open_mindedness": {
    "short_name": "Adaptability",
    "full_name": "Adaptability & Open-Mindedness",
    "icon": "🧠",
    "color": "#8B5CF6",
    "description": "Revising opinions based on new information"
  },
  "active_listening_focus": {
    "short_name": "Listening",
    "full_name": "Active Listening & Focus",
    "icon": "👂",
    "color": "#F59E0B",
    "description": "Not interrupting and referencing what others said"
  },
  "participation_engagement": {
    "short_name": "Participation",
    "full_name": "Participation & Engagement",
    "icon": "💬",
    "color": "#EC4899",
    "description": "Frequency and depth of contributions"
  }
};
```

### 3. Computed Growth Metrics

We need functions to compute:

```javascript
// src/utils/computeGrowth.js

export function computeDelta(currentScore, previousScore) {
  return currentScore - previousScore;
}

export function computeTrend(delta) {
  if (delta > 0) return "improving";
  if (delta < 0) return "declining";
  return "stable";
}

export function computeTrendIcon(trend) {
  if (trend === "improving") return "↑";
  if (trend === "declining") return "↓";
  return "→";
}

export function computeTrendColor(trend) {
  if (trend === "improving") return "text-green-600";
  if (trend === "declining") return "text-red-600";
  return "text-gray-400";
}

export function identifyBreakthroughs(week20Analysis, week19Analysis) {
  const breakthroughs = [];

  for (const student20 of week20Analysis.students) {
    const student19 = week19Analysis.students.find(
      s => s.student_id === student20.student_id
    );

    // Find skills with biggest growth
    const growthScores = [];
    for (const skill in student20.suggested_score) {
      if (skill === "score_note") continue;

      const score20 = student20.suggested_score[skill];
      const score19 = student19.suggested_score[skill];
      const delta = score20 - score19;

      if (delta >= 2) {  // Significant growth
        growthScores.push({ skill, delta, score20, score19 });
      }
    }

    // If student has significant growth, find best quote
    if (growthScores.length > 0) {
      const bestQuote = findBestQuote(student20);
      const growthSummary = formatGrowthSummary(growthScores);

      breakthroughs.push({
        student_id: student20.student_id,
        student_name: student20.student_id,
        quote: bestQuote.quote,
        impact: bestQuote.impact,
        growth_summary: growthSummary
      });
    }
  }

  return breakthroughs;
}

function findBestQuote(studentData) {
  // Find the most impactful evidence item
  // Priority: High confidence > longest quote > first in list

  for (const skillKey in studentData.skills) {
    const skill = studentData.skills[skillKey];
    if (skill.confidence === "high" && skill.evidence.length > 0) {
      return {
        quote: skill.evidence[0].quote,
        impact: skill.evidence[0].behavior_observed
      };
    }
  }

  // Fallback: any evidence
  for (const skillKey in studentData.skills) {
    const skill = studentData.skills[skillKey];
    if (skill.evidence.length > 0) {
      return {
        quote: skill.evidence[0].quote,
        impact: skill.evidence[0].behavior_observed
      };
    }
  }

  return {
    quote: "Showed growth in this discussion",
    impact: "Overall improvement"
  };
}

function formatGrowthSummary(growthScores) {
  return growthScores
    .map(g => `${SKILL_METADATA[g.skill].short_name} ${g.score19}→${g.score20}`)
    .join(", ");
}
```

---

## Confidence Indicators

Visual design for confidence levels:

```
High Confidence:   🟢 High    (Green badge)
Medium Confidence: 🟡 Medium  (Yellow badge)
Low Confidence:    ⚪ Low     (Gray badge)
```

Use in UI:
- Dashboard: Show as small colored dot next to scores
- Student profile: Show as badge next to skill name
- Evidence cards: Show next to week number

---

## Color Palette

```javascript
export const COLORS = {
  // Engagement levels
  engagement: {
    high: "#10B981",     // Green
    medium: "#F59E0B",   // Yellow
    low: "#EF4444"       // Red
  },

  // Confidence levels
  confidence: {
    high: "#10B981",
    medium: "#F59E0B",
    low: "#9CA3AF"
  },

  // Trends
  trend: {
    improving: "#10B981",
    declining: "#EF4444",
    stable: "#9CA3AF"
  },

  // Skills (from SKILL_METADATA)
  skills: {
    empathy: "#10B981",
    collaboration: "#3B82F6",
    adaptability: "#8B5CF6",
    listening: "#F59E0B",
    participation: "#EC4899"
  }
};
```

---

## Responsive Breakpoints

```
Mobile:   < 640px   (1 column)
Tablet:   640-1024px (2 columns)
Desktop:  > 1024px   (3 columns)
```

Student cards grid:
- Mobile: 1 card per row
- Tablet: 2 cards per row
- Desktop: 3 cards per row (or 2 if 5 students total)

---

## Summary: What We Need to Build

### Data Transformation Functions

1. **`aggregateStudentData(studentId, weeklyAnalyses)`**
   - Input: All weekly analysis JSONs
   - Output: Student profile data structure
   - Computes: Timeline, growth summary, evidence timeline

2. **`computeWeekComparison(currentWeek, previousWeek)`**
   - Input: Two weekly analyses
   - Output: Delta and trend for each student/skill
   - Used by: Dashboard

3. **`identifyBreakthroughs(week20, week19)`**
   - Input: Week 20 and Week 19 analyses
   - Output: Key learnings structure
   - Used by: Upload flow

4. **`formatSessionSummary(sessionAnalysis)`**
   - Input: session_analysis from weekly JSON
   - Output: Dashboard-ready summary
   - Extracts: First key moment, concerns, engagement

### Static Data Files

1. **`src/data/student-metadata.js`**
   - Student display names, initials, colors

2. **`src/data/skill-metadata.js`**
   - Skill names, icons, colors, descriptions

3. **`src/data/weeks.js`**
   - Week list, dates, topics

### API Enhancements

**Serverless function should return**:
- Standard weekly analysis (already have)
- **NEW**: `key_learnings` object with:
  - Breakthroughs (computed from Week 19 vs 20)
  - Formatted session quality
  - Key moments (from session_analysis)
  - Recommendations (from session_analysis)

---

## Next Steps

1. **Review this UI spec** - Does it match your vision?
2. **Adjust data requirements** - Anything missing or unnecessary?
3. **Start building utils** - Data transformation functions
4. **Then build components** - Dashboard → Profile → Upload

**What do you think? Should we refine any of these layouts or data structures?**
