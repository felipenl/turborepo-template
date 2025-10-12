#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Get changed files since last push or commit
 */
function getChangedFiles() {
  try {
    // Try to get changes since last push to origin
    return execSync('git diff --name-only @{push}..HEAD', { encoding: 'utf8' }).trim();
  } catch {
    // Fallback if @{push} doesn't exist (no upstream set)
    try {
      return execSync('git diff --name-only HEAD~1..HEAD', { encoding: 'utf8' }).trim();
    } catch {
      return '';
    }
  }
}

/**
 * Get modified projects from changed files
 */
function getModifiedProjects(changedFiles) {
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

  return Array.from(modifiedProjects);
}

/**
 * Increment version for a project
 */
function incrementProjectVersion(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    console.log(`⚠️  No package.json found for ${projectPath}, skipping`);
    return false;
  }

  console.log(`📦 Bumping version for ${projectPath}`);

  try {
    // Use npm version to increment patch version
    execSync(`cd ${projectPath} && npm version patch --no-git-tag-version`, { stdio: 'inherit' });

    // Stage the updated package.json
    execSync(`git add ${packageJsonPath}`);

    return true;
  } catch (error) {
    console.error(`❌ Failed to bump version for ${projectPath}:`, error.message);
    return false;
  }
}

/**
 * Commit version changes
 */
function commitVersionChanges(versionedProjects) {
  if (versionedProjects.length === 0) {
    return;
  }

  try {
    // Check if there are staged changes
    execSync('git diff --cached --quiet', { encoding: 'utf8' });
  } catch {
    // If git diff --cached --quiet fails, there are staged changes
    console.log('💾 Committing version bumps...');
    const projectsList = versionedProjects.join(', ');
    execSync(`git commit -m "chore: bump versions for ${projectsList} [skip ci]"`, {
      stdio: 'inherit',
    });
  }
}

/**
 * Main version bump function
 */
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

  // Increment versions for modified projects
  for (const project of modifiedProjects) {
    if (incrementProjectVersion(project)) {
      versionedProjects.push(project);
    }
  }

  // Commit version changes
  commitVersionChanges(versionedProjects);

  console.log('✅ Version bumps complete!');

  return { success: true, versionedProjects };
}

/**
 * Run version bump with error handling
 */
export function runVersionBump() {
  try {
    return versionBump();
  } catch (error) {
    console.error('❌ Error during version bump:', error.message);
    return { success: false, error: error.message };
  }
}
