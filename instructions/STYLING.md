# ZekerHR Styling Guidelines

## 1. Design Philosophy: The Geist System
We adhere to the **Geist Design System** principles, pioneered by Vercel. Our aesthetic is defined by:

-   **Precision:** Every pixel matters. Alignments must be exact.
-   **Minimalism:** Remove unnecessary decoration. Content is king.
-   **Speed:** The UI should look and feel fast. Avoid heavy animations or layout shifts.
-   **Functionality:** Aesthetic choices should serve a functional purpose (e.g., color indicates state, not decoration).

## 2. Core Tokens

### Typography (Geist)
We use the **Geist** font family exclusively, with Inter as a fallback for older systems.

-   **Geist Sans:** Primary font for all UI text, headings, and body.
    -   *Headings:* Bold (700) or ExtraBold (800). Tracking tight (`-0.02em` or `tracking-tight`).
    -   *Body:* Regular (400) or Medium (500). High contrast for readability.
    -   *Secondary:* Muted foreground for supporting text.
-   **Geist Mono:** For code blocks, data values, IDs, BSNs, IBANs, and financial figures.
    -   *Usage:* Use `font-mono` for any data that requires precise character alignment or technical context.

### Colors & Contrast
We maintain a **High Contrast** theme to ensure accessibility and clarity.

-   **Backgrounds:**
    -   *Light Mode:* Pure White (`#FFFFFF`).
    -   *Dark Mode:* Pure Black (`#000000`) or extremely dark gray (`#0A0A0A` for surfaces).
-   **Foregrounds:**
    -   *Primary:* Absolute Black (`#000`) on Light / Absolute White (`#FFF`) on Dark.
    -   *Secondary:* Gray-500 to Gray-700. Avoid low-contrast gray-on-gray.
-   **Borders:**
    -   Subtle but distinct. `border-gray-200` (Light) / `border-gray-800` (Dark).
-   **Accents:**
    -   Use colors (Blue, Red, Amber) *only* for semantic meaning (Actions, Errors, Warnings). Never for decoration.

### Layout & Grid
The **Grid** is the foundation of the Vercel aesthetic.

-   **Density:** Interfaces should be information-dense but not cluttered.
-   **Whitespace:** Use consistent spacing scales (multiples of 4px).
-   **Containers:**
    -   *Dashboard:* Wide, often full-width or `max-w-[1600px]`.
    -   *Documents/Forms:* Constrained for readability (`max-w-2xl`).
-   **Structure:**
    -   **Sidebar:** Fixed width (250px-280px), distinct border, consistent navigation.
    -   **Header:** Minimal height, sticky, distinct border-bottom.
    -   **Cards:** Flat designs. Use borders (`border`) instead of shadows (`shadow-sm` at most). Hover states can lift slightly.

## 3. Component Guidelines (Shadcn/UI Overrides)

### Buttons
-   **Radius:** `rounded-md` (6px) or `rounded-sm` (4px). Avoid full pills unless for specific tags.
-   **Primary:** Black background, White text (Light mode inverse). No gradients.
-   **Secondary:** White background, Black border, Black text.
-   **Ghost:** Transparent background, subtle hover effect.

### Inputs & Forms
-   **Borders:** Minimal, consistent width (1px).
-   **Focus:** Distinct focus rings (offset 2px).
-   **Labels:** `text-sm`, `font-medium`, `text-muted-foreground`.

### Tables (Data Density)
-   **Headers:** `text-xs`, `uppercase`, `text-muted-foreground`, `tracking-wider`.
-   **Rows:** `h-10` or `h-12` (Compact).
-   **Dividers:** Horizontal borders only. Avoid vertical borders in simple tables.
-   **Zebra Striping:** Avoid. Use hover states for row tracking.

## 4. Implementation Notes
-   **Tailwind:** Use `bg-background`, `text-foreground`, `border-border` aliases derived from the CSS variables.
-   **Icons:** Use `Lucide React` with stroke width `1.5px` or `2px` for consistency with Geist icons.