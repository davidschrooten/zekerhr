# ZekerHR Styling Guidelines: Organic Fluidity

## 1. Design Philosophy: Natural Flow
We employ an **Organic Fluidity** system. The aesthetic is inspired by high-end interior design and modern "Calm Tech" SaaS—prioritizing warmth, breathability, and the complete absence of harsh geometry.

-   **Softness:** Absolutely no hard lines or 1px borders. Every element uses large radii to feel tactile and "molded."
-   **Tonal Depth:** Hierarchy is established through "layering" warm tones (beige on cream) rather than lines or heavy shadows.
-   **Organic Palette:** A sophisticated mix of Light Beige, Earthy Brown, and Warm Grey creates a workspace that feels human and focused.

## 2. Core Tokens

### Typography (Geist Sans)
-   **Headings:** Medium (500). Avoid Bold to keep the interface feeling "light."
-   **Body:** Regular (400). Wide line-height (`leading-relaxed`) to prevent text density fatigue.
-   **Color:** Use **Deep Espresso** (`#2D2926`) instead of Black for text to maintain warmth.

### Colors: The Earth & Stone Palette
We use a "Warm-Scale" instead of Greyscale to create a more inviting, premium environment.

-   **Backgrounds:**
    -   *Base (The Canvas):* Light Beige / Cream (`#FDFBF7`).
    -   *Surface (The Cards):* Pure White (`#FFFFFF`) or Soft Sand (`#F5F2ED`).
-   **Foregrounds:**
    -   *Primary:* Deep Espresso (`#2D2926`) — high legibility, low harshness.
    -   *Secondary:* Muted Taupe (`#8C857E`).
    -   *Tertiary:* Soft Pebble (`#BDB7B0`).
-   **Accents:**
    -   *Primary Action:* Warm Cedar / Light Brown (`#8B735B`).
    -   *Hover/Selection:* Pale Wheat (`#F2EBE3`).

### Elevation & Radius
-   **Border Radius:** 
    -   *Large Containers/Cards:* `rounded-[32px]` (The "Super-ellipse" feel).
    -   *Buttons/Inputs:* `rounded-2xl` (16px) or `rounded-full`.
-   **Shadows:** 
    -   Use "Ambient Glow" shadows that match the background warmth. 
    -   Example: `shadow-[0_8px_30px_rgba(139,115,91,0.04)]` (A tiny hint of brown in the shadow).
-   **Borders:** **Forbidden.** Use color-blocking (e.g., a white card on a beige background) to define edges.

## 3. Component Guidelines

### Buttons
-   **Primary:** Warm Cedar (`#8B735B`) background with White or Cream text.
-   **Secondary:** Pale Wheat (`#F2EBE3`) background with Deep Espresso text.
-   **Shape:** Always `rounded-full` for a friendly, approachable feel.

### Cards & Layout
-   **The "Inset" Sidebar:** The sidebar should be a slightly darker shade (Light Beige `#F5F2ED`) than the main content area (Pure White `#FFFFFF`), creating a natural split without a line.
-   **Padding:** Extreme whitespace. Double the standard padding (e.g., use `p-12` for main headers).

### Inputs & Forms
-   **Appearance:** "Soft Wells." Use `bg-stone-100/50` or a very light beige wash.
-   **Focus:** Instead of a blue ring, use a soft `ring-4 ring-stone-200/50`.
-   **Labels:** Small, all-caps, with wide tracking (`tracking-[0.15em]`) in Muted Taupe.

### Tables & Data
-   **Rows:** No dividers. Use alternating background tints of Very Light Beige (`#FAF9F6`) only on hover.
-   **Cells:** Generous vertical padding (`py-6`).

## 4. Implementation Notes
-   **Tailwind Config:**
    -   Map `stone` or `zinc` to these warmer hex codes.
    -   Custom utility: `shadow-organic` for the soft, tinted shadows.
-   **Icons:** `Lucide React` with `stroke-width={1.25}`. Thin, elegant lines in Deep Espresso or Warm Cedar.