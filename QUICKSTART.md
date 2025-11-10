# ⚡ Quick Start - Test Your Prompt in 3 Steps

## 1️⃣ Setup API Key (one time only)

```bash
# Create .env file
cp .env.example .env

# Edit .env and add your key
# Change: OPENAI_API_KEY=sk-your-key-here
# To:     OPENAI_API_KEY=sk-proj-your-actual-key-12345...
nano .env  # or use your favorite editor
```

## 2️⃣ Run Test

```bash
./test-openai.sh
```

Wait ~30-60 seconds for OpenAI to process.

## 3️⃣ View Results

```bash
# Formatted output
cat test-results/week-10-analysis.json | jq .

# Quick checks
cat test-results/week-10-analysis.json | jq '.session_analysis'
cat test-results/week-10-analysis.json | jq '.students[] | .student_id'
```

---

## What to Look For ✅

**All students included?**
```bash
cat test-results/week-10-analysis.json | jq '.students[] | .student_id'
# Should show: Maya, Jordan, Alex, Sam, Casey
```

**Alex has low confidence?** (only 2 turns)
```bash
cat test-results/week-10-analysis.json | jq '.students[] | select(.student_id=="Alex") | .skills.empathy_perspective_taking.confidence'
# Should be: "low"
```

**Quotes are exact from transcript?**
```bash
cat test-results/week-10-analysis.json | jq '.students[0].skills.empathy_perspective_taking.evidence[0].quote'
# Verify against transcripts/week-10.md
```

**Sam's interruptions caught?**
```bash
cat test-results/week-10-analysis.json | jq '.session_analysis.concerns'
# Should mention interruptions
```

---

## Need Help?

- **Setup details:** See `SETUP.md`
- **Full testing guide:** See `PROMPT-TESTING-README.md`
- **Troubleshooting:** See `SETUP.md` → Troubleshooting section

---

## Next Steps After First Test

1. ✅ Verify output accuracy
2. 🔄 Iterate on prompt if needed (edit `prompts/evidence-extraction-v1.md`)
3. 🧪 Test with Week 20 to validate growth detection
4. 🎯 Lock final prompt for batch processing all 6 transcripts
