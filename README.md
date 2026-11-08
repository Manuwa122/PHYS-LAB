# PHYS·LAB — Interactive Physics Academy

Responsive bilingual (English/Sinhala) starter for a Physics learning platform. The interactive projectile, pendulum and wave labs are implemented with Canvas; the 3D orbit uses Three.js. Includes curated external videos, official paper portals, a sample MCQ quiz, and an optional AI tutor endpoint.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Visit the URL printed by Vite. **The `/api/tutor` endpoint runs on Vercel, not Vite's development server.** The rest of the application works locally.

## Deploy to Vercel

1. Create a GitHub repository and push this folder's contents to it.
2. Import the repository in Vercel. Framework preset: Vite. Build: `npm run build`; output: `dist`.
3. To activate actual AI answers, set `OPENAI_API_KEY` in Vercel Environment Variables, optionally `OPENAI_MODEL`, then redeploy. Never put secret keys in frontend files or GitHub.
4. For production, add authentication, persistent content database, rate limiting, per-user quotas, and moderation for the tutor endpoint.

## Important limitations

- This is an initial working prototype, not a production-ready LMS.
- Sinhala translation currently covers main navigation and marketing copy, not every simulation label and quiz item.
- The video section links to third-party learning libraries/search pages, without hosting or claiming ownership.
- The papers section links to government educational portals; it does not contain copyrighted exam PDF downloads.
- 3D requires internet access to load Three.js from a CDN.
- The orbit visualization is a kinematic illustrative orbit, not a gravitational dynamics solver.
- No student sign-in, storage, content management, uploaded video hosting or learner score persistence yet.