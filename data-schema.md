# Data Schema for Architect Discussion

**Project:** Middle School Non-Academic Skills Measurement Engine

---

## Overview

This document outlines the JSON data structures for:
1. Raw transcripts (input)
2. Analysis results (output from OpenAI)
3. Student cumulative profiles (aggregated over time)
4. Class dashboard data

---

## 1. Raw Transcript Format

```json
{
  "metadata": {
    "week": "Week 10",
    "book": "The Giver",
    "topic": "Is Jonas's community perfect?",
    "duration_minutes": 15,
    "date": "2025-01-15",
    "class_id": "8th-grade-english-period-3"
  },
  "participants": ["Maya", "Jordan", "Alex", "Sam", "Casey"],
  "transcript": [
    {
      "turn": 1,
      "speaker": "Teacher",
      "text": "Let's start with reactions to Chapters 10-12. What stood out?"
    },
    {
      "turn": 2,
      "speaker": "Maya",
      "text": "I was really struck by how they eliminated color. Like, that's such a huge sacrifice."
    },
    {
      "turn": 3,
      "speaker": "Sam",
      "text": "[interrupts] Yeah but they also got rid of war and hunger, so isn't that worth it?",
      "metadata": {
        "interrupted": true
      }
    }
  ]
}
```

---

## 2. Single Transcript Analysis Result

```json
{
  "transcript_id": "week-10",
  "transcript_metadata": {
    "week": "Week 10",
    "book": "The Giver",
    "topic": "Is Jonas's community perfect?",
    "duration_minutes": 15,
    "participants": ["Maya", "Jordan", "Alex", "Sam", "Casey"]
  },
  "per_student_analysis": {
    "Maya": {
      "participation_metrics": {
        "turn_count": 8,
        "contribution_depth": "substantive",
        "initiative_level": "high"
      },
      "skills": {
        "empathy_perspective_taking": {
          "score": 5,
          "confidence": "high",
          "evidence": [
            {
              "quote": "I see what you mean, Sam.",
              "context": "Responding to Sam's argument",
              "behavior": "Perspective-taking",
              "turn_reference": "Turn 8"
            }
          ],
          "reasoning": "Multiple sophisticated instances"
        },
        "collaboration_relationship": { /* same structure */ },
        "adaptability_openmindedness": { /* same structure */ },
        "active_listening_focus": { /* same structure */ },
        "participation_engagement": { /* same structure */ }
      },
      "overall_summary": "Maya demonstrates advanced skills..."
    }
    /* other students */
  },
  "session_analysis": {
    "overall_engagement_quality": {
      "score": 4,
      "reasoning": "Students were genuinely engaged...",
      "evidence": ["Multiple students referenced book passages"]
    },
    "discussion_flow": {
      "balance": "unbalanced",
      "description": "Maya and Sam dominated...",
      "interaction_quality": "mostly_building"
    },
    "key_moments": [
      {
        "type": "breakthrough_insight",
        "description": "Jordan's realization about freedom",
        "students_involved": ["Jordan", "Maya"],
        "turn_reference": "Turns 18-20"
      }
    ],
    "concerns": [
      {
        "type": "participation_imbalance",
        "description": "Alex only spoke twice",
        "students_involved": ["Alex"],
        "recommended_action": "Try inviting Alex directly"
      }
    ],
    "class_health": {
      "overall_skill_levels": {
        "empathy_perspective_taking": "developing",
        "collaboration_relationship": "strong"
      },
      "trends": "Strong collaboration foundation...",
      "strengths": ["Genuine engagement"],
      "growth_areas": ["Participation balance"]
    }
  },
  "teacher_action_recommendations": [
    {
      "priority": "high",
      "action": "Create opportunities for Alex",
      "rationale": "Only 2 contributions"
    }
  ]
}
```

---

## 3. Student Cumulative Profile (Aggregated)

```json
{
  "student_id": "Jordan",
  "transcripts_analyzed": ["week-10", "week-12", "week-15", "week-17", "week-19"],
  "skill_trajectories": {
    "empathy_perspective_taking": {
      "current_score": 4.2,
      "confidence": "high",
      "trend": "improving",
      "history": [
        {"week": "Week 10", "score": 3.5, "confidence": "medium"},
        {"week": "Week 12", "score": 3.5, "confidence": "high"},
        {"week": "Week 15", "score": 4.0, "confidence": "high"},
        {"week": "Week 17", "score": 4.2, "confidence": "high"},
        {"week": "Week 19", "score": 4.5, "confidence": "high"}
      ],
      "all_evidence": [
        /* Aggregated evidence from all transcripts */
      ]
    }
    /* other skills */
  },
  "notable_moments": [
    {
      "week": "Week 17",
      "description": "First demonstration of conflict mediation",
      "significance": "breakthrough"
    }
  ],
  "overall_narrative": "Jordan shows strong growth in collaboration..."
}
```

---

## 4. Class Dashboard Data

```json
{
  "class_id": "8th-grade-english-period-3",
  "current_week": "Week 19",
  "students": [
    {
      "student_id": "Maya",
      "latest_scores": {
        "empathy_perspective_taking": 5.0,
        "collaboration_relationship": 4.8,
        "adaptability_openmindedness": 4.5,
        "active_listening_focus": 5.0,
        "participation_engagement": 5.0
      },
      "trajectory": "stable_high",
      "highlights": ["Consistently models excellent behavior"]
    }
    /* other students */
  ],
  "class_metrics": {
    "average_scores": {
      "empathy_perspective_taking": 3.8,
      "collaboration_relationship": 4.1,
      "adaptability_openmindedness": 3.6,
      "active_listening_focus": 3.9,
      "participation_engagement": 3.5
    },
    "participation_distribution": {
      "high": ["Maya", "Sam"],
      "medium": ["Jordan", "Casey"],
      "low": ["Alex"]
    }
  }
}
```

---

## Key Discussion Points for Architect

1. **File organization:** How to structure JSON files (per-week? per-student? combined?)
2. **Pre-processing:** How to generate and store Weeks 10-19 analyses
3. **Live demo flow:** Week 20 upload → API call → parse response → update state
4. **Frontend state management:** Redux? Context? Simple useState?
5. **API integration:** Where to make OpenAI call (frontend with env vars? simple backend?)

---

**Status:** Ready for architect discussion
