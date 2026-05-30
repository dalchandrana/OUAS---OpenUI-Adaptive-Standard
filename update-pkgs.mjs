import fs from 'fs';
import path from 'path';

const packages = ['spec', 'validator', 'renderer', 'react', 'cli'];
const repoRoot = '/Users/rudrarana/Desktop/UniOS/packages';

packages.forEach(pkg => {
  const pkgPath = path.join(repoRoot, pkg, 'package.json');
  const content = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  
  content.publishConfig = { access: 'public' };
  content.repository = { type: 'git', url: 'https://github.com/ouas/ouas.git' };
  content.author = 'OUAS Team';
  content.license = 'MIT';
  // Note: the PRD says use @ouas scope. Let's make sure the name is scoped.
  if (!content.name.startsWith('@ouas/')) {
    content.name = `@ouas/${content.name}`;
  }
  
  fs.writeFileSync(pkgPath, JSON.stringify(content, null, 2));
  console.log(`Updated ${pkg}/package.json`);
});
