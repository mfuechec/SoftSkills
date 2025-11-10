# Evidence Extraction Prompt - Testing Guide

## What We Built

I've created an evidence extraction prompt designed to analyze classroom discussion transcripts and extract behavioral evidence of non-academic skills.

**Key Features:**
- **Evidence-first approach**: Extracts specific quotes with context
- **All 5 CASEL skills**: Empathy, Collaboration, Adaptability, Listening, Participation
- **Confidence tracking**: Flags when evidence is limited
- **Session analysis**: Class-wide patterns, key moments, teacher recommendations
- **Structured JSON output**: Ready for frontend consumption

## Files Created

```
prompts/
  └── evidence-extraction-v1.md       # Full prompt template with documentation

test-results/
  └── TESTING-INSTRUCTIONS.md         # Detailed testing guide

test-prompt.js                         # Node script to build complete prompt
run-test.sh                           # Automated test runner (uses Claude API)
```

## Quick Test (Recommended)

### Option 1: Automated Test with Claude API

```bash
# Set your API key
export ANTHROPIC_API_KEY='your-key-here'

# Run the test
./run-test.sh

# View results
cat test-results/week-10-api-response.json | jq '.content[0].text' | jq .
```

### Option 2: Manual Test with Claude CLI

```bash
# Generate the prompt
node test-prompt.js > test-results/complete-prompt-week-10.txt

# Send to Claude (interactive)
cat test-results/complete-prompt-week-10.txt | \
  tail -n +3 | head -n -8 | \
  claude --model claude-3-5-sonnet-20241022 > test-results/week-10-analysis.json
```

### Option 3: Test with OpenAI API

```bash
export OPENAI_API_KEY='your-key-here'

curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d @- <<EOF > test-results/week-10-openai-response.json
{
  "model": "gpt-4-turbo",
  "response_format": { "type": "json_object" },
  "messages": [
    {
      "role": "system",
      "content": "You are an expert educational psychologist specializing in Social-Emotional Learning (SEL) assessment. Return results as valid JSON only."
    },
    {
      "role": "user",
      "content": $(cat test-results/complete-prompt-week-10.txt | tail -n +3 | head -n -8 | jq -Rs .)
    }
  ]
}
EOF
```

## What to Validate

After running the test, check the JSON output for:

### 1. Structure Quality
- [ ] Valid, parseable JSON
- [ ] All 5 students included (Maya, Jordan, Alex, Sam, Casey)
- [ ] Each student has all 5 skill categories
- [ ] Session analysis is present

### 2. Evidence Quality
- [ ] Quotes are **exact** from transcript (not paraphrased)
- [ ] Context explains what prompted the behavior
- [ ] Behavior descriptions are specific and observable
- [ ] Line references are accurate

### 3. Accuracy Checks

**Maya** (6 turns, facilitating):
- Should have evidence for empathy (validating Sam's point)
- Should have collaboration evidence (building on Jordan)
- Confidence should be medium-high (decent sample size)

**Alex** (2 turns, minimal participation):
- Should have LOW confidence across all skills
- Scores should be 0 or very low (insufficient evidence)
- Should flag "needs more participation opportunities"

**Sam** (8 turns, 2 interruptions):
- Should catch interrupting behavior
- Should have participation evidence (high frequency)
- Might flag listening concerns

**Jordan** (5 turns, interrupted once):
- Should have collaboration evidence
- Should catch the "Wait, Sam, let Maya finish" moment
- Balanced participation

**Casey** (4 turns):
- Moderate participation
- Should extract relevant skill evidence

### 4. Session Analysis
- [ ] Overall engagement level (should be "medium" to "high")
- [ ] Key moments identified (Sam interruptions, growth discussion)
- [ ] Concerns flagged (interruptions, Alex minimal participation)
- [ ] Teacher recommendations are actionable

### 5. Confidence Logic
- [ ] High confidence when 4+ evidence examples
- [ ] Medium confidence when 2-3 examples
- [ ] Low confidence when 0-1 examples
- [ ] Explicitly states rationale

### 6. Scoring Logic
- [ ] Scores are 0-5 scale
- [ ] 0 used for "insufficient evidence" (not "bad performance")
- [ ] Scores align with evidence quality
- [ ] Score note clarifies they're secondary to evidence

## Expected Issues (First Run)

**Common problems we might see:**
1. **Hallucinated quotes**: AI makes up quotes not in transcript
   - Fix: Strengthen "quote exactly" instruction
2. **Vague evidence**: "Student showed empathy throughout"
   - Fix: Demand specific quotes with line numbers
3. **Missing students**: Skips low-participation students
   - Fix: Explicitly require all students, even with 0 turns
4. **Confidence too high**: Marks low evidence as high confidence
   - Fix: Strengthen confidence criteria
5. **Scores don't match evidence**: High scores with little evidence
   - Fix: Add explicit scoring rubric cross-check

## Success Criteria

**Minimum viable prompt succeeds if:**
- ✅ All 5 students have entries
- ✅ At least 3 exact quotes per high-participation student
- ✅ Alex flagged with low confidence (2 turns)
- ✅ Sam's interruptions caught
- ✅ Valid JSON structure
- ✅ A teacher would say "yes, that's mostly accurate"

**Excellent prompt succeeds if:**
- ✅ All above, plus:
- ✅ Line references are accurate
- ✅ Session analysis provides actionable insights
- ✅ No hallucinated content
- ✅ Confidence levels match evidence quantity precisely
- ✅ Scores justify themselves through evidence

## Next Steps After Testing

1. **Review the output** - Does it feel accurate?
2. **Check for hallucinations** - Do all quotes exist in transcript?
3. **Iterate if needed** - Adjust prompt based on issues found
4. **Test with Week 20** - Validate it catches growth over time
5. **Lock the prompt** - Once it works, freeze it for batch processing

## Questions to Answer

- Does the AI understand the difference between "insufficient evidence" (0 score) and "poor performance" (1-2 score)?
- Are the teacher recommendations actually useful?
- Would this output help a teacher have better coaching conversations?
- Does the session analysis add value beyond individual evidence?

## Ready to Test?

Run this command to start:

```bash
./run-test.sh
```

Or if you prefer Claude CLI:

```bash
node test-prompt.js > /tmp/prompt.txt && cat /tmp/prompt.txt | claude
```

Let me know what the output looks like and we'll iterate from there!
