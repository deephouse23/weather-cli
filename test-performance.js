#!/usr/bin/env node

import { performance } from 'perf_hooks';
import chalk from 'chalk';
import { getWeather } from './src/weather.js';
import { getCachedWeather, setCachedWeather, clearCache, getCacheStats } from './src/cache.js';

// Performance test configuration
const TEST_LOCATIONS = [
  'New York',
  'London',
  'Tokyo',
  'Sydney',
  'Paris'
];

const TEST_UNITS = ['celsius', 'fahrenheit', 'auto'];

async function runPerformanceTest() {
  console.log(chalk.cyan.bold('🚀 Weather CLI Performance Test\n'));
  
  // Clear cache before testing
  await clearCache();
  console.log(chalk.yellow('🧹 Cache cleared for testing\n'));
  
  const results = {
    apiCalls: [],
    cacheHits: [],
    totalTime: 0
  };
  
  const startTime = performance.now();
  
  // Test 1: API calls (cold cache)
  console.log(chalk.blue('📡 Testing API calls (cold cache)...'));
  for (const location of TEST_LOCATIONS) {
    for (const units of TEST_UNITS) {
      const testStart = performance.now();
      try {
        await getWeather(location, units);
        const testEnd = performance.now();
        results.apiCalls.push({
          location,
          units,
          time: testEnd - testStart
        });
        console.log(chalk.green(`✅ ${location} (${units}): ${(testEnd - testStart).toFixed(2)}ms`));
      } catch (error) {
        console.log(chalk.red(`❌ ${location} (${units}): ${error.message}`));
      }
    }
  }
  
  // Test 2: Cache hits (warm cache)
  console.log(chalk.blue('\n📦 Testing cache hits (warm cache)...'));
  for (const location of TEST_LOCATIONS) {
    for (const units of TEST_UNITS) {
      const testStart = performance.now();
      try {
        const cached = await getCachedWeather(location, units);
        if (cached) {
          const testEnd = performance.now();
          results.cacheHits.push({
            location,
            units,
            time: testEnd - testStart
          });
          console.log(chalk.green(`✅ ${location} (${units}): ${(testEnd - testStart).toFixed(2)}ms`));
        } else {
          console.log(chalk.yellow(`⚠️  ${location} (${units}): Not cached`));
        }
      } catch (error) {
        console.log(chalk.red(`❌ ${location} (${units}): ${error.message}`));
      }
    }
  }
  
  const endTime = performance.now();
  results.totalTime = endTime - startTime;
  
  // Display results
  console.log(chalk.cyan.bold('\n📊 Performance Results:'));
  
  if (results.apiCalls.length > 0) {
    const avgApiTime = results.apiCalls.reduce((sum, r) => sum + r.time, 0) / results.apiCalls.length;
    const minApiTime = Math.min(...results.apiCalls.map(r => r.time));
    const maxApiTime = Math.max(...results.apiCalls.map(r => r.time));
    
    console.log(chalk.blue('\n🌐 API Calls:'));
    console.log(chalk.white(`  Average: ${avgApiTime.toFixed(2)}ms`));
    console.log(chalk.white(`  Fastest: ${minApiTime.toFixed(2)}ms`));
    console.log(chalk.white(`  Slowest: ${maxApiTime.toFixed(2)}ms`));
    console.log(chalk.white(`  Total calls: ${results.apiCalls.length}`));
  }
  
  if (results.cacheHits.length > 0) {
    const avgCacheTime = results.cacheHits.reduce((sum, r) => sum + r.time, 0) / results.cacheHits.length;
    const minCacheTime = Math.min(...results.cacheHits.map(r => r.time));
    const maxCacheTime = Math.max(...results.cacheHits.map(r => r.time));
    
    console.log(chalk.blue('\n📦 Cache Hits:'));
    console.log(chalk.white(`  Average: ${avgCacheTime.toFixed(2)}ms`));
    console.log(chalk.white(`  Fastest: ${minCacheTime.toFixed(2)}ms`));
    console.log(chalk.white(`  Slowest: ${maxCacheTime.toFixed(2)}ms`));
    console.log(chalk.white(`  Total hits: ${results.cacheHits.length}`));
  }
  
  console.log(chalk.blue('\n⏱️  Total Test Time:'));
  console.log(chalk.white(`  ${results.totalTime.toFixed(2)}ms`));
  
  // Cache statistics
  const stats = await getCacheStats();
  console.log(chalk.blue('\n📦 Final Cache Statistics:'));
  console.log(chalk.white(`  Total entries: ${stats.total}`));
  console.log(chalk.green(`  Valid entries: ${stats.valid}`));
  console.log(chalk.yellow(`  Expired entries: ${stats.expired}`));
  
  // Performance recommendations
  console.log(chalk.cyan.bold('\n💡 Recommendations:'));
  
  if (results.apiCalls.length > 0 && results.cacheHits.length > 0) {
    const avgApiTime = results.apiCalls.reduce((sum, r) => sum + r.time, 0) / results.apiCalls.length;
    const avgCacheTime = results.cacheHits.reduce((sum, r) => sum + r.time, 0) / results.cacheHits.length;
    const speedup = avgApiTime / avgCacheTime;
    
    console.log(chalk.green(`  Cache provides ${speedup.toFixed(1)}x speedup over API calls`));
  }
  
  if (results.apiCalls.length > 0) {
    const avgApiTime = results.apiCalls.reduce((sum, r) => sum + r.time, 0) / results.apiCalls.length;
    if (avgApiTime > 2000) {
      console.log(chalk.yellow('  ⚠️  API calls are slow (>2s average). Consider:'));
      console.log(chalk.white('     - Checking network connection'));
      console.log(chalk.white('     - Verifying API key validity'));
      console.log(chalk.white('     - Using a different API endpoint'));
    }
  }
  
  console.log(chalk.green('\n✅ Performance test completed!'));
}

// Run the test
runPerformanceTest().catch(console.error);
