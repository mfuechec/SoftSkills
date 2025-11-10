# Analysis Prompts Documentation

**Project:** Middle School Non-Academic Skills Measurement Engine
**Organization:** Flourish Schools

---

## Overview

This document contains the prompts used to:
1. Generate realistic book club discussion transcripts (Claude CLI)
2. Analyze transcripts for non-academic skills evidence (OpenAI API)

---

## 1. Transcript Generation Prompt (Claude CLI)

### Purpose
Generate realistic 8th grade book club discussion transcripts showing student skill development over time.

### Usage
Run this prompt through Claude CLI to generate each transcript (Weeks 10, 12, 15, 17, 19, 20).

### Prompt Template

```markdown
# Book Club Transcript Generation

Generate a realistic middle school (8th grade) book club discussion transcript.

## Context
- **Book:** [Pick an age-appropriate novel, e.g., "The Giver" by Lois Lowry]
- **Discussion Topic:** [e.g., "Is Jonas's community truly 'perfect'? What did they sacrifice?"]
- **Setting:** Small group Socratic seminar, ~15 minutes
- **Week:** [Specify: Week 10, 12, 15, 17, 19, or 20]

## Students (5 total)

1. **Maya** - High participation, naturally empathetic, strong listener
   - Week 10: Already skilled, models good behaviors
   - Progression: Consistent excellence, starts mentoring others

2. **Jordan** - Medium participation, growing collaboration skills
   - Week 10: Sometimes interrupts, getting better at building on ideas
   - Progression: By Week 20, demonstrates conflict mediation

3. **Alex** - Low participation, quiet but thoughtful
   - Week 10: Only speaks 1-2 times per discussion
   - Progression: Gradually increases to 4-5 contributions by Week 20
   - Use this student to demonstrate "low confidence = limited evidence" feature

4. **Sam** - High participation, struggles with active listening
   - Week 10: Dominates discussion, interrupts frequently
   - Progression: Consistent issue, minimal improvement (some students need targeted coaching)

5. **Casey** - Medium participation, shows emerging adaptability
   - Week 10: Somewhat rigid in thinking
   - Progression: By Week 17, demonstrates openness to changing views

## Requirements

**Dialogue Style:**
- Natural 8th grade speech (casual but on-topic)
- Include filler words ("like," "um," "I mean")
- Some crosstalk and interruptions (mark with [interrupts])
- Students reference each other by name
- Show authentic engagement with the book's themes

**Format:**
```
[Week 10 - The Giver Book Club Discussion]
Duration: ~15 minutes
Topic: Is Jonas's community truly perfect?

Teacher: Let's start with reactions to Chapters 10-12. What stood out?

Maya: I was really struck by how they eliminated color. Like, that's such a huge sacrifice.

Sam: [interrupts] Yeah but they also got rid of war and hunger, so isn't that worth it?

Alex: [quietly] I don't know...

Jordan: Wait, Sam, let Maya finish. What were you going to say?

[Continue for ~20-30 turns total]
```

**Evidence to Include:**
- 2-3 clear examples of empathy/perspective-taking
- 1-2 examples of collaboration (building on ideas, asking questions)
- 1 example of adaptability (someone changing their view)
- 2-3 examples of active listening (or lack thereof)
- Varied participation levels matching student personas

**Session Quality Markers:**
- Include moments of genuine engagement (students excited about ideas)
- Include 1-2 "key moments" (insights, productive debate, connection)
- For early transcripts (Week 10): slightly lower engagement
- For later transcripts (Week 19-20): students more comfortable, deeper thinking

Generate the full transcript now for **[Week X]**.
```

### Customization Notes
- Keep the same book across all 6 transcripts for consistency
- Vary discussion questions to show different aspects of the book
- Ensure student progression is realistic (gradual, not sudden)
- Alex's participation: Week 10 (2 turns) → Week 20 (4-5 turns)
- Jordan's collaboration: Improve steadily, show conflict mediation by Week 20
- Casey's adaptability: Show "lightbulb moments" by Week 17+
- Sam's listening: Minimal improvement (realistic - some skills take time)

---

## 2. Evidence Extraction & Analysis Prompt (OpenAI API)

### Purpose
Analyze book club transcripts to extract evidence of non-academic skills, assign scores with confidence levels, and provide session-level insights.

### Usage
Send this prompt + transcript to OpenAI API (GPT-4 or similar) with structured JSON output mode enabled.

### Main Analysis Prompt

