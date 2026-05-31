import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import skillsManifest from './content/skills_manifest.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ComposeSkillsOptions {
  agent: 'cursor' | 'copilot' | 'generic';
  framework?: 'react' | 'nextjs';
  tasks?: Array<'annotate' | 'manifest' | 'agent-api' | 'security' | 'prompt-engineering'>;
  includeCommunitySkills?: { name: string; content: string }[];
}

/**
 * Returns the raw markdown content for a given skill file path
 */
function getSkillContent(relativePath: string): string {
  try {
    const fullPath = path.join(__dirname, 'content', relativePath);
    return fs.readFileSync(fullPath, 'utf-8');
  } catch (error) {
    console.error(`Failed to read skill file: ${relativePath}`, error);
    return '';
  }
}

/**
 * Composes a full skills markdown document based on the requested options.
 */
export function composeSkills(options: ComposeSkillsOptions): string {
  const parts: string[] = [];
  
  // 1. Core
  const coreContent = getSkillContent('core.md');
  if (coreContent) {
    parts.push(coreContent);
  }

  // 2. Framework
  if (options.framework) {
    const fwContent = getSkillContent(`frameworks/${options.framework}.md`);
    if (fwContent) {
      parts.push(fwContent);
    }
  }

  // 3. Tasks
  if (options.tasks && options.tasks.length > 0) {
    for (const task of options.tasks) {
      const taskContent = getSkillContent(`tasks/${task}.md`);
      if (taskContent) {
        parts.push(taskContent);
      }
    }
  }

  // 4. Community Skills
  if (options.includeCommunitySkills && options.includeCommunitySkills.length > 0) {
    parts.push(`\n## Community Skills\n`);
    for (const communitySkill of options.includeCommunitySkills) {
      parts.push(`\n### ${communitySkill.name}\n`);
      parts.push(communitySkill.content);
    }
  }

  // Combine content
  let combinedContent = parts.join('\n\n---\n\n');

  // 5. Agent Formatting
  const agentWrapper = getSkillContent(`agents/${options.agent}.md`);
  if (agentWrapper && agentWrapper.includes('{{CONTENT}}')) {
    combinedContent = agentWrapper.replace('{{CONTENT}}', combinedContent);
  }

  // Add version header
  const versionHeader = `<!-- OUAS Skills v${skillsManifest.version} -->\n`;
  return versionHeader + combinedContent;
}

export function getManifest() {
  return skillsManifest;
}
