# NT — product and source audit

Audit date: 2026-09-11. Scope: all source modules, routing, persistence, lesson generators, exam data, CSS and browser tests. This document distinguishes a usable local learning application from a validated one-to-two-year English curriculum.

## Existing features

React/Vite, HashRouter, shared Context, localStorage migration, four language roadmaps, unrestricted levels, eight-step lessons, browser speech APIs, flashcards, placement/practice tests, bookmarks, mistake notebook, search, settings and responsive light/dark themes. The preceding extension added standalone vocabulary and TOEIC/IELTS practice.

## Findings before remediation

| Priority | Evidence | Learning/product impact |
| --- | --- | --- |
| P0 | tests/data.mjs imports new data twice | Required test command fails before validating data. |
| P1 | Lesson.jsx persisted only the step | Refresh loses answers, checks and writing. |
| P1 | Lesson.jsx awards Vocabulary 100, skipped Grammar 60; wrong answers receive partial credit | Progress cannot indicate actual mastery. |
| P1 | Review.jsx checkboxes award 15–30 minutes; Dashboard.jsx prechecks goals | Apparent activity without recall or practice. |
| P1 | Vocabulary SRS marks Easy mastered immediately, excludes overdue mastered words, truncates history to 90 events | Incorrect scheduling and misleading 90-day charts. |
| P1 | courses.js rotates a nine-word pool and copies one reading per level | 126 legacy lesson rows are not 126 distinct complete lessons. C1/C2 readings were about 55/65 words. |
| P1 | standalone vocabulary has 51 entries: A1 0, A2 8, B1 28, B2 15, C1 0, C2 0 | No beginner or advanced independent vocabulary coverage. |
| P1 | TOEIC Part 1 has no picture; IELTS Task 1 has no graph/map | Tasks cannot be answered from the promised source material. |
| P1 | IELTS writing length and punctuation produce a grammar band | Repeated irrelevant words can obtain a misleading score. |
| P1 | Exam attempts and writing drafts are component-local; timer callbacks can capture old answers | Lost work, inaccurate expired-test submission. |
| P1 | Bookmarks/search/exam mistakes link to only /toeic, /ielts or /vocabulary | Learner cannot return to the referenced question or word. |
| P1 | UTC dates, activity arrays without dates, no activity from non-lesson practice | Incorrect streaks/day totals and weak-skill summaries. |
| P2 | No independent Grammar, Pronunciation, Dictation, Shadowing or Advanced usage practice | Insufficient deliberate practice beyond course progression. |
| P2 | Several disabled filters and hidden desktop access to Saved/Mistakes/Settings | Controls imply unsupported capability; features hard to discover. |
| P2 | Broad Context, long inline JSX, duplicated quiz/audio logic, latest package ranges | Higher regression risk and difficult future content/API integration. |

## Professional-learning benchmark

CEFR describes contextual capabilities, not a count of completed pages. The Council of Europe includes interaction, mediation and phonological control; C1/C2 require precision, inference, register and discourse control. Reference: https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors . British Council organizes reading and skill practice by level and task: https://learnenglish.britishcouncil.org/free-resources/reading . These inform the curriculum architecture; they do not certify the app's authored content or local scores.

## Implementation approach

Preserve existing routes and legacy progress. Label original generated exercises as legacy practice; add distinct authored lessons, explicit published/planned curriculum positions and per-level vocabulary modules. Implement observed-activity statistics, stable question identities, resumable sessions, real recall in Review, shared scheduling and answer utilities. Add working grammar and sound/usage practice rather than empty navigation entries.

## Still needed for a complete long-term product

1. Editorially author and independently review the planned curriculum and 3,200-word target; enforce licensing and provenance.
2. Calibrate CEFR placement, checkpoints and exam estimates with real learner results; do not infer certified proficiency from a short demo test.
3. Add licensed human recordings with multiple accents, natural conversations and accessible captions.
4. Provide teacher/qualified feedback for free speaking and writing, or integrate a transparent evaluated assessment service.
5. Add accounts, server persistence, multi-device conflict handling and offline content delivery.
6. Run accessibility and longitudinal learning studies; test retrieval retention and lesson completion, not just clicks.
7. Expand authentic scenario, professional and C2 materials, with source-based interpretation, nuance and extended production.
8. Introduce a content authoring/review workflow and spaced review analytics before calling this a production curriculum.

Actual delivered counts and test results are recorded in the handoff and content manifest; planned content must not be reported as published.

