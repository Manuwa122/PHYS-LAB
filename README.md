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


## Practical laboratory enrichment (November 2026)
- Study-guide panels for all 43 entries: aims, equipment checklist, educational procedure outlines, precautions, viva prompts and recommended graphs. Some methods are topic-wide and must be checked against the NIE handbook before performing the actual experiment.
- WebGL apparatus quality improvements for vernier callipers, micrometer screw gauge, simple pendulum, sonometer, prism and basic electrical circuits. Other scenes remain simplified procedural models, not real-equipment digital twins.
- Metal/wood/glass material styling, mobile-friendly 3D render settings, and front/side/top camera views. Camera angle persists while adjusting controls.
- Captured **simulated** readings can be charted as input vs predicted output. They are not real measurements and the plotted axes are generalized; consult each practical for the correct experimental graph.
- More detailed 3D equipment, exact sensor behavior, interactive assembly, lab calibration, and full Sinhala translations remain future work.

## Touch / mouse apparatus placement (November 2026)
- 3D lab includes **two movable apparatus-related items per practical scene**, each with a highlighted destination area. Pick up using a mouse or finger, move horizontally across the workbench, and release to snap into the designated zone. An on-screen instruction panel indicates whether both parts are correctly positioned.
- Switch between **Move equipment** and **Orbit camera**, or reset both pieces. The pick-and-place positions survive adjustments of existing numeric parameters.
- This feature is an **initial equipment-placement exercise**. It does **not** yet let students assemble and operate every component of all 43 real-world experiments, check wiring, model lens collisions, detect physical contact, or grade the experimental procedure. Progressively add distinct apparatus interactions and validated constraints by practical.

## Distinct apparatus scenes and category art direction
- All **43 NIE indexed practical entries** now choose a distinct 3D teaching composition, rather than reusing one generic object arrangement for unrelated experiments. Eight previously detailed scenes are retained; the other 35 have experiment-specific 3D geometry in `lab-unique-scenes.js`.
- Scene models cover apparatus types such as Hare's tube, U-tube, sonometer bridges, several resonance tube configurations, prism/spectrometer, combination lenses, thermal calorimeters and gas law setups, meter bridge/potentiometer, semiconductor characteristic setups, surface tension and Jaeger's method.
- Experiment category controls cinematic lighting accents (mechanics warm amber, optics aqua, thermal coral, electronics violet, etc.) and practical detail studio styling.
- This is an **art-directed educational 3D prototype**. It is *not* a set of authentic industrial/scanned GLB instrument models; physical operation, assemblies, and simulations are partial and simplified. Distinct appearance is not a promise of full experimental parity. A real expert quality check, WebGL browser-device testing, calibrated equipment assets, collision/contact handling and NIE procedure validation are still required.
