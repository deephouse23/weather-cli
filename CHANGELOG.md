# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.24] - 2025-01-07

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

- **v0.2.24** (Current) - Major release with horizontal layout and modular architecture
- **v0.0.23** - Security improvements and dependency updates
- **v0.0.22** - Initial beta release with basic functionality

## Migration Guide

### From v0.0.22 to v0.2.24

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