#!/usr/bin/env node

/**
 * Validates analysis JSON files against the schema
 * Usage:
 *   node validate-analysis.js                    # Validate all analysis files
 *   node validate-analysis.js week-15-analysis.json  # Validate specific file
 */

import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load schema
const schemaPath = path.join(__dirname, 'schema', 'analysis-schema.json');
const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'));

// Setup validator
const ajv = new Ajv({ allErrors: true, verbose: true });
addFormats(ajv);
const validate = ajv.compile(schema);

function validateFile(filePath) {
  const fileName = path.basename(filePath);

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const valid = validate(data);

    if (valid) {
      console.log(`✅ ${fileName}`);
      return true;
    } else {
      console.log(`\n❌ ${fileName} - VALIDATION FAILED\n`);

      // Group errors by type for better readability
      const errorsByPath = {};
      validate.errors.forEach(error => {
        const path = error.instancePath || 'root';
        if (!errorsByPath[path]) {
          errorsByPath[path] = [];
        }
        errorsByPath[path].push(error);
      });

      // Print errors
      Object.entries(errorsByPath).forEach(([path, errors]) => {
        console.log(`   Path: ${path}`);
        errors.forEach(error => {
          if (error.keyword === 'additionalProperties') {
            console.log(`      ⚠️  Unexpected field: "${error.params.additionalProperty}"`);
            console.log(`         This field should not exist (check for typos or camelCase errors)`);
          } else if (error.keyword === 'required') {
            console.log(`      ⚠️  Missing required field: "${error.params.missingProperty}"`);
          } else if (error.keyword === 'enum') {
            console.log(`      ⚠️  Invalid value: ${JSON.stringify(error.data)}`);
            console.log(`         Allowed: ${error.params.allowedValues.join(', ')}`);
          } else if (error.keyword === 'type') {
            console.log(`      ⚠️  Wrong type: expected ${error.params.type}, got ${typeof error.data}`);
            console.log(`         Value: ${JSON.stringify(error.data)}`);
          } else {
            console.log(`      ⚠️  ${error.message}`);
            if (error.params) {
              console.log(`         Details: ${JSON.stringify(error.params)}`);
            }
          }
        });
        console.log('');
      });

      return false;
    }
  } catch (error) {
    console.log(`\n❌ ${fileName} - PARSE ERROR\n`);
    console.log(`   ${error.message}\n`);
    return false;
  }
}

function validateDirectory(dirPath) {
  const files = fs.readdirSync(dirPath)
    .filter(f => f.endsWith('-analysis.json'))
    .sort();

  if (files.length === 0) {
    console.log('⚠️  No analysis files found in', dirPath);
    return false;
  }

  console.log(`\n🔍 Validating ${files.length} analysis files...\n`);

  let allValid = true;
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const valid = validateFile(filePath);
    if (!valid) {
      allValid = false;
    }
  });

  return allValid;
}

function main() {
  const args = process.argv.slice(2);

  console.log('╔════════════════════════════════════════════════════════╗');
  console.log('║         Analysis JSON Schema Validator                ║');
  console.log('╚════════════════════════════════════════════════════════╝');

  let allValid = false;

  if (args.length === 0) {
    // Validate all files in analysis directory
    const analysisDir = path.join(__dirname, 'frontend', 'public', 'data', 'analysis');
    allValid = validateDirectory(analysisDir);
  } else {
    // Validate specific files
    console.log(`\n🔍 Validating ${args.length} file(s)...\n`);
    allValid = true;
    args.forEach(arg => {
      const filePath = path.resolve(arg);
      const valid = validateFile(filePath);
      if (!valid) {
        allValid = false;
      }
    });
  }

  console.log('\n' + '═'.repeat(60));
  if (allValid) {
    console.log('✅ All files valid!\n');
    process.exit(0);
  } else {
    console.log('❌ Validation failed - see errors above\n');
    console.log('Common issues:');
    console.log('  • student_id (snake_case) vs studentId (camelCase)');
    console.log('  • totalTurns (camelCase) vs total_turns (snake_case)');
    console.log('  • Missing required fields');
    console.log('  • Wrong data types (string vs number, etc.)\n');
    process.exit(1);
  }
}

main();
