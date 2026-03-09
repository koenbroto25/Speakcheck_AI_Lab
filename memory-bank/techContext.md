# Tech Context: Speak Check AI Lab

## Technologies Used
- **Frontend:** Next.js 15+ (React 19), TypeScript, Tailwind CSS
- **Styling:** Tailwind CSS with custom neumorphic design tokens
- **Backend/DB:** Google Apps Script (GAS) acting as an API to Google Sheets
- **Speech-to-Text (STT):** Web Speech API (`window.webkitSpeechRecognition` or `window.SpeechRecognition`)
- **Text-to-Speech (TTS):** Web Speech API (`window.speechSynthesis`)
- **Icons/Avatars:** Alice avatar (SVG/image based)

## Development Setup
1. **Node.js:** version 18+
2. **Environment Variables:**
   - `NEXT_PUBLIC_GAS_API_URL`: The URL of the deployed Google Apps Script.
3. **Backend Setup:**
   - A Google Spreadsheet with three sheets: `Content_Bank`, `Students`, `Progress_Log`.
   - The Google Apps Script (`code.gs`) deployed as a web app.

## Technical Constraints
- **Browser Support:** Speech recognition is only fully supported in Chrome and Edge. Firefox does not support STT via Web Speech API.
- **Microphone Access:** Secure context (HTTPS) or localhost is required for microphone access.
- **Accuracy:** STT accuracy can vary based on microphone quality, background noise, and pronunciation clarity.
- **API Limits:** Google Apps Script has quotas for executions and spreadsheet operations, though likely sufficient for this scale.

## Dependencies (from package.json)
- `next` (^15.1.0)
- `react` (^19.0.0)
- `react-dom` (^19.0.0)
- `tailwind-merge` (^3.3.1)
- `clsx` (^2.1.1)
- `@types/node`, `@types/react`, `@types/react-dom` (^19/20)
- `tailwindcss`, `autoprefixer`, `postcss`

## Tool Usage Patterns
- **Next.js:** App Router for file-based routing and API routes.
- **TypeScript:** Strong typing for game content, student data, and API responses.
- **Git:** Version control (implied from structure).
- **Vercel:** Preferred deployment platform.