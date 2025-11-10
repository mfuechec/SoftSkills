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
    "teacher_recommendations": ["Specific actionable suggestions"]
  },
  "students": [
    {
      "student_id": "StudentName",
      "total_turns": 5,
      "skills": {
        "empathy_perspective_taking": {
          "evidence": [
            {
              "quote": "Exact student quote",
              "context": "What prompted this",
              "behavior_observed": "Specific skill demonstrated",
              "line_reference": "Line X"
            }
          ],
          "pattern": "strong/consistent/emerging/not_observed",
          "confidence": "high/medium/low",
          "confidence_rationale": "Why this confidence level"
        },
        "collaboration_relationship": { },
        "adaptability_open_mindedness": { },
        "active_listening_focus": { },
        "participation_engagement": { }
      },
      "overall_impression": "1-2 sentence summary",
      "growth_indicators": ["Compared to typical patterns"],
      "suggested_score": {
        "empathy_perspective_taking": 4,
        "collaboration_relationship": 3,
        "adaptability_open_mindedness": 0,
        "active_listening_focus": 2,
        "participation_engagement": 5,
        "score_note": "1-5 scale. Use 0 if insufficient evidence. Scores are SECONDARY to evidence."
      }
    }
  ]
}

**Guidelines:**
- Quote exact student language whenever possible
- Use line numbers to reference transcript
- For skills without evidence, set pattern to "not_observed" and confidence to "low"
- Scores should reflect evidence quantity and quality (0 = no evidence, 5 = strong pattern)
- Focus on specific behaviors, not character judgments

**Transcript:**

{TRANSCRIPT_TEXT}`;
}
