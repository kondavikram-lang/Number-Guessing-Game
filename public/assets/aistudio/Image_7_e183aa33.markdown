---
name: Guess It Neon Play
colors:
  surface: '#180d2d'
  surface-dim: '#180d2d'
  surface-bright: '#3f3355'
  surface-container-lowest: '#120727'
  surface-container-low: '#201536'
  surface-container: '#241a3a'
  surface-container-high: '#2f2445'
  surface-container-highest: '#3a2f50'
  on-surface: '#eaddff'
  on-surface-variant: '#debec8'
  inverse-surface: '#eaddff'
  inverse-on-surface: '#362b4c'
  outline: '#a68992'
  outline-variant: '#574048'
  surface-tint: '#ffb0cd'
  primary: '#ffb0cd'
  on-primary: '#640039'
  primary-container: '#f751a1'
  on-primary-container: '#570032'
  inverse-primary: '#b4136d'
  secondary: '#ddb8ff'
  on-secondary: '#490081'
  secondary-container: '#62259b'
  on-secondary-container: '#d1a1ff'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#009eb9'
  on-tertiary-container: '#002f38'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffd9e4'
  primary-fixed-dim: '#ffb0cd'
  on-primary-fixed: '#3e0022'
  on-primary-fixed-variant: '#8c0053'
  secondary-fixed: '#f0dbff'
  secondary-fixed-dim: '#ddb8ff'
  on-secondary-fixed: '#2c0051'
  on-secondary-fixed-variant: '#62259b'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#180d2d'
  on-background: '#eaddff'
  surface-variant: '#3a2f50'
typography:
  display:
    fontFamily: Outfit
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 54px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Outfit
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Outfit
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Outfit
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 30px
  headline-sm:
    fontFamily: Outfit
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '500'
    lineHeight: 26px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '700'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.03em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-sm: 0.75rem
  margin: 1rem
  margin-md: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes a high-energy, immersive, and playful digital arcade environment optimized for mobile web gameplay. Blending modern dark mode aesthetics with electric retro-arcade neon accents, it strikes an effortless balance between vibrant casual gaming and clean, ergonomic UI design.

Targeted at casual puzzle players, mobile-first gamers, and social trivia enthusiasts, the interface avoids sterile corporate flat styles in favor of tactile glowing depth, punchy feedback, and delightful motion hints. Deep midnight-violet canvas tones absorb visual distraction, allowing neon pinks, cyans, and purples to guide player focus dynamically toward clues, active inputs, and victory states.

## Colors
The color palette creates a luminous contrast hierarchy anchored in rich cosmic violets and electrified pops of neon:

- **Canvas & Backdrops:** Base background anchored at `#160b2b`, stepping up to `#211340` for elevated surfaces and interactive cards.
- **Primary Accent (`#ec4899`):** Radiant magenta powering primary interactive actions, high-stakes countdowns, and key celebratory moments.
- **Secondary Accent (`#c084fc`):** Soft luminous violet providing ambient energy, secondary game actions, and key thematic motifs.
- **Tertiary & Semantic Signals:**
  - Electric Cyan (`#06b6d4`): Clues, hints, active streaks, and information cards.
  - Emerald Bright (`#10b981`): Correct guesses, score spikes, and success banners.
  - Coral Rose (`#f43f5e`): Errors, time running out, and incorrect guess indicators.
- **Typography & Outlines:**
  - Base text sits on high-contrast crisp white (`#ffffff`) for headlines and soft lilac tint (`#e9d5ff`) for readable body text.
  - Borders and muted metadata leverage tinted purple midtones (`#a855f7` at 25% to 50% opacity).

## Typography
Typography bridges geometric arcade energy with rapid legibility on hand-held screens. 

- **Display & Headlines (Outfit):** Delivers geometric confidence, curved character geometry, and punchy impact for game titles, score milestones, and win headers. Tight letter tracking ensures crisp recognition at quick glances.
- **Body & Labels (Plus Jakarta Sans):** Offers balanced human warmth with generous x-height, rendering trivia clues, player hints, and system metadata readable even under bright ambient light or small device dimensions.

