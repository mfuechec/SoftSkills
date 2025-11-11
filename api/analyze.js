// Serverless function for analyzing transcripts
// Deployed to Vercel as /api/analyze

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { transcript, week } = req.body;

  if (!transcript || !transcript.trim()) {
    return res.status(400).json({ error: 'Transcript is required' });
  }

  try {
    // Initialize OpenAI
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    // Load the prompt template
    const promptTemplate = getPromptTemplate();

    // Replace placeholder with actual transcript
    const userPrompt = promptTemplate.replace('{TRANSCRIPT_TEXT}', transcript.trim());

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert educational psychologist specializing in Social-Emotional Learning (SEL) assessment. Your task is to analyze classroom discussion transcripts and extract **specific, concrete behavioral evidence** of non-academic skills development.

**Core Principles:**
- Evidence-first: Focus on what students actually said and did
- Specificity: Quote exact language, don't summarize
- Objectivity: Describe observable behavior, not inferred character
- Context: Include enough context to understand the behavior
- Confidence: Flag when evidence is limited or ambiguous

**CRITICAL:** Return results as valid JSON only. No explanatory text outside the JSON structure.`,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    // Parse the response
    const analysisText = completion.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    // Return the analysis
    return res.status(200).json(analysis);
  } catch (error) {
    console.error('Analysis error:', error);
    return res.status(500).json({
      error: 'Failed to analyze transcript',
      details: error.message,
    });
  }
}

function getPromptTemplate() {
  return `Analyze the following classroom discussion transcript and extract evidence of non-academic skills for each student.

**CRITICAL FORMATTING RULES:**
1. Use snake_case for ALL field names EXCEPT "totalTurns"
2. The ONLY camelCase field should be "totalTurns" (for speaking turn count)
3. Examples: "student_id", "transcript_metadata", "session_analysis", "interaction_patterns"
4. DO NOT use "studentId", "transcriptMetadata", "sessionAnalysis", "interactionPatterns"

**Skills Framework (Flourish Schools / CASEL):**

1. **Empathy & Perspective-Taking**
   - Acknowledging others' viewpoints ("I see what you mean")
   - Paraphrasing before responding
   - Validating peers' contributions
   - Recognizing emotions in self and others

2. **Collaboration & Relationship Skills**
   - Building on others' ideas
   - Asking clarifying questions
   - Inviting quieter voices into the conversation
   - Navigating disagreements constructively

3. **Adaptability & Open-Mindedness**
   - Changing opinions based on new information
   - Considering multiple perspectives
   - Comfort with ambiguity
   - Flexibility in thinking

4. **Active Listening & Focus**
   - Referencing what others specifically said
   - Asking follow-up questions
   - Avoiding interruptions
   - Staying on topic

5. **Participation & Engagement**
   - Frequency and quality of contributions
   - Initiating discussion
   - Depth of responses
   - Risk-taking (sharing unpopular opinions, asking hard questions)

**Output Format (JSON):**

{
  "transcript_metadata": {
    "week": "Week X",
    "date": "YYYY-MM-DD",
    "topic": "Discussion topic",
    "duration_minutes": 15,
    "total_turns": 30
  },
  "session_analysis": {
    "overall_engagement": "high/medium/low",
    "discussion_quality": "Brief qualitative assessment",
    "key_moments": ["Notable discussion moments"],
    "concerns": ["Any red flags or issues"],
    "teacher_recommendations": ["Specific actionable suggestions"],
    "participation_equity_score": 7,
    "participation_distribution": "even/skewed_to_few/dominated_by_one",
    "discussion_depth_score": 8,
    "evidence_citation_count": 5,
    "perspective_diversity": "high/medium/low",
    "interaction_health": "strong/moderate/weak",
    "conversational_turns": 25,
    "environment_quality": {
      "student_to_student_interaction": "high/medium/low",
      "idea_building_frequency": "frequent/occasional/rare",
      "domination_concerns": ["StudentName dominated with 40% of turns"],
      "exclusion_concerns": ["StudentName received no responses from peers"],
      "positive_patterns": ["Strong collaborative dialogue between Maya and Jordan"]
    }
  },
  "students": [
    {
      "student_id": "StudentName",
      "totalTurns": 5,
      "speaking_time_estimate": "2-3 minutes",
      "interaction_patterns": {
        "responded_to": ["OtherStudent"],
        "built_upon_ideas_from": ["OtherStudent"],
        "received_responses_from": ["OtherStudent"],
        "interruption_count": 0,
        "was_interrupted_by": [],
        "initiated_topics": 1,
        "turn_length": "short/medium/long"
      },
      "discussion_behavior": {
        "engagement_level": "high/medium/low",
        "wait_time": "patient/moderate/impulsive",
        "response_rate": "How often peers engage with their ideas",
        "contribution_to_environment": "Enhances/neutral/detracts from discussion quality"
      },
      "skills": {
        "empathy_perspective_taking": {
          "pattern": "frequent/occasional/consistent/emerging/not_observed",
          "confidence": "high/medium/low",
          "examples": ["Quote with context"]
        },
        "collaboration_relationship": {},
        "adaptability_open_mindedness": {},
        "active_listening_focus": {},
        "participation_engagement": {}
      },
      "overall_impression": "1-2 sentence summary",
      "growth_indicators": ["Indicator 1"],
      "suggested_score": {
        "empathy_perspective_taking": 5,
        "collaboration_relationship": 4,
        "adaptability_open_mindedness": 3,
        "active_listening_focus": 4,
        "participation_engagement": 5
      }
    }
  ]
}

**CRITICAL SCORING INSTRUCTIONS:**
**Score based on RATE (percentage of relevant opportunities), NOT raw frequency count.**

A student with 5 turns showing empathy in 3 of them (60% rate) should score HIGHER than a student with 15 turns showing empathy in 6 of them (40% rate), even though 6 > 3.

**Scoring Calibration:**
- **Score 5**: Student demonstrates skill in >60% of relevant opportunities. Exceptional, consistent pattern.
- **Score 4**: 40-60% of opportunities. Strong, frequent pattern with room for growth.
- **Score 3**: 20-40% of opportunities. Emerging skill, inconsistent but present.
- **Score 2**: 5-20% of opportunities. Occasional demonstration, needs development.
- **Score 1**: <5% of opportunities. Rare or minimal evidence.
- **Score 0**: Not observed or no relevant opportunities.

**Guidelines:**
- Quote exact student language whenever possible
- Use line numbers to reference transcript
- For skills without evidence, set pattern to "not_observed" and confidence to "low"
- **IMPORTANT**: Normalize scores by number of turns - don't reward longer discussions with higher scores
- Focus on specific behaviors, not character judgments

**Interaction Analysis Instructions:**
1. **Responded to**: When Student A directly addresses Student B's point (e.g., "I agree with Jordan...", "Building on what Maya said...")
2. **Built upon ideas from**: When Student A extends/develops Student B's thinking (not just agreeing)
3. **Received responses from**: Which students engaged with this student's contributions
4. **Interruptions**: Count instances where a student cuts off another mid-sentence
5. **Speaking time**: Estimate based on turn count and length (short turns = 15-30s, medium = 30-60s, long = 1-2min)

**Discussion Quality Instructions:**
- **Participation equity score (1-10)**: 10 = perfectly even distribution, 1 = one student dominates
- **Discussion depth score (1-10)**: 1-3 = surface opinions, 4-6 = some reasoning, 7-10 = evidence-based synthesis and critical analysis
- **Evidence citation count**: Number of times students support claims with concrete evidence (textual citations, logical reasoning, real-world examples, data, personal experience, etc.). Be flexible - evidence type depends on discussion context.
- **Perspective diversity**: High = multiple viewpoints explored, Low = groupthink/echo chamber
- **Interaction health**: Strong = frequent idea-building, Weak = parallel monologues
- **Conversational turns**: Count back-and-forth exchanges (Student A → B → A counts as 2 turns)

**Environment Quality Instructions:**
- **Domination concerns**: Flag if any student has >30% of turns or consistently talks over others
- **Exclusion concerns**: Flag students who contribute but receive no peer responses
- **Positive patterns**: Highlight strong collaborative dynamics worth reinforcing

**Transcript:**

{TRANSCRIPT_TEXT}`;
}
