# PHYS-LAB — Interactive Physics Academy

A responsive prototype physics learning platform with English/Sinhala navigation and interactive educational experiments.

## A/L Physics Virtual Practical Laboratory\n- Dedicated `/practicals.html` page covering **42 numbered NIE experiments as 43 entries** (the 21.1 and 21.2 lens parts are separate).\n- **43 practical entries with Three.js/WebGL 3D apparatus-style scenes** (with a selectable 2D Canvas fallback), with adjustable parameters and calculated outputs.\n- **43 adjustable educational calculations**, with experiment-specific inputs and computed outputs.\n- Every entry includes a core relation, practical workflow, handwritten-reading worksheet, CSV export, and link to the [official NIE handbook](https://nie.lk/pdffiles/other/eALOM%20PysicsPracBook.pdf).\n- These are **procedurally assembled 3D schematic teaching models**, not photorealistic, calibrated replicas of the official apparatus or validated physics solvers. Different practical entries can share equipment families. Some numerical readouts use simplified ideal formulas. They cannot replace supervised lab work. Text translation is partial.\n- 3D lab supports orbit/zoom and view switching. The 3D equipment requires WebGL support and a capable browser; use 2D fallback otherwise.\n- The multi-page Vite build includes `index.html` and `practicals.html`.\n\n## Features
- Projectile motion (idealized trajectory), simple pendulum (small-angle formula), traveling waves
- Orbit *perspective visualization* (illustrative, not a physical N-body simulation or true WebGL 3D)
- Videos and papers sections with third-party resource links
- Five original sample MCQs
- Optional AI Physics Tutor (server-side Vercel function; API key required)

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

The local Vite development server does not execute the /api/tutor Vercel function. AI responses require Vercel deployment and correct environment settings.

## Deploy to Vercel
1. Import `Manuwa122/PHYS-LAB` from GitHub.
2. Framework: Vite. Build command: `npm run build`. Output directory: `dist`.
3. Set `OPENAI_API_KEY` as a **server-side** environment variable; optionally set `OPENAI_MODEL`. Do not commit API keys or expose them as VITE_*.
4. Deploy and test the site.

## Status and limitations
This is an initial prototype, not a production LMS. Sinhala translations cover primary navigation and some home-screen elements; exercise labels and other learning copy remain in English. The orbit is a pseudo-3D view, not a Three.js 3D simulation. Student accounts, permanent storage, admin uploads, private content, persistent grades, and video hosting are not implemented. Before publicly enabling the tutor, implement authentication, per-user quotas, rate limiting and safety checks to control AI spending.

