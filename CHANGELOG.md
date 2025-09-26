# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.52] - 2025-09-25

### Added
- Tokyo Night color theme throughout the application
- Temperature gradient colors based on temperature ranges
- Weather condition contextual colors
- Air Quality Index (AQI) color indicators
- Wind speed color coding based on Beaufort scale
- Comprehensive theme system in src/theme.js
- Smart color mapping for weather severity and conditions

### Changed
- Replaced all direct chalk color calls with themed color functions
- Updated display.js to use Tokyo Night color palette
- Enhanced visual accessibility with high contrast colors
- Improved terminal compatibility for modern environments

### Technical
- Created modular theme system for easy customization
- Temperature colors adapt to Celsius/Fahrenheit units
- Consistent color mapping across all weather displays
- Updated all output functions to use themed colors

## [0.3.25] - 2025-09-20

### Added
- Enhanced rate limit messages with retry hints and API tier information
- Major cities support - 70+ cities work without country/state requirement
- Debug logging via WEATHER_DEBUG environment variable for network troubleshooting

### Changed
- Clean documentation with improved user experience
- Better error messaging and guidance

## [0.3.0] - 2025-09-15

### Added
- OS Keychain integration for secure API key storage using keytar
- Input sanitization and injection attack protection
- Structured error handling with specific error codes
- Automatic retry logic with exponential backoff for network issues
- Timeout protection (5-second timeout) to prevent hanging requests
- Enhanced caching with size limits, age limits, and LRU eviction
- Comprehensive testing suite including security, performance, and smoke tests
- New authentication commands: weather auth set and weather auth test

### Changed
- Eliminated all process.exit() calls from libraries for better reliability
- API keys never appear in logs or error messages for security
- Cache failures no longer affect weather lookups
- Cross-platform verification on macOS, Windows, and Linux

### Security
- Zero API key exposure in logs or error messages
- Comprehensive protection against injection attacks
- Secure credential management with OS keychain integration

## [0.0.24] - 2025-01-07

### 🎨 **Added**
- **Horizontal layout** with responsive design that adapts to terminal width
- **City, State format requirement** for better location accuracy
- **Enhanced location display** with city name in cyan and state/country in yellow
- **Modular architecture** split from 920-line file into 4 focused modules
- **Enhanced caching system** with 30-minute expiration and cleanup tools
- **Responsive design** with three layout modes (compact, medium, full)
- **Visual improvements** with emojis and better color coding
- **Cache management commands** with statistics and cleanup options
- **Security enhancements** with proper .env management and API key protection
- **Better error handling** with informative messages and validation

### 🏗️ **Architecture Changes**
- **Split monolithic file** into modular structure:
  - `src/weather.js` - API calls and weather logic
  - `src/cache.js` - Caching with expiration
  - `src/display.js` - UI formatting and output
  - `src/config.js` - Configuration management
- **Enhanced caching** with automatic expiration and cleanup
- **Improved error handling** with secure error messages
- **Better validation** for location format requirements

### 🔒 **Security**
- **Fixed .env file tracking** - Removed from git to prevent API key exposure
- **Updated dependencies** - Fixed security vulnerabilities in inquirer
- **Secure error messages** - No API key exposure in error output
- **Proper .gitignore** - Ensures sensitive files stay local
- **Clean documentation** - Removed API keys from documentation

### 🎯 **Breaking Changes**
- **Required format change**: Now requires `"City, State"` or `"City, Country"` format
- **Old format no longer works**: `weather "London"` now requires `weather "London, UK"`
- **Enhanced validation**: Clear error messages when format is incorrect

### 📊 **Performance**
- **Reduced API calls** through intelligent caching
- **Better cache management** with automatic expiration
- **Improved response times** with cache hit optimization
- **Memory optimization** with proper cleanup of expired entries

### 🧪 **Testing**
- **Added test files** for modules, basic functionality, and responsive design
- **Performance testing** with benchmarks and metrics
- **Security testing** with API key validation checks
- **Module testing** for all new modular components

### 📚 **Documentation**
- **Updated README** with new features and requirements
- **Added comprehensive examples** for all new features
- **Security documentation** with best practices
- **Installation guides** for different use cases

## [0.0.23] - 2025-01-06

### 🔒 **Security**
- Updated vulnerable dependencies
- Enhanced API key validation
- Improved error handling

## [0.0.22] - 2025-01-05

### ✨ **Added**
- Initial beta release
- Basic weather functionality
- Interactive mode
- Forecast support
- Cache system

### 🐛 **Fixed**
- Various bug fixes and improvements

---

## Version History

- **v0.0.24** (Current) - Major release with horizontal layout and modular architecture
- **v0.0.23** - Security improvements and dependency updates
- **v0.0.22** - Initial beta release with basic functionality

## Migration Guide

### From v0.0.22 to v0.0.24

**Breaking Changes:**
1. **Location Format**: Now requires `"City, State"` format
   ```bash
   # Old (no longer works)
   weather "London"
   
   # New (required)
   weather "London, UK"
   ```

2. **Installation**: Updated dependencies require reinstall
   ```bash
   npm install -g weather-cli
   ```

3. **Configuration**: Enhanced .env management
   ```bash
   cp .env.example .env
   # Edit with your API key
   ```

**New Features:**
- Horizontal layout with responsive design
- Enhanced caching with expiration
- Better error messages and validation
- Modular architecture for better maintainability

## Contributing

For information on contributing to this project, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

**Maintained by 16bitweather** | Part of the 16bitweather suite of weather tools