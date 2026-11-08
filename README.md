# PHYS-LAB — Interactive Physics Academy

A responsive prototype physics learning platform with English/Sinhala navigation and interactive educational experiments.

## Features
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

