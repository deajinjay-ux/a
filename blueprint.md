# Avatar Studio - Premium Character Creator

## Overview
A sophisticated, web-based avatar creation tool designed for commercial use. It allows users to customize character attributes (skin, hair, clothing) and download the results as high-quality SVG or PNG files.

## Features
-   **Live Preview:** Real-time rendering of the avatar using SVG.
-   **Deep Customization:**
    -   Skin Tone (with radial gradients for depth)
    -   Hair Color (with volumetric shading)
    -   Clothing (Shirt/Pants/Shoes)
-   **Smart Shading:** Automatically calculates highlights and shadows based on the selected base color to maintain a 3D effect.
-   **Export:**
    -   Download as scalable SVG.
    -   Download as high-resolution PNG.
-   **Design:**
    -   Premium "Dark/Light" aesthetic (currently high-end light mode).
    -   Responsive split-screen layout.
    -   Glassmorphism-inspired UI panels.

## Tech Stack
-   **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+).
-   **Graphics:** Inline SVG with `defs` for gradients and filters.
-   **Deployment:** GitHub Pages (via GitHub Actions).

## Project Structure
-   `index.html`: Main application structure and SVG asset.
-   `style.css`: Styling for the layout, controls, and canvas.
-   `main.js`: Application logic for color manipulation and file export.