```markdown
# Middle School Book Club Transcript Analysis

You are analyzing a middle school book club discussion to assess non-academic skills based on the **Flourish Schools / CASEL framework**.

## Input
You will receive:
1. A transcript of a ~15-minute discussion
2. Metadata: Week number, book title, discussion topic

## Skills to Assess (1-5 scale)

### 1. Empathy & Perspective-Taking
**Definition:** Acknowledging others' viewpoints, paraphrasing, emotional responsiveness

**Evidence examples:**
- "I see what you mean..."
- "That's an interesting point, [name]..."
- Paraphrasing before disagreeing
- Validating peers' feelings/ideas

**Scoring rubric:**
- 5: Multiple instances, sophisticated emotional awareness
- 4: Consistent demonstration, clear understanding
- 3: Some demonstration, developing skill
- 2: Minimal/inconsistent demonstration
- 1: Not observed or contrary behaviors present

### 2. Collaboration & Relationship Skills
**Definition:** Building on ideas, asking questions, inviting participation

**Evidence examples:**
- "Building on what [name] said..."
- Asking clarifying questions
- "What do you think, [name]?"
- Synthesizing multiple viewpoints

**Scoring rubric:** [Same 1-5 scale]

### 3. Adaptability & Open-Mindedness
**Definition:** Revising opinions, handling disagreement gracefully, growth mindset

**Evidence examples:**
- "I hadn't thought of it that way..."
- "You've changed my mind..."
- Acknowledging limits of own understanding
- Exploring contradictions

**Scoring rubric:** [Same 1-5 scale]

### 4. Active Listening & Focus
**Definition:** Not interrupting, referencing others' comments, staying on topic

**Evidence examples:**
- Referencing specific points others made
- Waiting turn to speak
- Staying engaged throughout
- NOT interrupting (note: interruptions count against this skill)

**Scoring rubric:** [Same 1-5 scale]

### 5. Participation & Engagement
**Definition:** Turn frequency, depth of contributions, initiative-taking

**Quantitative metrics:**
- Turn count (how many times student spoke)
- Average contribution length (brief/substantive/extended)
- Initiative (did they start new threads or only respond?)

**Scoring rubric:**
- 5: 8+ turns, mostly substantive, takes initiative
- 4: 6-7 turns, mix of brief and substantive
- 3: 4-5 turns, adequate depth
- 2: 2-3 turns, limited depth
- 1: 0-1 turns, minimal contribution

## Critical Instructions

### Confidence Levels
For each skill score, assign confidence:
- **HIGH**: 3+ clear instances of the behavior
- **MEDIUM**: 1-2 clear instances
- **LOW**: Ambiguous evidence or limited opportunity to observe

**IMPORTANT:** Low confidence is VALUABLE data - it indicates the student needs more opportunities to demonstrate skills.

### Evidence Requirements
- Quote exact phrases from transcript
- Include context (what was happening)
- Explain the specific behavior demonstrated
- Note turn number or approximate timestamp

### Participation Analysis
- Count exact number of speaking turns
- Note if student was silent by choice or lack of invitation
- Flag if student attempted to speak but was interrupted/talked over

## Output Format

Return a JSON object with this exact structure:

```json
{
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
              "quote": "I see what you mean, Sam. They did eliminate suffering.",
              "context": "Responding to Sam's argument about utopia",
              "behavior": "Perspective-taking before disagreeing",
              "turn_reference": "Turn 8"
            },
            {
              "quote": "Jordan, you seem frustrated. Can you say more about that?",
              "context": "Noticing Jordan's emotional state",
              "behavior": "Emotional responsiveness",
              "turn_reference": "Turn 15"
            }
          ],
          "reasoning": "Multiple sophisticated instances of validating peers and emotional awareness"
        },

        "collaboration_relationship": {
          "score": 4,
          "confidence": "high",
          "evidence": [
            {
              "quote": "Building on what Casey said about control...",
              "context": "Extending peer's idea",
              "behavior": "Building on ideas",
              "turn_reference": "Turn 12"
            }
          ],
          "reasoning": "Consistent demonstration of collaborative behaviors"
        },

        "adaptability_openmindedness": {
          "score": 4,
          "confidence": "medium",
          "evidence": [
            {
              "quote": "I hadn't considered the leadership aspect. That's a good point.",
              "context": "Acknowledging new perspective from Sam",
              "behavior": "Openness to new ideas",
              "turn_reference": "Turn 22"
            }
          ],
          "reasoning": "Only 1-2 opportunities to demonstrate in this discussion"
        },

        "active_listening_focus": {
          "score": 5,
          "confidence": "high",
          "evidence": [
            {
              "quote": "Referenced 4 different peers' comments throughout discussion",
              "context": "Throughout discussion",
              "behavior": "Consistent active listening",
              "turn_reference": "Multiple"
            }
          ],
          "reasoning": "Never interrupted, always referenced others' ideas"
        },

        "participation_engagement": {
          "score": 5,
          "confidence": "high",
          "evidence": [
            {
              "quote": "8 speaking turns, all substantive contributions",
              "context": "Throughout discussion",
              "behavior": "Consistent engagement and initiative"
            }
          ],
          "reasoning": "High turn count with quality contributions"
        }
      },

      "overall_summary": "Maya demonstrates advanced skills across all areas. Natural leader who models empathy and inclusive discussion practices."
    },

    "Alex": {
      "participation_metrics": {
        "turn_count": 2,
        "contribution_depth": "brief",
        "initiative_level": "low"
      },

      "skills": {
        "empathy_perspective_taking": {
          "score": 3,
          "confidence": "low",
          "evidence": [
            {
              "quote": "I don't know...",
              "context": "Brief response when asked opinion",
              "behavior": "Uncertain - insufficient evidence",
              "turn_reference": "Turn 5"
            }
          ],
          "reasoning": "Only spoke twice - not enough evidence to assess. Low confidence score indicates need for more participation opportunities."
        },

        "collaboration_relationship": {
          "score": 3,
          "confidence": "low",
          "evidence": [],
          "reasoning": "Insufficient evidence - Alex didn't have opportunity to demonstrate"
        },

        "adaptability_openmindedness": {
          "score": 3,
          "confidence": "low",
          "evidence": [],
          "reasoning": "Insufficient evidence - need more participation"
        },

        "active_listening_focus": {
          "score": 3,
          "confidence": "low",
          "evidence": [
            {
              "quote": "Made eye contact, appeared engaged when not speaking",
              "context": "Non-verbal observation",
              "behavior": "Possible listening, but no verbal evidence",
              "turn_reference": "Throughout"
            }
          ],
          "reasoning": "Cannot assess listening quality from text transcript alone with minimal participation"
        },

        "participation_engagement": {
          "score": 2,
          "confidence": "high",
          "evidence": [
            {
              "quote": "Only 2 turns, both very brief",
              "context": "Limited engagement throughout",
              "behavior": "Minimal participation - may need encouragement or different format"
            }
          ],
          "reasoning": "Clear pattern of low participation. Confidence is HIGH that participation is low (this is certain), but skill assessments have LOW confidence (insufficient evidence)."
        }
      },

      "overall_summary": "Alex participated minimally. Unable to assess most skills due to limited evidence - need to create more opportunities for Alex to contribute."
    }

    /* Repeat for Jordan, Sam, Casey with similar structure */
  },

  "session_analysis": {
    "overall_engagement_quality": {
      "score": 4,
      "reasoning": "Students were genuinely engaged with the text and each other. Strong depth of thinking, though discussion was somewhat dominated by Maya and Sam.",
      "evidence": [
        "Multiple students referenced specific book passages",
        "Productive disagreement between Sam and Jordan",
        "Students built on each other's ideas (Turns 12-15)"
      ]
    },

    "discussion_flow": {
      "balance": "unbalanced",
      "description": "Maya and Sam dominated (8 and 7 turns respectively), while Alex and Casey were quieter (2 and 4 turns). Jordan had 5 turns.",
      "interaction_quality": "mostly_building",
      "notes": "Students generally built on each other's ideas rather than talking past each other, though Sam interrupted twice."
    },

    "key_moments": [
      {
        "type": "breakthrough_insight",
        "description": "Jordan's realization about freedom vs. safety trade-off",
        "students_involved": ["Jordan", "Maya"],
        "turn_reference": "Turns 18-20",
        "significance": "Deepened the entire group's thinking about the novel's themes"
      },
      {
        "type": "productive_conflict",
        "description": "Sam and Jordan's debate about utopia",
        "students_involved": ["Sam", "Jordan", "Maya"],
        "turn_reference": "Turns 10-14",
        "significance": "Demonstrated respectful disagreement (mostly), pushed thinking forward"
      }
    ],

    "concerns": [
      {
        "type": "participation_imbalance",
        "description": "Alex only spoke twice, both very briefly",
        "students_involved": ["Alex"],
        "recommended_action": "Try directly inviting Alex into conversation; consider written reflections as alternative"
      },
      {
        "type": "listening_issue",
        "description": "Sam interrupted Jordan and Casey",
        "students_involved": ["Sam"],
        "recommended_action": "1-on-1 conversation about active listening strategies"
      }
    ],

    "class_health": {
      "overall_skill_levels": {
        "empathy_perspective_taking": "developing",
        "collaboration_relationship": "strong",
        "adaptability_openmindedness": "developing",
        "active_listening_focus": "mixed",
        "participation_engagement": "unbalanced"
      },
      "trends": "Strong foundation in collaboration, but participation equity needs attention. Some students dominating discussion while others are underutilized.",
      "strengths": [
        "Genuine engagement with text",
        "Willingness to disagree respectfully (mostly)",
        "Depth of critical thinking"
      ],
      "growth_areas": [
        "Participation balance",
        "Active listening (specifically Sam)",
        "Drawing out quieter voices"
      ]
    }
  },

  "teacher_action_recommendations": [
    {
      "priority": "high",
      "action": "Create opportunities for Alex to participate (e.g., 'Alex, what's your take on this?')",
      "rationale": "Cannot assess Alex's skills with only 2 brief contributions"
    },
    {
      "priority": "high",
      "action": "Coach Sam on active listening - specifically waiting for others to finish before speaking",
      "rationale": "Sam interrupted twice, may be inhibiting others' participation"
    },
    {
      "priority": "medium",
      "action": "Celebrate Jordan's breakthrough about freedom vs. safety",
      "rationale": "Reinforce the kind of deep thinking you want to see more of"
    }
  ]
}
```

## Important Notes

- **Low confidence is a feature, not a bug** - it tells teachers which students need more opportunities
- **Participation score confidence is always HIGH** - you can always count turns accurately
- **Other skill scores have varying confidence** - depends on evidence available
- **Be specific with quotes** - exact phrases from transcript
- **Context matters** - explain what was happening when the behavior occurred
- **Session analysis is holistic** - look at the discussion as a whole, not just individual students

Analyze the following transcript now:

[INSERT TRANSCRIPT HERE]
```

