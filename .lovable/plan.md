

# WUAMA — Global Design System Setup

## Overview
Set up a comprehensive design system for a B2B SaaS financial dashboard called **WUAMA**, establishing all foundational tokens, typography, component overrides, and utility patterns that every future screen will inherit.

---

## 1. Typography & Fonts
- Import **DM Sans** (body) and **Plus Jakarta Sans** (headings) from Google Fonts
- Define font size scale: page title (28px semibold), section titles (18px semibold), card labels (12px medium uppercase tracking-wide), KPI values (28px bold), body (14px regular)
- Apply heading font to all h1–h6 elements and body font globally

## 2. Color Palette (CSS Variables)
- **Background**: cool light gray `hsl(220 20% 97%)`
- **Card/Surface**: white
- **Primary**: vivid blue `hsl(221 83% 53%)`
- **Accent**: lighter blue `hsl(217 91% 60%)`
- **Destructive**: red `hsl(0 84% 60%)`
- **Warning**: amber `hsl(38 92% 50%)`
- **Success**: green `hsl(142 71% 45%)`
- **Muted / Muted foreground**: gray tones for secondary text
- **Border**: `hsl(220 13% 91%)`, **Ring**: matches primary

## 3. Spacing & Layout Tokens
- Border radius: 10px cards, 8px buttons/inputs, 6px badges
- Card shadows (default + hover)
- Page padding: 24px desktop / 16px mobile
- Card padding: 20px (24px for chart cards)
- Grid gap: 16px, section spacing: 24px

## 4. Shadcn Component Overrides
- **Cards**: white bg, subtle border, defined shadow, 10px radius, hover shadow transition
- **Badges**: pill-shaped (full radius), compact padding, 12px font
- **Buttons**: 8px radius, 14px font, medium weight; primary filled blue, secondary ghost/outline
- **Tables**: alternating row bg (white / light gray), 14px text, 48px row height
- **Tooltips**: dark bg, white text, 12px, 6px radius, max-width 280px

## 5. Data Formatting Utilities
- **Currency helper**: European format (€12.450,00), compact notation (€12,4K / €1,2M)
- **Percentage helper**: 1 decimal, green/red coloring with arrow-up/arrow-down icons
- **Date helper**: Spanish month abbreviations (Ene, Feb, Mar…)

## 6. Global State Components
- **Skeleton loading**: reusable skeleton patterns for cards and table rows with pulse animation
- **Error state**: red-tinted card with retry button, usable per-block
- **Empty state**: centered layout with illustration placeholder, descriptive text, and primary CTA
- **Restricted (RBAC)**: masked "—" values with lock icon and "Sin permisos" tooltip

## 7. Demo / Preview Page
- A design system showcase page at the index route displaying all tokens, components, and states together so you can visually verify the system before building screens

