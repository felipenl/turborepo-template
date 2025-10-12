#!/usr/bin/env node

import { runVersionBump } from './index.js';

// Run the version bump
const result = runVersionBump();

// Exit with appropriate code
process.exit(result.success ? 0 : 1);