## Layout & Spacing
The layout relies on a dynamic, centered fluid single-column architecture constrained within a maximum mobile viewport width of 480px on desktop screens, while effortlessly expanding across full safe areas on native mobile web viewports.

- **Vertical Rhythm:** Game zones prioritize natural thumb reach, with key inputs and guessing tiles anchored in the lower 40% of the screen. Top zones are reserved for heads-up displays (timers, streaks, score tallies).
- **Safe Area Insets:** Page margins respect horizontal safe boundaries (`margin: 1rem`), expanding to `1.5rem` on larger tablet viewports.
- **Grids & Layout Slots:** Guessing letters and clue cards utilize flexible CSS grids with tight gutters (`0.5rem` to `0.75rem`) to maximize visual footprint without triggering horizontal scroll overflows.

## Elevation & Depth
Depth is produced through translucent dark purple surfaces combined with localized neon back-glows rather than traditional muddy drop shadows:

- **Level 0 (Backdrop):** Raw cosmic dark violet (`#160b2b`).
- **Level 1 (Card Surfaces):** Surface container `#211340` with 1px border stroke of `rgba(233, 213, 255, 0.12)`.
- **Level 2 (Interactive Floating Modules):** Translucent `#2a1752` elevated with a diffuse atmospheric shadow: `0 8px 24px rgba(10, 4, 20, 0.6)`.
- **Neon Luminescence (Active / Accent States):** 
  - Primary Magenta Glow: `0 0 20px rgba(236, 72, 153, 0.45)`.
  - Hint Cyan Glow: `0 0 16px rgba(6, 182, 212, 0.4)`.
  - Success Emerald Glow: `0 0 20px rgba(16, 185, 129, 0.5)`.

## Shapes
The design embraces generous, friendly radii that reinforce the bouncy, touchable mobile game personality:
- Small controls, letter tiles, and input segments adopt `rounded-lg` (1rem).
- Large gameplay cards, modals, and container shells adopt `rounded-2xl` to `rounded-3xl` (1.5rem to 2rem) for an organic, pocketable handheld feel.
- Badges, pills, and primary CTAs utilize full circular capsule geometry (`border-radius: 9999px`).

## Components

### Buttons & Action Controls
- **Primary Game Action:** Gradient fill from `#ec4899` to `#d946ef`, full pill border-radius, white bold label, active press translation (`translate-y-0.5`), and primary magenta neon glow.
- **Hint Action (Secondary):** Surface `#211340` with a vivid cyan border (`#06b6d4`), cyan text, and a glowing cyan accent badge showing hint count.
- **Keypad / Guess Tiles:** `rounded-lg` squares with `#28164d` background, `rgba(233, 213, 255, 0.15)` upper bevel border, and high-contrast bold typography. When pressed or locked, tiles pulse into emerald green (`#10b981`) or muted state.

### Cards & Container Panels
- **Game Prompt / Clue Card:** Layered on `#211340`, framed with a subtle 1px stroke of `#a855f7` (30% opacity). Generous inner padding (`1.5rem`), featuring soft radial gradients in background corners to evoke subtle studio backlighting.
- **Result / Modal Cards:** Deep violet frosted backdrop with `backdrop-filter: blur(12px)`, bordered by luminous magenta or emerald depending on win/loss outcome.

### Chips & Badges
- **Streak & Level Badges:** Capsule pills with semi-translucent dark background (`rgba(33, 19, 64, 0.8)`), an icon on the left, uppercase tracking label, and color-matched neon dot or outline (e.g., cyan for "HINT", magenta for "STREAK x3").

### Input Fields & Letter Slots
- **Guess Input Slots:** Discrete segmented boxes with heavy rounded corners (`12px`), dark violet fill, and bottom accent highlight. Active input slot gains a focused neon cyan glow outline and subtle rhythmic pulse animation.
- **Text Entry (if full keyboard enabled):** Frosted purple container, light lilac placeholder (`#a855f7`), and high-contrast `#ffffff` text input.

### Selection Controls (Toggles & Radios)
- Custom rounded pill switches; unselected thumb rests in muted lilac, active thumb slides with vibrant magenta fill and matching neon halo.