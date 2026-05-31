#!/usr/bin/env node

/**
 * OUAS CLI
 *
 * Command-line interface for the OpenUI Adaptive Standard.
 *
 * Commands:
 *   ouas generate  — Scan project for withOUAS() calls and generate manifest.ouas.json
 *   ouas validate  — Validate a Layout Config against a manifest
 */

import { Command } from 'commander';
import { generate } from '../src/commands/generate.js';
import { validateCommand } from '../src/commands/validate.js';
import { initCommand } from '../src/commands/init.js';

const program = new Command();

program
  .name('ouas')
  .description('OpenUI Adaptive Standard — CLI tools for agent-customizable UIs')
  .version('1.0.0');

program
  .command('generate')
  .description('Scan project for withOUAS() annotated components and generate manifest.ouas.json')
  .option('-d, --dir <path>', 'Project directory to scan', '.')
  .option('-o, --output <path>', 'Output file path', './manifest.ouas.json')
  .option('--app-id <id>', 'Application ID (e.g. com.example.app)')
  .option('--app-name <name>', 'Application name')
  .action(async (options) => {
    await generate({
      dir: options.dir,
      output: options.output,
      appId: options.appId,
      appName: options.appName,
    });
  });

program
  .command('init')
  .description('Initialize OUAS in your project')
  .option('--skills', 'Inject OUAS skills into your agent context')
  .action(async (options) => {
    await initCommand(options);
  });

program
  .command('validate')
  .description('Validate a Layout Config against a manifest')
  .requiredOption('-c, --config <path>', 'Path to the Layout Config JSON file')
  .requiredOption('-m, --manifest <path>', 'Path to the manifest.ouas.json file')
  .action(async (options) => {
    await validateCommand({
      config: options.config,
      manifest: options.manifest,
    });
  });

program.parse();
