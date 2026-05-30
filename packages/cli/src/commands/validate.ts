/**
 * OUAS CLI — Validate Command
 *
 * Validates a Layout Config against a manifest.
 *
 * Usage: npx ouas validate --config ./config.json --manifest ./manifest.ouas.json
 */

import * as fs from 'fs';
import * as path from 'path';

interface ValidateOptions {
  config: string;
  manifest: string;
}

export async function validateCommand(options: ValidateOptions): Promise<void> {
  const { config: configPath, manifest: manifestPath } = options;

  // Load files
  const configFile = path.resolve(configPath);
  const manifestFile = path.resolve(manifestPath);

  if (!fs.existsSync(configFile)) {
    console.error(`❌ Config file not found: ${configFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(manifestFile)) {
    console.error(`❌ Manifest file not found: ${manifestFile}`);
    process.exit(1);
  }

  const config = JSON.parse(fs.readFileSync(configFile, 'utf-8'));
  const manifest = JSON.parse(fs.readFileSync(manifestFile, 'utf-8'));

  // Dynamic import to avoid bundling issues
  const { validate } = await import('@ouas/validator');

  console.log(
    `\n🔍 Validating ${path.basename(configFile)} against ${path.basename(manifestFile)}...\n`,
  );

  const result = validate(config, manifest);

  if (result.valid) {
    console.log('✅ Config is valid!\n');

    if (result.migration_applied) {
      console.log('ℹ️  Config was migrated from an older manifest version.');
      if (result.migration_warnings && result.migration_warnings.length > 0) {
        console.log('   Migration warnings:');
        for (const warning of result.migration_warnings) {
          console.log(`   ⚠️  ${warning.message}`);
        }
      }
      console.log('');
    }

    if (result.warnings.length > 0) {
      console.log('⚠️  Warnings:');
      for (const warning of result.warnings) {
        console.log(`   ${warning.code}: ${warning.message}`);
      }
      console.log('');
    }
  } else {
    console.error('❌ Config is invalid!\n');
    console.error(`   ${result.errors.length} error(s) found:\n`);

    for (const error of result.errors) {
      console.error(`   ❌ [${error.code}] ${error.message}`);
      if (error.suggestion) {
        console.error(`      💡 ${error.suggestion}`);
      }
      if (error.available_values) {
        console.error(`      📋 Available: ${error.available_values.join(', ')}`);
      }
      console.error('');
    }

    process.exit(1);
  }
}
