# Contributing to Weather CLI

Thank you for your interest in contributing to the Weather CLI! This project is maintained by 16bitweather and we welcome contributions from the community.

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Git
- A text editor or IDE

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/your-username/weather-cli.git
   cd weather-cli
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up your environment:
   ```bash
   cp .env.example .env
   # Add your OpenWeatherMap API key to .env
   ```

5. Test that everything works:
   ```bash
   npm start
   # or
   node index.js
   ```

## How to Contribute

### Reporting Bugs

Before creating bug reports, please check if the issue already exists. When creating a bug report, please include:

- **Clear title and description**
- **Steps to reproduce** the behavior
- **Expected behavior**
- **Actual behavior**
- **Screenshots** if applicable
- **Environment information** (OS, Node.js version, terminal)
- **Error messages** or logs

### Suggesting Features

We welcome feature suggestions! Please:

1. Check if the feature has already been requested
2. Create an issue with the "enhancement" label
3. Describe the feature in detail
4. Explain why it would be useful
5. Consider if it fits with the project's goals

### Submitting Pull Requests

1. **Create a feature branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**:
   - Follow the existing code style
   - Write clear, concise commit messages
   - Add tests if applicable
   - Update documentation if needed

3. **Test your changes**:
   ```bash
   npm start
   # Test various commands and options
   ```

4. **Commit your changes**:
   ```bash
   git commit -m "Add feature: description of your changes"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub:
   - Use a clear title and description
   - Reference any related issues
   - Include screenshots for UI changes
   - List any breaking changes

## Code Style

This project follows these conventions:

- **ES Modules**: Use `import`/`export` syntax
- **Async/Await**: Prefer async/await over promises
- **Error Handling**: Always handle errors gracefully
- **Comments**: Add comments for complex logic
- **Constants**: Use UPPER_CASE for constants
- **Functions**: Use descriptive names and JSDoc if needed

### Code Structure

The project uses a single-file architecture (`index.js`) for simplicity. When adding features:

- Keep related functionality grouped together
- Use clear function names
- Add error handling for all external API calls
- Follow the existing patterns for CLI commands

## Testing

Currently, this project relies on manual testing. When adding features:

1. Test all existing commands still work
2. Test your new feature with various inputs
3. Test error conditions (invalid API key, network issues, etc.)
4. Test on different operating systems if possible

## Feature Ideas

Some features we'd love to see:
- Weather maps and visualizations
- More detailed weather alerts
- Support for multiple saved locations
- Weather notifications
- Historical weather data
- Weather comparisons and trends

## Questions?

If you have questions about contributing:
- Create an issue with the "question" label
- Check existing issues for similar questions
- Reach out to the 16bitweather team

## Code of Conduct

Be respectful and constructive in all interactions. We're here to build something useful together!

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Maintained by 16bitweather** | Part of the 16bitweather suite of weather tools