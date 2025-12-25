# 3DBotics® Website Design Guidelines

## Design Approach
**2026 Futuristic Aesthetic** - Modern, tech-forward interface with glassmorphism effects and precise brand color implementation.

## Brand Assets & Colors

### Logo Usage
- **Source**: `assets/logo.png` - Never recreate or alter
- **Placement**: Top-left of navigation bar
- **Aspect Ratio**: Must maintain original proportions at all sizes
- **Responsive Scaling**: Scale proportionally, never stretch

### Color Palette (Extract exact hex codes from logo)
- **Teal** (from logo) - Franchisee Login buttons and accents
- **Red** (from logo) - Student Login buttons and accents  
- **Lime Green** (from logo) - Card borders, primary highlights
- **Space Black** (`#0a0a0a` or darker) - Primary background

## Layout Architecture

### Navigation
- **Type**: Sleek top bar, fixed position
- **Left**: 3DBotics® logo
- **Right**: Navigation links in white/light gray
- **Background**: Semi-transparent with backdrop blur (glassmorphism)
- **Height**: 80px desktop, 64px mobile

### Home Page Structure (One-Page Layout)
Modernize content from 3dbotics.ph in this vertical flow:

1. **Hero Section**
   - Full viewport height with Space Black background
   - Large headline introducing 3DBotics®
   - Subtle grid pattern or geometric elements
   - Primary CTA with Lime Green accent

2. **About/Mission Section**
   - Glassmorphism card with Lime Green border (`border-2`)
   - White text on semi-transparent dark background
   - Backdrop blur effect

3. **Services/Programs Section**
   - Grid of glassmorphism cards (2-3 columns desktop, 1 mobile)
   - Each card: Lime Green border, icon/visual, title, description
   - Consistent padding: `p-8` desktop, `p-6` mobile

4. **TechDojo Portal Section**
   - Prominent heading with Lime Green accent
   - Two login portals side-by-side (stack on mobile):
     - **Student Login**: Red background/border, white text
     - **Franchisee Login**: Teal background/border, white text
   - Large, clear call-to-action buttons

5. **Testimonials/Impact Section**
   - Glassmorphism cards with Lime Green borders
   - 2-column grid desktop, single column mobile

6. **Contact/Footer Section**
   - Contact information in glassmorphism card
   - Social links with brand color hover states
   - Copyright and legal text

## Typography System
- **Headings**: Sans-serif, bold weights (700-800)
  - H1: `text-5xl md:text-7xl`
  - H2: `text-4xl md:text-5xl`
  - H3: `text-2xl md:text-3xl`
- **Body**: Sans-serif, regular weight (400)
  - Base: `text-base md:text-lg`
- **Color**: White/off-white for primary text, Lime Green for highlights

## Spacing System
Use Tailwind units: **4, 6, 8, 12, 16, 20** for consistent rhythm
- Section padding: `py-16 md:py-24`
- Card padding: `p-6 md:p-8`
- Element gaps: `gap-6 md:gap-8`

## Component Library

### Glassmorphism Cards
- **Background**: `bg-white/5` or `bg-black/20`
- **Backdrop Filter**: `backdrop-blur-lg`
- **Border**: `border-2 border-[lime-green-hex]`
- **Border Radius**: `rounded-xl` or `rounded-2xl`
- **Shadow**: Subtle glow effect using Lime Green

### Buttons
- **Primary**: Lime Green background, Space Black text, rounded corners
- **Student Login**: Red background, white text
- **Franchisee Login**: Teal background, white text
- **Padding**: `px-8 py-4`
- **Font**: Bold, uppercase letter-spacing

### AI Chatbot
- **Position**: Fixed bottom-right corner
- **Avatar**: Robot face extracted from logo
- **Size**: 60px circle desktop, 50px mobile
- **Background**: Glassmorphism with Lime Green border
- **Interaction**: Click to expand chat interface
- **Offset**: `bottom-8 right-8`

## Responsive Breakpoints
- **Mobile**: < 768px (single column, stacked elements)
- **Tablet**: 768px - 1024px (2-column grids)
- **Desktop**: > 1024px (full multi-column layouts)

## Visual Effects
- **Glassmorphism**: Applied to all major content cards
- **Subtle Animations**: Minimal, only on hover states and page load
- **Grid Overlays**: Faint geometric patterns in background
- **Glow Effects**: Lime Green subtle glows on interactive elements

## Images
**No large hero background image required** - rely on geometric patterns and Space Black background for futuristic aesthetic. Logo is the primary visual brand element.