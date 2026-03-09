# Progress: Speak Check AI Lab

## What Works
- [x] Project Scaffolding (Next.js, TypeScript, Tailwind)
- [x] Type Definitions
- [x] Neumorphic UI Design Tokens
- [x] Core Game Logic (useGame hook)
- [x] Speech Recognition Integration (useSpeech hook)
- [x] Text-to-Speech Integration (useTTS hook)
- [x] API Client for Google Apps Script
- [x] Login Screen UI (Renamed to Speak Check AI Lab)
- [x] Registration System with ID uniqueness check
- [x] Dashboard UI
- [x] Game Screen UI
- [x] Alice Avatar UI & State Management
- [x] Feedback Strategy Matrix Implementation

## What's Left to Build
- [ ] Backend Validation: Confirm end-to-end data flow with Google Sheets.
- [ ] Noticing Room Specialized UI: Refine the specialized interaction for "The Noticing Room".
- [ ] Result Screen Enhancements: More detailed performance breakdown.
- [ ] Error Handling: Robust handling of network errors and browser compatibility issues.
- [ ] Instructions/Tutorial: Simple guide for students within the app.

## Current Status
The application is in a "Feature Ready" state, awaiting integration testing with the Google Apps Script backend.

## Known Issues
- **Firefox Compatibility:** Speech recognition will not work in Firefox as it doesn't support the standard Web Speech API STT.
- **Microphone Sensitivity:** Ambient noise can lead to poor recognition confidence.
- **Local Development Environment:** Requires `.env.local` to be manually set up with a valid GAS URL to function correctly.

## Evolution of Project Decisions
- **Initial Design:** Switched from a flat design to Neumorphism for a more interactive and "playful" feel for younger students.
- **Backend Selection:** Opted for Google Sheets/GAS over traditional databases (like SQL or Firebase) to simplify maintenance for educators without deep technical backgrounds.
- **Web Speech API Choice:** Chose Web Speech API over cloud-based STT (like Google Cloud Speech-to-Text) to eliminate per-request costs and provide lower latency for a better game-like experience.
- **Title Change:** Renamed the application from SpeakCheck to "Speak Check AI Lab" for better clarity and branding.