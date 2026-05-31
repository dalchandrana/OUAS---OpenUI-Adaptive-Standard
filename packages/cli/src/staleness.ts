import * as fs from 'fs';
import * as path from 'path';
import { getManifest } from '@ouas/skills';

export function checkSkillsStaleness(cwd: string) {
  const possibleFiles = ['.cursorrules', '.windsurfrules', '.github/copilot-instructions.md', 'ouas.skill.md'];
  
  for (const file of possibleFiles) {
    const filePath = path.join(cwd, file);
    if (fs.existsSync(filePath)) {
       const content = fs.readFileSync(filePath, 'utf8');
       const lines = content.split('\n');
       
       // Search first 10 lines for the version header to optimize
       for (let i = 0; i < Math.min(10, lines.length); i++) {
           if (lines[i].startsWith('<!-- OUAS Skills v')) {
              const match = lines[i].match(/v([0-9]+\.[0-9]+\.[0-9]+)/);
              if (match) {
                 const localVersion = match[1];
                 const currentVersion = getManifest().version;
                 
                 if (localVersion !== currentVersion) {
                    console.warn(`\n⚠️  Your OUAS Skills file (${file} - v${localVersion}) is out of date. Current version is v${currentVersion}.`);
                    console.warn(`   Run 'npx ouas init --skills' to get the latest patterns.\n`);
                 }
                 return; // Version checked, stop looking
              }
           }
       }
       return; // File found but no version, stop looking
    }
  }
}
