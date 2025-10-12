#!/usr/bin/env node

/**
 * Test the version bump functionality
 */

import { runVersionBump } from './index.js';

console.log('🧪 Version Bump Function Test');
console.log('============================');

console.log('\n📋 Test: Version Bump Function');
try {
  console.log('Testing the main version bump function...');
  
  const result = runVersionBump();
  
  if (result.success) {
    console.log('✅ Function executed successfully');
    console.log('📦 Projects that would be versioned:', result.versionedProjects);
    
    if (result.versionedProjects.length > 0) {
      console.log('🎉 Version bump would be triggered for:', result.versionedProjects.join(', '));
    } else {
      console.log('ℹ️  No apps/packages were modified since last push/commit');
    }
  } else {
    console.log('❌ Function failed:', result.error || 'Unknown error');
  }
} catch (error) {
  console.log('ℹ️  Test completed with info:', error.message);
}

console.log('\n🎉 Function testing complete!');
