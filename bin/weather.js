#!/usr/bin/env node

/**
 * @16bitweather/weather-cli
 * A beautiful command-line weather application with smart location search
 *
 * This is the main executable entry point for the weather CLI when installed globally.
 * It imports and runs the main application logic from the root index.js file.
 */

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { pathToFileURL } from 'url';

// Get the directory of this script and resolve the path to index.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const indexPath = join(__dirname, '..', 'index.js');

// Import and run the main application
try {
  // Convert the path to a proper file URL for cross-platform compatibility
  await import(pathToFileURL(indexPath).href);
} catch (error) {
  console.error('Error starting weather CLI:', error.message);
  process.exit(1);
}
