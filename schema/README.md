# Analysis Data Schema & Validation

This directory contains the JSON schema and validation tools to ensure consistency in the AI-generated analysis data.

## Problem This Solves

As we iterate on the AI analysis prompts, field names and data structures can drift, causing runtime errors in the React app:
- **snake_case vs camelCase** confusion (e.g., `student_id` vs `studentId`)
- **Missing required fields** that components depend on
- **Invalid enum values** (e.g., unexpected skill patterns)
- **Type mismatches** (strings vs numbers)

The schema provides a **single source of truth** for the expected data format and catches errors before they reach production.

## Quick Start

### Validate All Analysis Files
```bash
npm run validate
```

### Validate After Re-analysis
When you run any re-analysis script, validate immediately after:
```bash
node reanalyze-fix.js
npm run validate
```

If validation fails, the analysis data has incorrect format and needs to be fixed before deploying.

## Schema Overview

### Key Design Decisions

1. **Mixed Case Convention**
   - Most fields use `snake_case` (e.g., `student_id`, `transcript_metadata`)
   - **ONE exception**: `totalTurns` uses camelCase (for speaking turn count)
   - This matches the existing React component expectations

2. **Strict Mode**
   - `additionalProperties: false` prevents typos and unexpected fields
   - All required fields are explicitly listed
   - Enum values constrain categorical data

3. **Flexible Patterns**
   - `speaking_time_estimate` allows: "1 minute", "1-2 minutes", "<1 minute"
   - `skill.pattern` allows: "frequent", "occasional", "consistent", "not_observed"

## Common Validation Errors

### Error: "Unexpected field: studentId"
**Cause**: GPT-4o converted too many fields to camelCase
**Fix**: Re-run analysis with explicit snake_case instructions

### Error: "Missing required field: student_id"
**Cause**: Field was renamed or omitted by GPT-4o
**Fix**: Update prompt to explicitly require this field

### Error: "Invalid value: 'emerging' (allowed: frequent, occasional, consistent, not_observed)"
**Cause**: GPT-4o used a skill pattern value not in our schema
**Fix**: Either update schema to allow new value OR update prompt to restrict to allowed values

## Schema Files

- **`analysis-schema.json`**: The canonical JSON Schema defining the data structure
- **`../validate-analysis.js`**: Validation script using Ajv validator
- **`README.md`**: This file

## Updating the Schema

When you need to add/change fields:

1. **Edit `analysis-schema.json`**
   ```json
   {
     "properties": {
       "new_field": {
         "type": "string",
         "description": "What this field means"
       }
     }
   }
   ```

2. **Test validation**
   ```bash
   npm run validate
   ```

3. **Update React components** to use the new field

4. **Re-analyze transcripts** if field is required for existing weeks

5. **Validate again** to ensure consistency

## Integration with Re-analysis Scripts

**Best Practice**: Add validation to the end of any re-analysis script:

```javascript
async function main() {
  // ... run analysis ...

  console.log('\n✅ Analysis complete! Validating format...\n');

  const { exec } = await import('child_process');
  exec('npm run validate', (error, stdout, stderr) => {
    console.log(stdout);
    if (error) {
      console.error('⚠️  Validation failed! Fix errors before committing.');
      process.exit(1);
    }
  });
}
```

## Benefits

✅ **Catches errors early** - Before they cause React runtime errors
✅ **Documents structure** - Schema is self-documenting for new developers
✅ **Prevents regression** - Changes must pass validation before commit
✅ **Consistent data** - All weeks follow the same structure
✅ **Fast feedback** - Validation runs in seconds, not minutes

## Future Enhancements

Potential improvements:
- Add pre-commit hook to auto-validate before git commit
- Generate TypeScript types from schema for type safety
- Add schema versioning for backwards compatibility
- Create schema diff tool to show changes between versions
