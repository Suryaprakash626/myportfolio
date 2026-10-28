# Suryaprakash B — Three.js Portfolio

A dark, editorial creative-developer portfolio built with React, TypeScript, Vite and **Three.js directly**. The 3D experiences use actual WebGL rendering, custom shader materials, procedural geometry, points, lighting, raycasting and interactive pointer response. No React Three Fiber, Drei, Spline or Babylon.js.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- A modern browser with WebGL support

## Run locally (Windows PowerShell)

```powershell
# 1. Extract the ZIP and open this folder in VS Code
cd suryaprakash-threejs-portfolio

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To create a production build:

```powershell
npm run build
npm run preview
```

## Main features

- Full-screen interactive Three.js hero scene with a procedural shader sculpture, torus-knot geometry, orbit rings and particle field.
- Pointer-responsive camera and geometry, raycasting hover response and scroll-aware hero camera movement.
- Three live experiments: procedural geometry, GLSL shader material and particle field.
- Project showcases for EstateScope 3D, SpaceFit 3D and Zero-Knowledge File Share.
- Responsive layout, reduced-motion styling, WebGL fallback and visibility-aware rendering.
- Resume download from `public/Suryaprakash-Resume.docx`.

## Project structure

```text
src/
  components/
    ProjectCard.tsx
    ThreeExperience.tsx
  data/
    portfolio.ts
  App.tsx
  main.tsx
  styles.css
public/
  Suryaprakash-Resume.docx
index.html
vite.config.ts
package.json
```

## Personalise it

- Edit contact links, skill labels and project details in `src/data/portfolio.ts`.
- Replace the resume in `public/` when you have an updated version.
- The 3D scene is in `src/components/ThreeExperience.tsx`.
- Main page sections and copy are in `src/App.tsx`.

## Notes

- The project is supplied as source code. The npm dependencies could not be installed in the creation environment because registry access was restricted, so the app has **not been compiled or browser-tested here**.
- Run `npm install` and `npm run build` locally. Share the complete terminal output if you hit an error.
- The hero scene is generated procedurally and does not need external 3D model files or texture downloads.
- The portfolio describes Three.js/WebGL as the user's current focus; it does not claim years of professional Three.js or event-design experience.