---

## 3. Longitudinal Comparison Prompt (Optional - Stage 2)

### Purpose
Compare current week's analysis to previous weeks to identify growth patterns.

### Usage
Run this AFTER Stage 1 analysis if you have historical data. For demo, this can be done in preprocessing.

### Prompt Template

```markdown
# Longitudinal Analysis - Change Detection

You previously analyzed book club transcripts for this class from Weeks 10, 12, 15, 17, and 19.

## Historical Summary

**Maya:**
- Consistently high scores (4.5-5.0) across all skills
- Confidence always high
- Trend: Stable excellence

**Jordan:**
- Week 10: Collaboration 3.0, Empathy 3.5
- Week 12: Collaboration 3.5, Empathy 3.5
- Week 15: Collaboration 3.8, Empathy 4.0
- Week 17: Collaboration 4.0, Empathy 4.2
- Week 19: Collaboration 4.2, Empathy 4.5
- Trend: Steady improvement in collaboration and empathy

**Alex:**
- Week 10: Participation 2.0, All other skills 3.0 (low confidence)
- Week 12: Participation 2.0, All other skills 3.0 (low confidence)
- Week 15: Participation 2.5, Some skills 3.0-3.5 (medium confidence)
- Week 17: Participation 2.5, Some skills 3.5 (medium confidence)
- Week 19: Participation 3.0, Skills 3.5-4.0 (medium confidence)
- Trend: Gradual increase in participation, skill confidence improving

**Sam:**
- Consistently high participation (8+ turns)
- Listening score consistently 2.0-2.5 (interruptions)
- Other skills strong (4.0+)
- Trend: Minimal improvement in listening

**Casey:**
- Week 10: Adaptability 2.5
- Week 17: Adaptability 4.0 (breakthrough)
- Other skills: 3.5-4.0 range
- Trend: Notable growth in open-mindedness

## Task

Analyze the Week 20 transcript and:

1. **Identify changes** in each student's skill demonstration
2. **Note any NEW behaviors** not seen before (label with "NEW:")
3. **Flag significant improvements or declines** (compare to Week 19)
4. **Update confidence levels** based on accumulated evidence across all 6 transcripts
5. **Highlight breakthrough moments** (e.g., first time demonstrating a behavior)

Output the same JSON structure as Stage 1, but include a new field:

```json
{
  "longitudinal_insights": {
    "Maya": {
      "changes_this_week": "Consistent excellence, no significant changes",
      "new_behaviors": [],
      "trajectory": "stable_high"
    },
    "Jordan": {
      "changes_this_week": "Demonstrated conflict mediation for the first time",
      "new_behaviors": ["conflict_mediation"],
      "trajectory": "improving",
      "significance": "Major milestone - Jordan is now actively helping peers resolve disagreements"
    },
    "Alex": {
      "changes_this_week": "Increased to 4 speaking turns (up from 2-3 in previous weeks)",
      "new_behaviors": [],
      "trajectory": "gradually_improving",
      "confidence_update": "Empathy and Collaboration confidence upgraded to MEDIUM (now have 3-4 instances across transcripts)"
    },
    /* etc */
  }
}
```

Analyze Week 20 transcript now with this longitudinal context.
```

