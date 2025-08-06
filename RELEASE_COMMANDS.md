# Git Commands for v0.0.2 Release

Follow these commands to create a proper GitHub release for version 0.0.2:

## 1. Stage and Commit All Changes

```bash
# Check current status
git status

# Add all changes
git add .

# Create release commit
git commit -m "Release v0.0.2

- Add simplified command syntax (weather london)
- Add global npm package installation support
- Update documentation with installation guides
- Add repository information to package.json
- Add comprehensive CHANGELOG.md

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"
```

## 2. Create and Push Git Tag

```bash
# Create annotated tag for the release
git tag -a v0.0.2 -m "Release v0.0.2

Weather CLI v0.0.2 - Simplified Global Installation

New Features:
- Simplified command syntax: 'weather london' (no need for 'now')
- Global npm package installation with 'npm install -g .'
- Enhanced documentation and installation guides

Improvements:
- Better command parsing and error handling
- Updated README with version badges and clearer instructions
- Added repository metadata to package.json

This release makes Weather CLI much easier to install and use globally."

# Push commits and tags
git push origin main
git push origin v0.0.2
```

## 3. Create GitHub Release (using gh CLI)

```bash
# Create GitHub release with release notes
gh release create v0.0.2 \
  --title "v0.0.2 - Simplified Global Installation" \
  --notes "## Weather CLI v0.0.2 🌤️

**Major improvements to installation and usability!**

### ✨ What's New
- **Simplified commands**: Just type \`weather london\` instead of \`weather now london\`
- **Global installation**: Install once with \`npm install -g .\` and use anywhere
- **Better documentation**: Comprehensive installation guides and examples

### 🚀 Quick Start
\`\`\`bash
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli
npm install && npm install -g .
weather london
\`\`\`

### 📋 Full Changelog
- Add simplified command syntax for easier usage
- Add global npm package installation support  
- Enhanced CLI argument parsing
- Updated README with version badges and improved instructions
- Added repository information to package.json
- Created comprehensive CHANGELOG.md
- Better error handling and user experience

### 🛠️ Technical Details
- Version bumped to 0.0.2 in both package.json and CLI
- Added \`preferGlobal: true\` to package.json
- Enhanced command parsing logic for default location commands
- All existing commands remain backwards compatible

**Install globally and start using \`weather london\` from anywhere on your system!** 🎉" \
  --latest
```

## 4. Alternative: Manual GitHub Release

If you don't have `gh` CLI installed, you can create the release manually:

1. Go to https://github.com/deephouse23/weather-cli/releases
2. Click "Create a new release"
3. Tag version: `v0.0.2`
4. Release title: `v0.0.2 - Simplified Global Installation`
5. Copy the release notes from the `gh release create` command above
6. Check "Set as the latest release"
7. Click "Publish release"

## 5. Verify Release

```bash
# Verify the tag was created
git tag -l

# Verify remote has the tag
git ls-remote --tags origin

# Check GitHub release page
echo "Visit: https://github.com/deephouse23/weather-cli/releases/tag/v0.0.2"
```

## 6. Test Installation from Release

To test that users can install from the release:

```bash
# Test cloning and installing
cd /tmp
git clone https://github.com/deephouse23/weather-cli.git weather-cli-test
cd weather-cli-test
git checkout v0.0.2
npm install && npm install -g .
weather --version  # Should show 0.0.2
```

## Notes

- All commands assume you're in the weather-cli directory
- Make sure you have push permissions to the repository
- The `gh` CLI tool needs to be authenticated with GitHub
- Users will be able to install this version with the simplified commands immediately after the release