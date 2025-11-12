// Re-analyze all transcripts with the enhanced AI prompt
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable is not set');
  process.exit(1);
}

const weeks = [10, 12, 15, 17, 19, 20];

async function analyzeTranscript(weekNumber) {
  console.log(`\n📊 Analyzing Week ${weekNumber}...`);

  // Read transcript
  const transcriptPath = path.join(__dirname, 'transcripts', `week-${weekNumber}.md`);
  const transcript = fs.readFileSync(transcriptPath, 'utf-8');

  // Call the API endpoint
  try {
    const response = await fetch('http://localhost:5173/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        transcript,
        week: weekNumber,
      }),
    });

    if (!response.ok) {
      // Try production endpoint if local fails
      console.log('   Local endpoint failed, trying production...');
      const prodResponse = await fetch('https://your-app.vercel.app/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          week: weekNumber,
        }),
      });

      if (!prodResponse.ok) {
        throw new Error(`API error: ${prodResponse.status}`);
      }

      const data = await prodResponse.json();
      return data;
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`   ❌ API call failed: ${error.message}`);
    console.log('   Calling OpenAI directly...');

    // Call OpenAI directly if API endpoint fails
    return await analyzeWithOpenAI(transcript, weekNumber);
  }
}

async function analyzeWithOpenAI(transcript, weekNumber) {
  const OpenAI = (await import('openai')).default;
  const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

  const promptTemplate = getPromptTemplate();
  const userPrompt = promptTemplate.replace('{TRANSCRIPT_TEXT}', transcript.trim());

  console.log('   Calling OpenAI GPT-4o...');
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

  const analysisText = completion.choices[0].message.content;
  return JSON.parse(analysisText);
}

function getPromptTemplate() {
  return fs.readFileSync(path.join(__dirname, 'api', 'analyze.js'), 'utf-8')
    .match(/return `([\s\S]*?)`;/)[1];
}

async function main() {
  console.log('🚀 Re-analyzing all transcripts with enhanced prompt\n');
  console.log('This will take a few minutes (GPT-4o calls)...\n');

  for (const week of weeks) {
    try {
      const analysis = await analyzeTranscript(week);

      // Save to frontend data folder
      const outputPath = path.join(__dirname, 'frontend', 'public', 'data', 'analysis', `week-${week}-analysis.json`);
      fs.writeFileSync(outputPath, JSON.stringify(analysis, null, 2));

      console.log(`   ✅ Week ${week} complete - saved to ${outputPath}`);
      console.log(`   📈 Students analyzed: ${analysis.students?.length || 0}`);
      console.log(`   🎯 Participation equity: ${analysis.session_analysis?.participation_equity_score || 'N/A'}/10`);
      console.log(`   🧠 Discussion depth: ${analysis.session_analysis?.discussion_depth_score || 'N/A'}/10`);

      // Wait 2 seconds between requests to avoid rate limiting
      if (week !== weeks[weeks.length - 1]) {
        console.log('   ⏳ Waiting 2 seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`   ❌ Error analyzing Week ${week}:`, error.message);
    }
  }

  console.log('\n✅ Re-analysis complete!');
  console.log('\nNext steps:');
  console.log('1. Refresh your browser to see the new data');
  console.log('2. Check the new UI components (ClassInsights, InterventionPriority, SessionComparison)');
  console.log('3. Navigate between weeks to see comparative analysis');
}

main().catch(console.error);