---

## 4. Demo Popup Summary Prompt (Stage 3)

### Purpose
Generate the concise summary for the immediate post-analysis popup shown to teachers.

### Usage
Run this on the Week 20 analysis results to create the popup content.

### Prompt Template

```markdown
# Teacher-Facing Summary Generation

Based on the Week 20 analysis results, generate a concise summary for the teacher popup.

## Input
[Full Week 20 analysis JSON from Stage 1/Stage 2]

## Output Format

```json
{
  "session_quality_score": 4.2,
  "session_quality_summary": "Students were highly engaged and demonstrated deep thinking about the novel's themes.",

  "key_moments": [
    {
      "icon": "✨",
      "text": "Jordan mediated disagreement between Sam and Maya (NEW skill!)",
      "type": "breakthrough"
    },
    {
      "icon": "⭐",
      "text": "Casey had breakthrough insight about symbolism (Turn 23)",
      "type": "highlight"
    },
    {
      "icon": "📈",
      "text": "Most authentic discussion yet - students genuinely invested",
      "type": "positive_trend"
    }
  ],

  "individual_highlights": [
    "Alex participated 4 times (up from 2) - Confidence scores improving!",
    "Jordan: First time demonstrating conflict mediation (Collaboration ⬆️ to 4.5)",
    "Maya continues to model excellent empathy"
  ],

  "concerns": [
    {
      "severity": "medium",
      "text": "Sam still interrupting (3 times) - listening needs work"
    },
    {
      "severity": "low",
      "text": "Discussion slightly dominated by Sam and Maya (16 of 28 total turns)"
    }
  ],

  "teacher_actions": [
    {
      "priority": "high",
      "icon": "💡",
      "text": "Continue celebrating Alex's increased participation"
    },
    {
      "priority": "high",
      "icon": "💡",
      "text": "1-on-1 with Sam about active listening strategies"
    },
    {
      "priority": "medium",
      "icon": "💡",
      "text": "Try rotating discussion leader role to balance participation"
    }
  ],

  "class_health_trends": [
    {
      "skill": "Collaboration",
      "status": "strong",
      "icon": "📈",
      "value": "Class avg 4.1 and improving"
    },
    {
      "skill": "Empathy",
      "status": "developing",
      "icon": "📈",
      "value": "Class avg 3.8"
    },
    {
      "skill": "Participation",
      "status": "caution",
      "icon": "⚠️",
      "value": "Still unbalanced - need to draw out Casey and Alex more"
    }
  ]
}
```

Generate the popup summary now.
```

