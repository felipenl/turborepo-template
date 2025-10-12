#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function getChangedFiles() {
  try {
    return execSync('git diff --name-only @{push}..HEAD', { encoding: 'utf8' }).trim();
  } catch {
    try {
      return execSync('git diff --name-only HEAD~1..HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return '';
    }
  }
}

function getModifiedProjects(changedFiles) {
  const changedFilesArray = changedFiles.split('\n').filter(Boolean);
  const modifiedProjects = new Set();

  changedFilesArray.forEach(file => {
    const appMatch = file.match(/^apps\/([^/]+)\//);
    if (appMatch) {
      modifiedProjects.add(`apps/${appMatch[1]}`);
    }
  });

  changedFilesArray.forEach(file => {
    const packageMatch = file.match(/^packages\/([^/]+)\//);
    if (packageMatch) {
      modifiedProjects.add(`packages/${packageMatch[1]}`);
    }
  });

  return Array.from(modifiedProjects);
}

function incrementProjectVersion(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.log(`⚠️  No package.json found for ${projectPath}, skipping`);
    return false;
  }

  console.log(`📦 Bumping version for ${projectPath}`);

  try {
    execSync(`cd ${projectPath} && npm version patch --no-git-tag-version`, { stdio: 'inherit' });
    execSync(`git add ${packageJsonPath}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to bump version for ${projectPath}:`, error.message);
    return false;
  }
}

function commitVersionChanges(versionedProjects) {
  if (versionedProjects.length === 0) {
    return;
  }

  try {
    execSync('git diff --cached --quiet', { encoding: 'utf8' });
  } catch {
    console.log('💾 Committing version bumps...');
    const projectsList = versionedProjects.join(', ');
    execSync(`git commit -m "chore: bump versions for ${projectsList} [skip ci]"`, {
      stdio: 'inherit',
    });
  }
}

export function versionBump() {
  console.log('🔍 Checking for modified projects to version bump...');

  const changedFiles = getChangedFiles();

  if (!changedFiles) {
    console.log('✅ No changes detected, skipping version bump');
    return { success: true, versionedProjects: [] };
  }

  console.log('📝 Changed files:');
  console.log(changedFiles);

  const modifiedProjects = getModifiedProjects(changedFiles);

  if (modifiedProjects.length === 0) {
    console.log('✅ No apps or packages were modified, skipping version bump');
    return { success: true, versionedProjects: [] };
  }

  console.log('🚀 Incrementing versions for modified projects...');

  const versionedProjects = [];

  for (const project of modifiedProjects) {
    if (incrementProjectVersion(project)) {
      versionedProjects.push(project);
    }
  }

  commitVersionChanges(versionedProjects);

  console.log('✅ Version bumps complete!');

  return { success: true, versionedProjects };
}

export function runVersionBump() {
  try {
    return versionBump();
  } catch (error) {
    console.error('❌ Error during version bump:', error.message);
    return { success: false, error: error.message };
  }
}
