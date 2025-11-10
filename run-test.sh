#!/bin/bash

# Test Evidence Extraction Prompt
# This script runs the prompt against Week 10 transcript using Claude API

echo "🧪 Testing Evidence Extraction Prompt with Week 10 transcript..."
echo ""

# Check if API key is set
if [ -z "$ANTHROPIC_API_KEY" ]; then
    echo "⚠️  ANTHROPIC_API_KEY not set. Please export it first:"
    echo "   export ANTHROPIC_API_KEY='your-key-here'"
    exit 1
fi

# Generate the prompt
echo "📝 Generating prompt..."
node test-prompt.js > test-results/complete-prompt-week-10.txt 2>&1

# Extract just the prompt content (skip the header instructions)
tail -n +3 test-results/complete-prompt-week-10.txt | head -n -8 > test-results/prompt-only.txt

# Call Claude API
echo "🤖 Calling Claude API..."
echo ""

curl https://api.anthropic.com/v1/messages \
  -H "content-type: application/json" \
  -H "x-api-key: $ANTHROPIC_API_KEY" \
  -H "anthropic-version: 2023-06-01" \
  -d "{
    \"model\": \"claude-3-5-sonnet-20241022\",
    \"max_tokens\": 4096,
    \"messages\": [
      {
        \"role\": \"user\",
        \"content\": $(jq -Rs . < test-results/prompt-only.txt)
      }
    ],
    \"system\": \"You are an expert educational psychologist specializing in Social-Emotional Learning (SEL) assessment. Your task is to analyze classroom discussion transcripts and extract specific, concrete behavioral evidence of non-academic skills development. Return results as valid JSON only. No additional commentary.\"
  }" > test-results/week-10-api-response.json

echo ""
echo "✅ API call complete!"
echo ""
echo "📄 Response saved to: test-results/week-10-api-response.json"
echo ""
echo "To view the analysis:"
echo "  cat test-results/week-10-api-response.json | jq '.content[0].text' | jq ."
echo ""
echo "Or just:"
echo "  cat test-results/week-10-api-response.json"