---

## Prompt Workflow Summary

### For Demo Preparation (Pre-Processing):
1. **Generate 6 transcripts** using Transcript Generation Prompt (Claude CLI)
2. **Analyze transcripts 1-5** (Weeks 10-19) using Evidence Extraction Prompt (OpenAI)
3. **Store results** as JSON files
4. **Pre-load** into dashboard

### For Live Demo (Week 20):
1. **Show pre-loaded** dashboard with 5 weeks of analysis
2. **Upload Week 20 transcript** → trigger Evidence Extraction Prompt (OpenAI API call)
3. **Generate popup summary** using Demo Popup Summary Prompt
4. **Update dashboard** with new Week 20 data

---

## Testing & Validation Checklist

- [ ] Generate Week 10 transcript with Claude CLI
- [ ] Run Evidence Extraction Prompt on Week 10 transcript
- [ ] Verify output quality (accurate quotes, appropriate scores, sensible confidence levels)
- [ ] Check that Alex has mostly "low confidence" scores (limited participation)
- [ ] Check that Sam's listening score is low (2-2.5) with interruption evidence
- [ ] Verify session_analysis captures overall discussion quality
- [ ] Generate remaining transcripts (Weeks 12, 15, 17, 19, 20)
- [ ] Run analysis on all transcripts
- [ ] Verify student progression is visible (Jordan improving, Alex gradually participating more, etc.)
- [ ] Test Longitudinal Comparison Prompt (optional)
- [ ] Generate popup summary for Week 20
- [ ] Validate that summary is concise and actionable for teachers

---

**Last Updated:** 2025-11-10
**Status:** Ready for implementation
