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
        // NB: `hero`, `midnight-navy`, `surface` and `electric-blue` were
        // removed here. The first three were duplicate names for colours the
        // ink/paper ramps already define (#0A192F reachable three ways,
        // #F7F6F4 two), which is how the same navy ended up stacked against
        // itself on /pricing under two names. electric-blue had zero uses.
        // The Tailwind-default `gray` and `slate` ramps lived here and were
        // the escape hatch every off-system colour used. Zero references now.
        'on-dark': '#e0e3e5',
        'muted-dark': '#8A9BB5',
        // ── Error, two shades. The single #ffb4ab was 10.4:1 on navy and
        //    1.6:1 on paper, so the same token was legible in the footer and
        //    invisible on the notify form. `ink` is 6.3:1 on paper.
        error: { DEFAULT: '#B3261E', ink: '#B3261E', 'on-dark': '#ffb4ab' },

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

        // ── One quiet tertiary (hotel-hardware warmth).
        //    Budget: <=2 ornamental moments per page — a rule under a section
        //    eyebrow, a divider hairline, or (as in the hero) one line of
        //    display type. Footnote asterisks don't count against it; they're
        //    disclosure markers, not decoration.
        //    #A8875C is 5.27:1 on ink-900, so it carries a headline on the
        //    dark bands. brass.ink is the text-safe shade on white (6.14:1).
        brass: { DEFAULT: '#A8875C', ink: '#7A5C33' },

        // ── One success green, two shades. Previously "available / open /
        //    verified" was carried by green-700, -600, -500, -400, -300 AND a
        //    parallel emerald family — six colours for one meaning, twice on
        //    the same page. `ink` is 4.6:1 on white; `on-dark` is 7.9:1 on
        //    ink-900. There is no third.
        ok: { ink: '#15803D', 'on-dark': '#86EFAC', surface: '#F0FAF3' },

        // ── Caution / "read this before you drive over". Built on brass so
        //    the one warm tertiary covers it rather than importing Tailwind's
        //    amber family, which was appearing as -50, -200, -300, -400, -500
        //    and -600 for the same callout across four files.
        note: { ink: '#7A5C33', line: '#E3D6C0', surface: '#FBF7F0' },
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
