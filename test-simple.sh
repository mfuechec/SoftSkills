#!/bin/bash

# Simple one-liner test for Claude CLI users
# No API key needed if you have Claude CLI installed

echo "🧪 Testing prompt with Claude CLI..."
echo ""

# Generate prompt and send to Claude
node test-prompt.js 2>/dev/null | \
  tail -n +3 | \
  head -n -8 | \
  claude --model claude-3-5-sonnet-20241022 \
  > test-results/week-10-analysis.json

if [ $? -eq 0 ]; then
    echo "✅ Test complete!"
    echo ""
    echo "📄 Results saved to: test-results/week-10-analysis.json"
    echo ""
    echo "To view formatted:"
    echo "  cat test-results/week-10-analysis.json | jq ."
    echo ""
    echo "To view raw:"
    echo "  cat test-results/week-10-analysis.json"
else
    echo "❌ Test failed. Do you have Claude CLI installed?"
    echo ""
    echo "Install: npm install -g @anthropic-ai/claude-cli"
fi
