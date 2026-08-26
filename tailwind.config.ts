import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // Design system: single typeface (Plus Jakarta Sans via next/font → --font-jakarta)
        sans: ['var(--font-jakarta)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        // ── Design system tokens (brand-agnostic) ─────────────────────
        // brand      = the identity orange. Use for fills, icons, and text on DARK
        //              sections (6.7:1 on #0A192F).
        // brand.ink   = text-only shade for LIGHT backgrounds. #FF7A00 is 2.6:1 on
        //              white, which fails WCAG AA; this is 5.3:1. Use text-brand-ink
        //              for links/labels on white or surface-warm.
        brand: { DEFAULT: '#FF7A00', hover: '#E66E00', ink: '#B34D00' },
        'electric-blue': '#00D1FF',
        'midnight-navy': '#0A192F',
        slate: { 900: '#0F172A', 800: '#1E293B', 700: '#334155' },
        surface: { DEFAULT: '#FFFFFF', warm: '#F7F6F4' }, // bg-surface / bg-surface-warm
        hero: '#0A192F', // bg-hero (dark feature sections)
        'on-dark': '#e0e3e5',
        'muted-dark': '#8A9BB5',
        gray: {
          900: '#0F172A', 800: '#1E293B', 700: '#334155', 600: '#475569',
          500: '#64748b', 400: '#94a3b8', 300: '#cbd5e1', 200: '#e2e8f0',
          100: '#f1f5f9', 50: '#f8fafc',
        },
        error: '#ffb4ab',
      },
      // Soft shape language — 4px base, 8px max on cards. rounded-full is kept
      // for pills/chips, and arbitrary values (e.g. the phone mockup's
      // rounded-[2.75rem]) intentionally opt out for physical-object shapes.
      borderRadius: {
        sm: '0.25rem',
        DEFAULT: '0.25rem',
        md: '0.375rem',
        lg: '0.5rem',
      },
      boxShadow: {
        card: '0 1px 3px rgba(10,25,47,0.06), 0 4px 16px rgba(10,25,47,0.05)',
        'card-hover': '0 4px 24px rgba(10,25,47,0.10), 0 1px 4px rgba(10,25,47,0.06)',
      },
      maxWidth: { content: '1280px' },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
