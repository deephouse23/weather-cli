# Weather CLI v0.0.2 - Simplified Global Installation 🌤️

**Major improvements to installation and usability!**

## ✨ What's New

### Simplified Commands
No more typing `weather now london` - just use `weather london`!

```bash
# Before ❌
weather now london
weather now "new york" --units imperial

# Now ✅
weather london  
weather "new york" --units imperial
```

### Global Installation  
Install once, use anywhere on your system:

```bash
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli
npm install && npm install -g weather-cli-16bit

# Now available globally!
weather london
weather forecast paris
weather tokyo --forecast
```

## 🚀 Quick Start

```bash
# Clone and install
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli
npm install && npm install -g weather-cli-16bit

# Set up API key  
cp .env.example .env
# Edit .env with your OpenWeatherMap API key

# Start using immediately!
weather london
weather "san francisco" --forecast
weather
```

## 📋 Full Changelog

### Added
- ⚡ **Simplified command syntax** - `weather london` works without `now`
- 🌍 **Global npm installation** - `npm install -g .` for system-wide access
- 📝 **Enhanced documentation** - Version badges, better README, comprehensive guides
- 🔧 **Repository metadata** - Homepage, bugs, and repository URLs in package.json
- 📚 **CHANGELOG.md** - Complete version history documentation
- 🛠️ **Development guides** - RELEASE_COMMANDS.md and updated CLAUDE.md
- 📄 **.env.example** - Template for easier API key setup

### Improved
- 🎯 **Command parsing** - Better argument detection and error handling
- 📖 **Documentation** - Professional README with installation focus
- 🔄 **User experience** - Clearer error messages and help text
- 🏗️ **Package structure** - Added `preferGlobal: true` for better npm experience

### Technical
- Version bumped to 0.0.2 in both package.json and CLI
- Enhanced CLI argument parsing for default location commands
- All existing commands remain 100% backwards compatible
- Cross-platform execution with proper shebang line

## 🛠️ All Commands

```bash
# Simplified (NEW!)
weather london
weather "new york" --forecast
weather tokyo --units imperial

# Original commands (still work!)
weather now london
weather forecast paris  
weather 5day berlin
weather compare london tokyo
weather coords 40.7128,-74.0060
weather interactive
weather config
weather cache
```

## ✅ Backwards Compatibility

**100% compatible** - All your existing commands and scripts continue to work unchanged!

## 🎯 Perfect For

- **Daily weather checks** - `weather london` from anywhere
- **Global CLI tools** - Install once, use system-wide  
- **Developers** - Clean, simple API with comprehensive docs
- **Power users** - All advanced features preserved

---

**Install globally and start using `weather london` from anywhere on your system! 🎉**

**Get Started:** https://github.com/deephouse23/weather-cli#installation