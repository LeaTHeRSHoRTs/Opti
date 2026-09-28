import { execSync } from 'child_process';
import fs from 'fs';

// Read the version from package.json
const { version } = JSON.parse(fs.readFileSync('./package.json', 'utf8'));

try {
  // Commit changes (if any)
  console.log('Committing changes...');
  execSync('git add .', { stdio: 'inherit' });
  execSync(`git commit -m "v${version}"`, { stdio: 'inherit' });

  // Push changes to the repository
  console.log('Pushing changes to remote repository...');
  execSync('git push origin master', { stdio: 'inherit' });
  
  console.log(`Successfully pushed changes for version ${version}!`);
} catch (error) {

  if (error instanceof Error) console.error('Error during git push:', error.message);
  else console.error('Error during git push:', error);

  process.exit(1);
}
