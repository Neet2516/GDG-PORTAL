# Design System Specification: High-End Event Registration

## 1. Overview & Creative North Star: "The Digital Curator"

This design system moves beyond the standard "form-on-white" layout to create an experience that feels curated, authoritative, and distinctly developer-centric. Inspired by the precision of Stripe and the functional minimalism of Linear, the Creative North Star is **"The Digital Curator."**

The system rejects the "template" look by utilizing intentional asymmetry, hyper-refined typography scales, and tonal depth. We treat the registration portal not as a series of inputs, but as a high-end editorial journey. By utilizing high-contrast accents against expansive, layered neutral surfaces, we communicate a sense of technical excellence and premium reliability.

---

## 2. Colors & Surface Philosophy

The color palette is rooted in a refined interpretation of brand-accurate blues and a sophisticated spectrum of grays.

### The "No-Line" Rule
Standard 1px borders are strictly prohibited for defining sections. Structure must be achieved through **background color shifts**. For instance, a registration form (using `surface_container_lowest`) should sit atop a page background of `surface`, creating a "natural" boundary through value contrast alone.

### Surface Hierarchy & Nesting
Treat the UI as a physical stack of premium materials. Use the `surface_container` tiers to define priority:
*   **Base Layer:** `surface` (#f9f9fc)
*   **Secondary Sectioning:** `surface_container_low` (#f3f3f6)
*   **Interactive Cards:** `surface_container_lowest` (#ffffff)
*   **Overlay/Modals:** `surface_bright` (#f9f9fc)

### The Glass & Gradient Rule
To achieve a "Vercel-like" depth, use **Glassmorphism** for floating navigation or sticky headers. Utilize semi-transparent versions of `surface` with a `backdrop-blur` of 12px–20px. 
**Signature Texture:** Main CTAs must use a linear gradient from `primary` (#0058bd) to `primary_container` (#2771df) at a 135-degree angle to provide "soul" and dimension that flat color cannot replicate.

---

## 3. Typography: Editorial Authority

We use a dual-font strategy to balance character with readability.

*   **Display & Headlines (Manrope):** Chosen for its geometric precision and modern "tech" feel. Use `display-lg` for hero registration headers to create an editorial impact.
*   **Body & Labels (Inter):** The industry standard for legibility. Use `body-md` for all form descriptions to ensure clarity for developers scanning technical details.

**The Contrast Rule:** Always pair a `headline-sm` in `on_surface` with a `label-md` in `on_surface_variant`. This creates a hierarchy of "Importance vs. Metadata" that guides the eye naturally through the registration flow.

---

## 4. Elevation & Depth

We move away from traditional "structural lines" in favor of **Tonal Layering**.

*   **The Layering Principle:** Depth is achieved by "stacking." A card using `surface_container_lowest` (#ffffff) should be placed on a section using `surface_container_low` (#f3f3f6). This creates a soft, natural lift without the "heaviness" of shadows.
*   **Ambient Shadows:** Where floating elements are required (e.g., dropdowns), use a shadow with a 40px blur and 4% opacity. The shadow color must be a tinted version of `on_surface` (deep navy/gray) rather than pure black.
*   **The "Ghost Border" Fallback:** If a boundary is required for accessibility, use the `outline_variant` token at **20% opacity**. 100% opaque borders are strictly forbidden.
*   **Glassmorphism:** Apply a 1px "inner glow" to glass containers using a semi-transparent `on_primary_container` to simulate the edge of a lens.

---

## 5. Components

### Buttons
*   **Primary:** High-contrast. Gradient background (`primary` to `primary_container`), `on_primary` text. `rounded-md` (0.75rem).
*   **Secondary:** `surface_container_high` background with `on_surface` text. No border.
*   **Tertiary:** Ghost style. No background; `on_primary_fixed_variant` text. High-visibility hover state using `surface_container`.

### Sleek Form Inputs
*   **The Layout:** Abandon the "box" feel. Use `surface_container_lowest` for the input background.
*   **Focus State:** Instead of a heavy border, use a 2px outer glow (ring) of `primary` at 30% opacity.
*   **Error State:** Use `error` (#ba1a1a) for the label text and `error_container` for a subtle 2px bottom-indicator line.

### Progress Stepper (The "Linear" Step)
*   Forgo the "circles and lines" trope. Use a horizontal bar divided by spacing `1` (0.25rem). 
*   **Active:** `primary`. **Inactive:** `surface_container_highest`. 
*   Include the `label-sm` above the bar in `on_surface_variant` for a minimal, dashboard-like aesthetic.

### Cards & Lists
*   **Prohibition:** No divider lines.
*   **Separation:** Use Spacing Scale `6` (1.5rem) or `8` (2rem) to separate list items. 
*   **Hover:** Transition the background from `surface` to `surface_container_low` to indicate interactivity.

### Additional Component: The "Code-Snippet" Chip
*   For developer portals, use a `surface_container_highest` chip with a mono-spaced font variant of `label-sm` to display event IDs or API hooks.

---

## 6. Do's and Don'ts

### Do
*   **Do** use asymmetrical white space to create a "premium" feel.
*   **Do** use `surface_container_low` for large background sections to make the white `surface_container_lowest` cards pop.
*   **Do** ensure all interactive elements have a clear `surface_variant` hover state.
*   **Do** prioritize typography scale over color to show hierarchy.

### Don't
*   **Don't** use 1px solid, high-contrast borders to separate content.
*   **Don't** use pure black (#000000) for shadows; use tinted neutrals.
*   **Don't** use "Default" rounded corners (0.5rem) for everything; use `xl` (1.5rem) for large containers and `md` (0.75rem) for internal components.
*   **Don't** crowd the interface. If in doubt, increase spacing by one tier on the scale.