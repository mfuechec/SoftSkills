#!/usr/bin/env node

// Re-analyze all transcripts with enhanced AI prompt
import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('\n❌ Error: OPENAI_API_KEY environment variable is not set');
  console.error('   Set it with: export OPENAI_API_KEY="your-key-here"\n');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

const weeks = [10, 12, 15, 17, 19];

const systemPrompt = `You are an expert educational psychologist specializing in Social-Emotional Learning (SEL) assessment. Your task is to analyze classroom discussion transcripts and extract **specific, concrete behavioral evidence** of non-academic skills development.

**Core Principles:**
- Evidence-first: Focus on what students actually said and did
- Specificity: Quote exact language, don't summarize
- Objectivity: Describe observable behavior, not inferred character
- Context: Include enough context to understand the behavior
- Confidence: Flag when evidence is limited or ambiguous

**CRITICAL:** Return results as valid JSON only. No explanatory text outside the JSON structure.`;

function getUserPrompt(transcript) {
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
      "total_turns": 5,
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
          "evidence": [
            {
              "quote": "Exact student quote",
              "context": "What prompted this",
              "behavior_observed": "Specific skill demonstrated",
              "line_reference": "Line X",
              "interacted_with": "StudentName (if responding to someone)"
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

async function analyzeWeek(weekNumber) {
  console.log(`\n📊 Analyzing Week ${weekNumber}...`);

  // Read transcript
  const transcriptPath = path.join(__dirname, 'transcripts', `week-${weekNumber}.md`);
  const transcript = fs.readFileSync(transcriptPath, 'utf-8');

  console.log(`   📄 Transcript loaded (${transcript.length} characters)`);
  console.log(`   🤖 Calling GPT-4o...`);

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

    // Save to frontend data folder
    const outputPath = path.join(__dirname, 'frontend', 'public', 'data', 'analysis', `week-${weekNumber}-analysis.json`);
    fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

    console.log(`   ✅ Analysis complete!`);
    console.log(`   📈 Students: ${analysis.students?.length || 0}`);
    console.log(`   🎯 Participation Equity: ${analysis.session_analysis?.participation_equity_score || 'N/A'}/10`);
    console.log(`   🧠 Discussion Depth: ${analysis.session_analysis?.discussion_depth_score || 'N/A'}/10`);
    console.log(`   💬 Interaction Health: ${analysis.session_analysis?.interaction_health || 'N/A'}`);
    console.log(`   📚 Evidence Citations: ${analysis.session_analysis?.evidence_citation_count || 0}`);
    console.log(`   💾 Saved to: ${path.basename(outputPath)}`);

    return { success: true, analysis };
  } catch (error) {
    console.error(`   ❌ Error: ${error.message}`);
    return { success: false, error: error.message };
  }
}

async function main() {
  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║  Re-analyzing Transcripts with Enhanced AI Prompt     ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log('\n🚀 Starting analysis of 5 weeks...');
  console.log('⏱️  This will take 3-5 minutes (GPT-4o processing)');
  console.log('💰 Cost: ~$0.50-1.00 total\n');

  const results = [];

  for (let i = 0; i < weeks.length; i++) {
    const week = weeks[i];
    const result = await analyzeWeek(week);
    results.push({ week, ...result });

    // Wait between requests (except after last one)
    if (i < weeks.length - 1) {
      console.log('   ⏳ Waiting 3 seconds before next analysis...');
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  // Summary
  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                    Summary                             ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');

  const successful = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  console.log(`✅ Successful: ${successful}/${weeks.length}`);
  if (failed > 0) {
    console.log(`❌ Failed: ${failed}/${weeks.length}`);
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - Week ${r.week}: ${r.error}`);
    });
  }

  console.log('\n📋 Next Steps:');
  console.log('   1. Refresh your browser (hard refresh: Cmd+Shift+R)');
  console.log('   2. Navigate through different weeks to see new data');
  console.log('   3. Check out the enhanced sections:');
  console.log('      • Discussion Environment (participation equity, depth scores)');
  console.log('      • Intervention Priority (smart ranking with urgency levels)');
  console.log('      • Session Notes comparison (what got better/worse)');
  console.log('      • Student profiles (interaction patterns, discussion behavior)');
  console.log('\n✨ Done!\n');
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error);
  process.exit(1);
});
