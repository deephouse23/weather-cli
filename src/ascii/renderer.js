import chalk from 'chalk';
import { getPalette } from './palette.js';

const MIN_TERM_WIDTH = 50;

class AsciiRenderer {
  constructor(options = {}) {
    this.termWidth = options.termWidth || process.stdout.columns || 80;
    this.useColor =
      options.useColor !== undefined ? options.useColor : process.env.NO_COLOR === undefined;
    this.palette = getPalette(options.paletteName);
  }

  render(scene, options = {}) {
    const output = this.renderToString(scene, options);
    if (output) {
      console.log(output);
    }
  }

  renderToString(scene, options = {}) {
    if (this.termWidth < MIN_TERM_WIDTH) {
      return '';
    }

    const lines = scene.getArt(options);
    const pad = Math.max(0, Math.floor((this.termWidth - scene.width) / 2));
    const padding = ' '.repeat(pad);

    const rendered = lines.map((line) => {
      const colored = this.useColor
        ? this.colorLine(line, scene.charColors, this.palette, scene.defaultColor)
        : line;
      return padding + colored;
    });

    return rendered.join('\n');
  }

  colorLine(line, charColors, palette, defaultColorKey) {
    let output = '';
    for (const ch of line) {
      if (ch === ' ') {
        output += ' ';
        continue;
      }
      const key = charColors[ch] || defaultColorKey;
      const hex = palette[key];
      output += hex ? chalk.hex(hex)(ch) : ch;
    }
    return output;
  }
}

export { AsciiRenderer, MIN_TERM_WIDTH };
