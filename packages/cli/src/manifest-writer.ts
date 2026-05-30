/**
 * OUAS CLI — Manifest Writer
 *
 * Takes extracted component definitions from the scanner and writes
 * a complete manifest.ouas.json file.
 */

import * as fs from 'fs';
import * as path from 'path';

interface ManifestOptions {
  appId: string;
  appName: string;
  outputPath: string;
  components: Record<string, unknown>[];
  dataSources?: { id: string; description: string; fields?: string[] }[];
}

/**
 * Writes a manifest.ouas.json file from scanned component definitions.
 */
export function writeManifest(options: ManifestOptions): string {
  const { appId, appName, outputPath, components, dataSources = [] } = options;

  const manifest = {
    ouas_version: '1.0',
    app_id: appId,
    app_name: appName,
    generated_at: new Date().toISOString(),
    manifest_version: '1.0.0',
    components,
    data_sources: dataSources,
    constraints: {
      max_components_per_layout: 20,
    },
    component_aliases: {},
  };

  const json = JSON.stringify(manifest, null, 2);
  const fullPath = path.resolve(outputPath);

  // Ensure directory exists
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  fs.writeFileSync(fullPath, json, 'utf-8');
  return fullPath;
}
