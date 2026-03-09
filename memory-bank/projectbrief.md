# Project Brief: Speak Check AI Lab

## Overview
Speak Check AI Lab is a web-based English speaking practice application designed specifically for Indonesian junior high school students (SMP). It utilizes AI-powered feedback mechanisms based on Second Language Acquisition (SLA) research to provide meaningful corrections and guidance during speaking exercises.

## Core Goals
1. **Enhance Speaking Proficiency:** Provide a safe and interactive environment for students to practice English speaking.
2. **Implement SLA Feedback Strategies:** Use research-backed feedback types (Recast, Clarification Request, Explicit Correction, Metalinguistic Clue, Elicitation) to improve learning outcomes.
3. **Foster Noticing Hypothesis:** Help students notice the gap between their current interlanguage and the target language through "The Noticing Room" and other feedback mechanisms.
4. **Accessible Technology:** Leverage Web Speech API for speech-to-text and text-to-speech, ensuring broad accessibility via modern web browsers (Chrome/Edge).
5. **Lightweight Backend:** Use Google Sheets via Google Apps Script as a database for easy management and deployment.

## Scope
- **4 Practice Modes:**
    - Grammar Lab (Grammar practice)
    - Vocab Builder (Vocabulary expansion)
    - Pronunciation Clinic (Pronunciation focus)
    - The Noticing Room (Error identification and correction)
- **AI Coach (Alice):** An interactive avatar that provides feedback and motivation.
- **Progress Tracking:** Recording student performance and XP in a Google Spreadsheet.
- **Real-time Feedback Engine:** Automated analysis of student speech compared to target prompts.

## Success Criteria
- Students can successfully log in and access practice modes.
- Speech recognition accurately captures student input (within Web Speech API limitations).
- Feedback engine correctly identifies errors and applies appropriate SLA strategies.
- Progress is correctly logged to the Google Sheets backend.
- UI/UX is engaging and appropriate for SMP-aged students (using neumorphic design elements).