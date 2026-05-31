/**
 * OUAS CLI — Generate Command
 *
 * Scans a project for withOUAS() annotated components and generates
 * a manifest.ouas.json file.
 *
 * Usage: npx ouas generate [--dir ./src] [--output ./manifest.ouas.json]
 */

import * as path from 'path';
import { scanProject } from '../scanner.js';
import { writeManifest } from '../manifest-writer.js';
import { checkSkillsStaleness } from '../staleness.js';

interface GenerateOptions {
  dir: string;
  output: string;
  appId?: string;
  appName?: string;
}

export async function generate(options: GenerateOptions): Promise<void> {
  const { dir, output, appId, appName } = options;
  const projectDir = path.resolve(dir);

  checkSkillsStaleness(projectDir);

  console.log(`\n🔍 Scanning ${projectDir} for OUAS components...\n`);

  const result = await scanProject(projectDir);

  if (result.errors.length > 0) {
    console.warn('⚠️  Scan warnings:');
    for (const error of result.errors) {
      console.warn(`   ${error}`);
    }
    console.log('');
  }

  if (result.components.length === 0) {
    console.error(
      '❌ No OUAS components found. Make sure your components are wrapped with withOUAS().',
    );
    console.error('   Example:\n');
    console.error("   import { withOUAS } from '@ouas/react';");
    console.error('   export default withOUAS(MyComponent, { id: "my-component", ... });\n');
    process.exit(1);
  }

  // Infer app info from package.json if not provided
  const resolvedAppId = appId ?? 'com.example.app';
  const resolvedAppName = appName ?? 'My App';

  const outputPath = writeManifest({
    appId: resolvedAppId,
    appName: resolvedAppName,
    outputPath: path.resolve(output),
    components: result.components as unknown as Record<string, unknown>[],
  });

  console.log(
    `✅ Found ${result.components.length} OUAS components across ${result.files.length} files`,
  );
  console.log(`📄 Manifest written to: ${outputPath}\n`);

  // List components
  for (const comp of result.components) {
    const c = comp as { id: string; display_name: string; fields: Record<string, unknown> };
    const fieldCount = Object.keys(c.fields ?? {}).length;
    console.log(`   • ${c.id} (${c.display_name}) — ${fieldCount} fields`);
  }
  console.log('');
}
