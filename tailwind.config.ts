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
        // Display face. Used ONLY at >=20px and never above weight 500 —
        // a bold serif at 60px reads "clearance sale", 400 reads "editorial".
        serif: ['var(--font-fraunces)', 'ui-serif', 'Georgia', 'serif'],
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

        // ── Navy ladder — structure and hierarchy. Carries ~90% of the
        //    non-photo surface so orange doesn't have to.
        //    ink.500 on white = 6.46:1 (better than the gray-500 it replaces).
        //    ink.300/400 are rules and decoration only, never body text.
        ink: {
          900: '#0A192F', 800: '#10233D', 700: '#1B3252', 600: '#2C4468',
          // 400 is the quiet-caption step and is only ever used as text on a
          // light ground. It was #7B8CA3 — 3.4:1 on white, which fails AA for
          // body text at any size. #647287 keeps the same hue and role at
          // 4.9:1 on white and 4.5:1 on the warm paper grounds.
          500: '#48607F', 400: '#647287', 300: '#B4BFCC', 200: '#DCE2E9',
          100: '#EDF0F4',
        },

        // ── Warm paper ground. Warmer than pure white — this is what stops
        //    the generic-SaaS read and signals hospitality.
        paper: {
          DEFAULT: '#FBFAF8', 100: '#F7F6F4', 200: '#EFEDE8',
          300: '#E4E0D8', 400: '#CFC8BB',
        },

        // ── One quiet tertiary (hotel-hardware warmth). Budget: <=2 per page,
        //    for the rule under a section eyebrow and divider hairlines.
        //    brass.ink is the text-safe shade (6.14:1 on white).
        brass: { DEFAULT: '#A8875C', ink: '#7A5C33' },
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
      maxWidth: {
        content: '1280px',
        headline: '18ch', // headlines must be measure-constrained or they rag
        measure: '62ch',
        prose: '68ch',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
export default config
