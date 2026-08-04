# Mr. Mendez Math — Fall 2026 local redesign

This repository contains the Fall 2026 version 2 public classroom hub. The GitHub remote is `mendez84/classwebsite-fall-2026-v2`; changes reach the public site after they are committed and pushed.

## Preview locally

From this folder, run:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## Weekly updates

Shared announcements and the public email live in `data/site.json`. Weekly assignments live in one file per course under `data/courses/`.

Each course week has:

- a unique `id`;
- a label and date range;
- a `current` or `archived` status;
- daily titles, summaries, and optional HTTPS assignment links.

Ask Codex or Claude to update these JSON files, then run:

```bash
node scripts/validate-content.mjs
```

Only one week per course may be marked `current`. Move the previous week to `archived` when publishing a new one.

## Privacy rules

Never add student names, student email addresses, grades, student work without permission, Google Classroom join codes, or private Classroom URLs. Public course pages may link to the general Google Classroom sign-in page.

## Translation workflow

Navigation and essential family information support English and Spanish. Spanish text in `script.js` is an AI-assisted draft and must be reviewed by Mr. Mendez before any public launch. Weekly assignment details remain in English.

## Current public information

- The homepage includes the official CCHS Wednesday late-start schedule for August 5, 2026 and links to the school schedule page.
- The Resources page includes the classroom CCHS phone/device policy and links to the district announcement. Keep the syllabus language aligned with the classroom policy.

## Before publishing

Confirm the real Fall 2026 dates for Financial Algebra and Integrated Math 1, replace all sample week content, review Spanish copy, verify every external link, test at phone/tablet/desktop sizes, and update canonical URLs if the deployment address changes.
