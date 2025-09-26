# Testing Guide for weather-cli

This document outlines the comprehensive testing pipeline for the weather-cli Node.js CLI application.

## Testing Framework

We use **Jest** as our primary testing framework with the following key features:
- ES Module support
- Node.js environment testing
- Mocked external API calls using `nock`
- CLI testing using `execa`
- Code coverage reporting

## Test Structure

```
test/
├── setup.js                 # Jest setup and global configuration
├── cli.test.js              # CLI command execution tests
├── weather-api.test.js      # Weather API response parsing tests
├── error-handling.test.js   # Comprehensive error handling tests
├── config.test.js           # Configuration file operations tests
└── main-cli.test.js         # Main CLI entry point integration tests
```

## Running Tests

### Basic Commands

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run tests for CI (no watch, with coverage)
npm run test:ci

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Test Categories

#### 1. CLI Command Tests (`cli.test.js`)
Tests CLI command execution using `execa`:
- Help and version commands
- Weather commands with mocked APIs
- Error handling for invalid inputs
- Configuration commands

#### 2. Weather API Tests (`weather-api.test.js`)
Tests weather API response parsing:
- API response structure validation
- Temperature unit handling
- Error response handling
- Coordinates-based weather lookup
- Edge cases and malformed responses

#### 3. Error Handling Tests (`error-handling.test.js`)
Comprehensive error scenario testing:
- WeatherError class functionality
- Error code mapping to exit codes
- Input validation errors
- API error scenarios (404, 401, 429, 5xx)
- Network timeout and connection errors
- Cache and authentication error handling

#### 4. Configuration Tests (`config.test.js`)
Tests configuration file operations:
- Default location and units management
- Configuration file creation and parsing
- Environment variable fallbacks
- Input validation and sanitization
- File permission and corruption handling

#### 5. Main CLI Integration Tests (`main-cli.test.js`)
End-to-end CLI integration testing:
- Version and help display
- Direct weather lookups
- Command-line options and flags
- Interactive mode behavior
- Output formatting verification

## Mocking Strategy

### API Mocking with Nock
All external API calls are mocked using `nock`:

```javascript
import nock from 'nock';

// Mock weather API response
nock('https://api.openweathermap.org')
  .get('/data/2.5/weather')
  .query(true)
  .reply(200, mockWeatherResponse);
```

### CLI Testing with Execa
CLI commands are tested using `execa`:

```javascript
import { execa } from 'execa';

const { stdout } = await execa('node', [CLI_PATH, '--version']);
expect(stdout).toMatch(/\\d+\\.\\d+\\.\\d+/);
```

## CI/CD Pipeline

### GitHub Actions Workflow (`.github/workflows/ci.yml`)

The CI pipeline runs on:
- **Triggers**: Push and Pull Request to `main` and `develop` branches
- **Node Versions**: 18.x and 20.x
- **Operating Systems**: Ubuntu, macOS, Windows
- **Dependencies**: Cached npm dependencies for faster builds

### Pipeline Steps

1. **Setup**: Checkout code and setup Node.js with npm caching
2. **Install**: Install dependencies with `npm ci`
3. **Lint**: Run ESLint to check code quality
4. **Test**: Execute all tests with coverage
5. **Security**: Run npm security audit
6. **Build**: Verify application builds successfully
7. **CLI Test**: Test global CLI installation

### Coverage Reporting

Coverage reports are generated and uploaded to Codecov:
- **Threshold**: Minimum coverage requirements
- **Reports**: LCOV and HTML formats
- **Integration**: GitHub PR status checks

## Test Configuration

### Jest Configuration (`package.json`)

```json
{
  "jest": {
    "testEnvironment": "node",
    "collectCoverageFrom": [
      "src/**/*.js",
      "index.js",
      "!src/**/*.test.js"
    ],
    "coverageDirectory": "coverage",
    "testMatch": [
      "**/test/**/*.test.js",
      "**/test/**/*.spec.js"
    ],
    "extensionsToTreatAsEsm": [".js"]
  }
}
```

### ESLint Configuration (`.eslintrc.json`)

- **Environment**: Node.js and Jest
- **Style**: Standard JavaScript with custom rules
- **Modules**: ES2022 module support
- **Ignores**: Coverage and build directories

## Environment Setup

### Required Environment Variables

```bash
# For testing (automatically set in CI)
NODE_ENV=test
WEATHER_API_KEY=test_api_key

# For debugging network requests
WEATHER_DEBUG=true
```

### Dependencies

```json
{
  "devDependencies": {
    "@jest/globals": "^29.7.0",
    "eslint": "^8.57.0",
    "execa": "^8.0.1",
    "jest": "^29.7.0",
    "nock": "^13.4.0",
    "tmp": "^0.2.1"
  }
}
```

## Writing New Tests

### Test File Structure

```javascript
import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import nock from 'nock';

describe('Feature Name', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    process.env.WEATHER_API_KEY = 'test_api_key';
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  test('should test specific functionality', async () => {
    // Mock external calls
    nock('https://api.example.com')
      .get('/endpoint')
      .reply(200, { data: 'test' });

    // Test implementation
    const result = await functionUnderTest();

    // Assertions
    expect(result).toBeDefined();
  });
});
```

### Best Practices

1. **Mock External Calls**: Always mock HTTP requests and file system operations
2. **Test Error Scenarios**: Include negative test cases
3. **Use Descriptive Names**: Test names should clearly describe what is being tested
4. **Clean Up**: Always clean up mocks and environment changes
5. **Test Edge Cases**: Include boundary conditions and malformed inputs
6. **Verify Exit Codes**: CLI tests should verify proper exit codes

## Debugging Tests

### Running Specific Tests

```bash
# Run specific test file
npm test -- cli.test.js

# Run tests matching pattern
npm test -- --grep "weather API"

# Run tests with verbose output
npm test -- --verbose

# Run single test
npm test -- --testNamePattern="should display version"
```

### Debug Mode

```bash
# Enable debug output
WEATHER_DEBUG=true npm test

# Run with Node.js debugger
node --inspect-brk node_modules/.bin/jest --runInBand
```

## Coverage Requirements

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

Coverage reports are available in:
- **Console**: Summary during test runs
- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`

## Security Testing

The pipeline includes security auditing:
- **npm audit**: Check for vulnerable dependencies
- **Dependency scanning**: Monitor for outdated packages
- **Input validation**: Test injection prevention
- **API key handling**: Verify secure credential management

This comprehensive testing approach ensures the weather-cli application is robust, secure, and reliable across different environments and use cases.