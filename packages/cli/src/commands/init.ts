import * as fs from 'fs';
import * as path from 'path';
import prompts from 'prompts';
import { composeSkills } from '@ouas/skills';

interface InitOptions {
  skills?: boolean;
}

export async function initCommand(options: InitOptions) {
  if (options.skills) {
    await setupSkills();
  } else {
    console.log("Use 'npx ouas init --skills' to setup the Context Injection Layer.");
  }
}

async function setupSkills() {
  const cwd = process.cwd();
  console.log('🤖 Setting up OUAS Skills (Context Injection)...\n');

  // Detect Agent Environment
  let agentFile = '';
  let agentType: 'cursor' | 'copilot' | 'generic' | '' = '';
  
  if (fs.existsSync(path.join(cwd, '.cursorrules'))) {
    agentFile = '.cursorrules';
    agentType = 'cursor';
  } else if (fs.existsSync(path.join(cwd, '.windsurfrules'))) {
    agentFile = '.windsurfrules';
    agentType = 'generic'; 
  } else if (fs.existsSync(path.join(cwd, '.github', 'copilot-instructions.md'))) {
    agentFile = '.github/copilot-instructions.md';
    agentType = 'copilot';
  }

  if (agentType) {
    console.log(`✅ Detected ${agentFile} environment.`);
  }

  // If no environment detected, prompt
  const envResponse = await prompts([
    {
      type: agentType ? null : 'select',
      name: 'agent',
      message: 'Which AI Agent are you using?',
      choices: [
        { title: 'Cursor', value: 'cursor' },
        { title: 'GitHub Copilot', value: 'copilot' },
        { title: 'Windsurf / Generic', value: 'generic' }
      ]
    },
    {
      type: 'select',
      name: 'framework',
      message: 'Which frontend framework are you using?',
      choices: [
        { title: 'React (v18+)', value: 'react' },
        { title: 'Next.js (App Router)', value: 'nextjs' },
        { title: 'None / Framework Agnostic', value: 'none' }
      ]
    },
    {
      type: 'multiselect',
      name: 'tasks',
      message: 'Which tasks do you want the agent to learn? (Space to select)',
      choices: [
        { title: 'Annotating Components', value: 'annotate', selected: true },
        { title: 'Writing Manifests', value: 'manifest', selected: true },
        { title: 'Agent API Implementation', value: 'agent-api' },
        { title: 'Security & Locked Components', value: 'security' },
        { title: 'Prompt Engineering', value: 'prompt-engineering' }
      ],
      min: 0
    }
  ]);

  if (!envResponse.framework || (!agentType && !envResponse.agent)) {
     console.log("Operation cancelled.");
     return;
  }

  const finalAgentType = agentType || envResponse.agent;
  
  // Set default file if prompt was used
  if (!agentFile) {
     if (finalAgentType === 'cursor') agentFile = '.cursorrules';
     else if (finalAgentType === 'copilot') agentFile = '.github/copilot-instructions.md';
     else agentFile = 'ouas.skill.md'; // generic fallback
  }

  const framework = envResponse.framework === 'none' ? undefined : envResponse.framework;
  const tasks = envResponse.tasks;

  // Community Skills
  let communitySkills: { name: string, content: string }[] = [];
  try {
     const pkgPath = path.join(cwd, 'package.json');
     if (fs.existsSync(pkgPath)) {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        for (const dep of Object.keys(deps)) {
           const depPkgPath = path.join(cwd, 'node_modules', dep, 'package.json');
           if (fs.existsSync(depPkgPath)) {
              const depPkg = JSON.parse(fs.readFileSync(depPkgPath, 'utf8'));
              if (depPkg.skills) {
                 console.log(`✨ Found community skills in ${dep}`);
                 const skillPath = path.join(cwd, 'node_modules', dep, depPkg.skills);
                 if (fs.existsSync(skillPath)) {
                    communitySkills.push({
                       name: dep,
                       content: fs.readFileSync(skillPath, 'utf8')
                    });
                 }
              }
           }
        }
     }
  } catch(e) {
     // Ignore community skill scanning errors quietly
  }

  const composed = composeSkills({
     agent: finalAgentType,
     framework,
     tasks,
     includeCommunitySkills: communitySkills.length > 0 ? communitySkills : undefined
  });

  const outPath = path.join(cwd, agentFile);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, composed, 'utf8');

  console.log(`\n✅ Successfully injected OUAS Skills into ${agentFile}!`);
  console.log(`\nNext Steps:`);
  console.log(`1. Restart your AI Agent context if necessary.`);
  console.log(`2. Ask your agent to generate or modify components.`);
  console.log(`3. Run 'npx ouas generate' afterwards to update your manifest.`);
}
