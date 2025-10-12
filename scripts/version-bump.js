#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Checking for modified projects to version bump...');

try {
  // Get the list of changed files since the last push to origin
  let changedFiles;
  try {
    changedFiles = execSync('git diff --name-only @{push}..HEAD', { encoding: 'utf8' }).trim();
  } catch {
    // Fallback if @{push} doesn't exist (no upstream set)
    try {
      changedFiles = execSync('git diff --name-only HEAD~1..HEAD', { encoding: 'utf8' }).trim();
    } catch {
      console.log('✅ Unable to determine changes, skipping version bump');
      process.exit(0);
    }
  }

  if (!changedFiles) {
    console.log('✅ No changes detected, skipping version bump');
    process.exit(0);
  }

  console.log('📝 Changed files:');
  console.log(changedFiles);

  const changedFilesArray = changedFiles.split('\n').filter(Boolean);
  const modifiedProjects = new Set();

  // Check for modified apps
  changedFilesArray.forEach(file => {
    const appMatch = file.match(/^apps\/([^/]+)\//);
    if (appMatch) {
      modifiedProjects.add(`apps/${appMatch[1]}`);
    }
  });

  // Check for modified packages
  changedFilesArray.forEach(file => {
    const packageMatch = file.match(/^packages\/([^/]+)\//);
    if (packageMatch) {
      modifiedProjects.add(`packages/${packageMatch[1]}`);
    }
  });

  if (modifiedProjects.size === 0) {
    console.log('✅ No apps or packages were modified, skipping version bump');
    process.exit(0);
  }

  console.log('🚀 Incrementing versions for modified projects...');

  const versionedProjects = [];

  // Increment versions for modified projects
  for (const project of modifiedProjects) {
    const packageJsonPath = path.join(project, 'package.json');
    
    if (fs.existsSync(packageJsonPath)) {
      console.log(`📦 Bumping version for ${project}`);
      
      try {
        // Use npm version to increment patch version
        execSync(`cd ${project} && npm version patch --no-git-tag-version`, { stdio: 'inherit' });
        
        // Stage the updated package.json
        execSync(`git add ${packageJsonPath}`);
        
        versionedProjects.push(project);
      } catch (error) {
        console.error(`❌ Failed to bump version for ${project}:`, error.message);
      }
    } else {
      console.log(`⚠️  No package.json found for ${project}, skipping`);
    }
  }

  // If we have version changes, commit them
  if (versionedProjects.length > 0) {
    try {
      // Check if there are staged changes
      const stagedChanges = execSync('git diff --cached --quiet', { encoding: 'utf8' });
    } catch {
      // If git diff --cached --quiet fails, there are staged changes
      console.log('💾 Committing version bumps...');
      const projectsList = versionedProjects.join(', ');
      execSync(`git commit -m "chore: bump versions for ${projectsList} [skip ci]"`, { stdio: 'inherit' });
    }
  }

  console.log('✅ Version bumps complete!');

} catch (error) {
  console.error('❌ Error during version bump:', error.message);
  process.exit(1);
}