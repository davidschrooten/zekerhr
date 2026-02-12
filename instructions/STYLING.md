# ZekerHR Styling Guidelines

## Core Aesthetic: "Vercel-like"
We aim for a design that is:
-   **Wide:** Utilize full screen width where appropriate, avoiding constrained narrow containers for dashboards.
-   **Simplistic:** Minimalist UI. Reduce noise. Use whitespace effectively.
-   **Functional:** Data-first. Clear typography. High contrast for readability.

## Design Tokens

### Typography
-   **Font:** Geist Sans (or Inter as fallback).
-   **Headings:** Bold, high contrast (foreground).
-   **Body:** Medium contrast (muted-foreground for secondary text).
-   **Monospace:** For data values like BSN, IBAN, IDs.

### Layout
-   **Sidebar:** Fixed width (e.g., 250px), distinct border-right.
-   **Main Content:** Flex-1, padding (e.g., p-6 or p-8).
-   **Cards:** Flat or subtle border (border-border), no massive drop shadows unless interactive.
-   **Grid:** Dense grids for metrics/cards.

### Components (Shadcn/UI Overrides)
-   **Buttons:** Sharp corners or small radius (rounded-md). Primary is black/white (high contrast).
-   **Inputs:** Minimal borders. Focus rings should be subtle.
-   **Tables:** Clean rows, minimal vertical dividers.

## Colors (Dark/Light Mode)
-   **Background:** Pure white (light) / Pure black or very dark gray (dark).
-   **Surface:** Subtle gray backgrounds for sidebars or card headers.
-   **Border:** Subtle (e.g., zinc-200 / zinc-800).
