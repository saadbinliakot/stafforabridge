import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Ultra-black palette
        obsidian: {
          DEFAULT:      'var(--obsidian)',
          card:         'var(--obsidian-card)',
          elevated:     'var(--obsidian-elevated)',
          deep:         'var(--obsidian-deep)',
          border:       'var(--obsidian-border)',
          'border-strong': 'var(--obsidian-border-strong)',
          'border-glow':   'var(--obsidian-border-glow)',
        },
        silver: {
          DEFAULT: 'var(--silver)',
          muted:   'var(--silver-muted)',
          dim:     'var(--silver-dim)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          hover:   'var(--accent-hover)',
          white:   'var(--accent-white)',
        },

        // Semantic aliases (all dark now)
        ink:   'var(--ink)',
        paper: 'var(--paper)',
        line:  'var(--line)',

        // Legacy brand tokens (shimmed to dark values for gradual migration)
        marine: {
          DEFAULT:  'var(--marine-blue)',
          contrast: 'var(--marine-blue-contrast)',
        },
        brred: {
          DEFAULT:  'var(--bright-red)',
          contrast: 'var(--bright-red-contrast)',
        },
        butter: {
          DEFAULT:  'var(--butter-yellow)',
          contrast: 'var(--butter-yellow-contrast)',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'Arial Black', 'sans-serif'],
        mono:    ['var(--font-mono)', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      borderRadius: {
        brut: '2px',
      },
      boxShadow: {
        // Premium dark glow shadows (replaces neo-brutalist offset shadows)
        'card':     '0 1px 3px rgba(0,0,0,0.8), 0 1px 2px rgba(0,0,0,0.9)',
        'elevated': '0 4px 16px rgba(0,0,0,0.9)',
        'glow-sm':  '0 0 12px rgba(200,208,220,0.06)',
        'glow':     '0 0 24px rgba(200,208,220,0.08)',
        // Legacy shims
        'brut-sm':    'none',
        'brut':       'none',
        'brut-lg':    'none',
        'brut-press': 'none',
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [],
};

export default config;
