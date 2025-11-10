#!/usr/bin/env node

// Re-analyze Week 15 only (it only detected 1 student instead of 5)
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('\n❌ Error: OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const systemPrompt = `You are an expert educational psychologist specializing in Social-Emotional Learning (SEL) assessment. Your task is to analyze classroom discussion transcripts and extract **specific, concrete behavioral evidence** of non-academic skills development.

**IMPORTANT**: The transcript will have speaker labels like **StudentName:** - make sure to identify ALL students who speak, not just one.

**Core Principles:**
- Evidence-first: Focus on what students actually said and did
- Specificity: Quote exact language, don't summarize
- Objectivity: Describe observable behavior, not inferred character
- Context: Include enough context to understand the behavior
- Confidence: Flag when evidence is limited or ambiguous

**CRITICAL:** Return results as valid JSON only. No explanatory text outside the JSON structure.`;

function getUserPrompt(transcript) {
  return `Analyze the following classroom discussion transcript and extract evidence of non-academic skills for each student.

**IMPORTANT**: Look for speaker labels like **StudentName:** to identify ALL unique students. In this transcript there are 5 students: Maya, Jordan, Alex, Sam, and Casey. Make sure to analyze ALL 5 students.

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
    "week": "Week 15",
    "date": "2025-02-19",
    "topic": "The truth about 'release' and Jonas's reaction (Chapters 18-19)",
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
      "student_id": "Maya",
      "totalTurns": 8,
      "speaking_time_estimate": "2-3 minutes",
      "interaction_patterns": {
        "responded_to": ["Jordan", "Alex"],
        "built_upon_ideas_from": ["Casey"],
        "received_responses_from": ["Jordan", "Sam"],
        "interruption_count": 0,
        "was_interrupted_by": [],
        "initiated_topics": 1,
        "turn_length": "medium"
      },
      "discussion_behavior": {
        "engagement_level": "high",
        "wait_time": "patient",
        "response_rate": "High - peers frequently engage with her ideas",
        "contribution_to_environment": "Enhances discussion quality through validation and mentoring"
      },
      "skills": { },
      "overall_impression": "1-2 sentence summary",
      "growth_indicators": ["Compared to typical patterns"],
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

**IMPORTANT NOTES:**
- There are 5 students in this transcript: Maya (8 turns), Jordan (7 turns), Casey (7 turns), Sam (6 turns), Alex (5 turns)
- Make sure your "students" array contains ALL 5 students
- Each student should have their own object in the array

**Guidelines:**
- Quote exact student language whenever possible
- Use line numbers to reference transcript
- For skills without evidence, set pattern to "not_observed" and confidence to "low"
- Scores should reflect evidence quantity and quality (0 = no evidence, 5 = strong pattern)
- Focus on specific behaviors, not character judgments

**Interaction Analysis Instructions:**
1. **Responded to**: When Student A directly addresses Student B's point (e.g., "I agree with Jordan...", "Building on what Maya said...")
2. **Built upon ideas from**: When Student A extends/develops Student B's thinking (not just agreeing)
3. **Received responses from**: Which students engaged with this student's contributions
4. **Interruptions**: Count instances where a student cuts off another mid-sentence
5. **Speaking time**: Estimate based on turn count and length (short turns = 15-30s, medium = 30-60s, long = 1-2min)

**Discussion Quality Instructions:**
- **Participation equity score (1-10)**: 10 = perfectly even distribution, 1 = one student dominates
- **Discussion depth score (1-10)**: 1-3 = surface opinions, 4-6 = some reasoning, 7-10 = evidence-based synthesis
- **Evidence citation count**: Number of times students cite the text ("On page X...", "The author says...")
- **Perspective diversity**: High = multiple viewpoints explored, Low = groupthink/echo chamber
- **Interaction health**: Strong = frequent idea-building, Weak = parallel monologues
- **Conversational turns**: Count back-and-forth exchanges (Student A → B → A counts as 2 turns)

**Environment Quality Instructions:**
- **Domination concerns**: Flag if any student has >30% of turns or consistently talks over others
- **Exclusion concerns**: Flag students who contribute but receive no peer responses
- **Positive patterns**: Highlight strong collaborative dynamics worth reinforcing

**Transcript:**

${transcript}`;
}

async function main() {
  console.log('\n📊 Re-analyzing Week 15 (fixing student detection issue)...\n');

  const transcriptPath = path.join(__dirname, 'transcripts', 'week-15.md');
  const transcript = fs.readFileSync(transcriptPath, 'utf-8');

  console.log('   📄 Transcript loaded');
  console.log('   🤖 Calling GPT-4o with explicit student count...\n');

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: getUserPrompt(transcript) },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
    });

    const analysisText = completion.choices[0].message.content;
    const analysis = JSON.parse(analysisText);

    console.log(`   ✅ Analysis complete!`);
    console.log(`   📈 Students detected: ${analysis.students?.length || 0}`);

    if (analysis.students?.length !== 5) {
      console.log(`   ⚠️  WARNING: Expected 5 students, got ${analysis.students?.length}`);
      console.log('   Students found:', analysis.students?.map(s => s.student_id).join(', '));
    } else {
      console.log(`   ✅ All 5 students detected correctly!`);
    }

    console.log(`   🎯 Participation Equity: ${analysis.session_analysis?.participation_equity_score}/10`);
    console.log(`   🧠 Discussion Depth: ${analysis.session_analysis?.discussion_depth_score}/10`);
    console.log(`   💬 Interaction Health: ${analysis.session_analysis?.interaction_health}`);

    // Save
    const outputPath = path.join(__dirname, 'frontend', 'public', 'data', 'analysis', 'week-15-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));
    console.log(`\n   💾 Saved to: ${path.basename(outputPath)}`);
    console.log('\n✨ Done! Refresh your browser to see the updated data.\n');

  } catch (error) {
    console.error('   ❌ Error:', error.message);
    process.exit(1);
  }
}

main();
