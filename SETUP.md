# Setup Guide - API Keys & Testing

## 🔐 Secure API Key Setup

### Step 1: Create Your .env File

```bash
# Copy the example file
cp .env.example .env
```

### Step 2: Add Your OpenAI API Key

Open `.env` in your editor and add your actual key:

```bash
# .env file (this is git-ignored!)
OPENAI_API_KEY=sk-proj-your-actual-key-here
```

**IMPORTANT:**
- ✅ `.env` is in `.gitignore` and will NOT be committed to git
- ✅ Claude Code will NOT read `.env` files (safe from AI exposure)
- ⚠️  Never commit API keys to git!
- ⚠️  Never paste API keys in chat with AI!

### Step 3: Verify Setup

```bash
# Check that .env exists
ls -la .env

# Verify it's git-ignored
git status  # .env should NOT appear if you run this
```

## 🧪 Running Tests

### Quick Test with OpenAI

```bash
./test-openai.sh
```

This will:
1. Load your API key from `.env`
2. Generate the prompt with Week 10 transcript
3. Call OpenAI GPT-4-Turbo
4. Save results to `test-results/week-10-analysis.json`

### View Results

```bash
# View formatted JSON
cat test-results/week-10-analysis.json | jq .

# View just session analysis
cat test-results/week-10-analysis.json | jq '.session_analysis'

# View specific student (e.g., Alex - low participation)
cat test-results/week-10-analysis.json | jq '.students[] | select(.student_id=="Alex")'

# View Maya's empathy evidence
cat test-results/week-10-analysis.json | jq '.students[] | select(.student_id=="Maya") | .skills.empathy_perspective_taking.evidence'
```

## 📦 Dependencies

### Required: jq (JSON processor)

```bash
# macOS
brew install jq

# Linux
sudo apt-get install jq

# Check installation
jq --version
```

### Required: Node.js (for prompt generation)

You already have this if you're running Claude Code, but verify:

```bash
node --version  # Should be v14 or higher
```

## 🔍 What Gets Git-Ignored

The `.gitignore` file protects these sensitive/generated files:

```
.env                    # Your API keys (NEVER commit!)
.env.local             # Local overrides
test-results/          # API responses (may contain data)
node_modules/          # Dependencies
dist/, build/, out/    # Build outputs
.DS_Store              # macOS junk
```

## 🚨 Security Checklist

Before committing ANY code:

- [ ] `.env` file exists and contains your real API key
- [ ] `.env` is listed in `.gitignore`
- [ ] Run `git status` - `.env` should NOT appear
- [ ] No API keys hardcoded in any `.js`, `.sh`, or `.md` files
- [ ] Test scripts load keys from `.env` only

## 🛠️ Troubleshooting

### "OPENAI_API_KEY not found"

```bash
# Check if .env exists
ls -la .env

# Check .env contents (safe - it's local only)
cat .env

# Verify key format
# Should start with: sk-proj-...
```

### "jq: command not found"

```bash
# Install jq
brew install jq

# Test
echo '{"test": "works"}' | jq .
```

### "API call failed"

Possible causes:
1. Invalid API key → Check `.env` file
2. No credits → Check OpenAI billing dashboard
3. Rate limit → Wait a minute and retry
4. Network issue → Check internet connection

View error details:
```bash
cat test-results/week-10-openai-response.json | jq '.error'
```

## 📚 Next Steps

Once setup is complete:

1. Run `./test-openai.sh`
2. Review output in `test-results/week-10-analysis.json`
3. Validate accuracy (see `PROMPT-TESTING-README.md`)
4. Iterate on prompt if needed
5. Test with Week 20 transcript
6. Lock final prompt for batch processing

## 🤝 Sharing Results

**Safe to share:**
- Analysis JSON outputs (they contain synthetic student data)
- Prompt files
- Test scripts
- Documentation

**NEVER share:**
- Your `.env` file
- Your API keys
- Any file containing real API credentials

When sharing analysis results, you can safely commit:
- `test-results/week-10-analysis.json` ✅
- `test-results/week-20-analysis.json` ✅

But `.gitignore` blocks the whole `test-results/` folder by default for safety.

---

**Ready?** Run `./test-openai.sh` and let's see what we get!
