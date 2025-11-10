#!/bin/bash

# Test Evidence Extraction Prompt with OpenAI
# Loads API key from .env file
# Usage: ./test-openai.sh [week-number]
# Example: ./test-openai.sh 10

WEEK=${1:-10}

echo "🧪 Testing Evidence Extraction Prompt with Week $WEEK transcript (OpenAI)..."
echo ""

# Load .env file if it exists
if [ -f .env ]; then
    echo "📁 Loading .env file..."
    export $(cat .env | grep -v '^#' | xargs)
else
    echo "⚠️  No .env file found!"
    echo ""
    echo "Please create .env file:"
    echo "  1. cp .env.example .env"
    echo "  2. Edit .env and add your OPENAI_API_KEY"
    echo ""
    exit 1
fi

# Check if API key is set
if [ -z "$OPENAI_API_KEY" ]; then
    echo "⚠️  OPENAI_API_KEY not found in .env file!"
    echo ""
    echo "Please add it to your .env file:"
    echo "  OPENAI_API_KEY=sk-your-key-here"
    echo ""
    exit 1
fi

# Ensure test-results directory exists
mkdir -p test-results

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo "⚠️  jq is not installed. Installing is recommended for JSON handling."
    echo "   brew install jq"
    echo ""
    exit 1
fi

# Generate the prompt
echo "📝 Generating prompt for Week $WEEK..."
PROMPT=$(node test-prompt.js $WEEK --raw)

if [ $? -ne 0 ]; then
    echo "❌ Failed to generate prompt"
    exit 1
fi

# Call OpenAI API
echo "🤖 Calling OpenAI API (gpt-4-turbo)..."
echo "   This may take 30-60 seconds..."
echo ""

curl -s https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d "$(jq -n \
    --arg prompt "$PROMPT" \
    '{
      "model": "gpt-4o",
      "response_format": { "type": "json_object" },
      "messages": [
        {
          "role": "system",
          "content": "You are an expert educational psychologist specializing in Social-Emotional Learning (SEL) assessment. Your task is to analyze classroom discussion transcripts and extract specific, concrete behavioral evidence of non-academic skills development. CRITICAL: You MUST analyze ALL students mentioned in the transcript, even if they have minimal participation. Return results as valid JSON only. No additional commentary."
        },
        {
          "role": "user",
          "content": $prompt
        }
      ],
      "temperature": 0.7,
      "max_tokens": 16384
    }')" > test-results/week-$WEEK-openai-response.json

# Check if the API call was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ API call complete!"
    echo ""

    # Check for errors in response
    if grep -q '"error"' test-results/week-$WEEK-openai-response.json; then
        echo "❌ API returned an error:"
        cat test-results/week-$WEEK-openai-response.json | jq '.error'
        exit 1
    fi

    echo "📄 Full response saved to: test-results/week-$WEEK-openai-response.json"
    echo ""

    # Extract just the analysis JSON
    cat test-results/week-$WEEK-openai-response.json | jq -r '.choices[0].message.content' > test-results/week-$WEEK-analysis.json

    echo "📊 Analysis JSON saved to: test-results/week-$WEEK-analysis.json"
    echo ""

    # Quick validation
    STUDENT_COUNT=$(cat test-results/week-$WEEK-analysis.json | jq '.students | length' 2>/dev/null)
    if [ ! -z "$STUDENT_COUNT" ] && [ "$STUDENT_COUNT" -gt 0 ]; then
        echo "✅ Found $STUDENT_COUNT students in analysis"
        echo ""
        cat test-results/week-$WEEK-analysis.json | jq -r '.students[] | "  - \(.student_id) (\(.total_turns) turns)"'
        echo ""
    fi

    echo "To view formatted analysis:"
    echo "  cat test-results/week-$WEEK-analysis.json | jq ."
    echo ""
    echo "To view session analysis:"
    echo "  cat test-results/week-$WEEK-analysis.json | jq '.session_analysis'"
    echo ""
    echo "To view a specific student (e.g., Alex):"
    echo "  cat test-results/week-$WEEK-analysis.json | jq '.students[] | select(.student_id==\"Alex\")'"

else
    echo ""
    echo "❌ API call failed!"
    echo ""
    echo "Check:"
    echo "  - Is your OPENAI_API_KEY correct in .env?"
    echo "  - Do you have credits in your OpenAI account?"
    echo "  - Is your internet connection working?"
    exit 1
fi
