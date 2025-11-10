// Test script for evidence extraction prompt
// Run with: node test-prompt.js [week-number]

const fs = require('fs');
const path = require('path');

// Get week number from command line, default to 10
const weekNum = process.argv[2] || '10';
const transcriptFile = `week-${weekNum}.md`;

// Read the transcript
const transcriptPath = path.join(__dirname, 'transcripts', transcriptFile);
if (!fs.existsSync(transcriptPath)) {
  console.error(`Error: Transcript not found: ${transcriptPath}`);
  process.exit(1);
}
const transcript = fs.readFileSync(transcriptPath, 'utf8');

// Read the prompt template
const promptPath = path.join(__dirname, 'prompts', 'evidence-extraction-v1.md');
const promptTemplate = fs.readFileSync(promptPath, 'utf8');

// Extract just the user prompt section
const userPromptMatch = promptTemplate.match(/## User Prompt Template\n\n([\s\S]+?)\n---/);
const userPrompt = userPromptMatch ? userPromptMatch[1] : '';

// Replace placeholder with actual transcript
const finalPrompt = userPrompt.replace('{TRANSCRIPT_TEXT}', transcript);

// Output just the prompt (for piping to API)
if (process.argv.includes('--raw')) {
  console.log(finalPrompt);
} else {
  // Output with formatting for human viewing
  console.log(finalPrompt);
}
