# Active Context: Speak Check AI Lab

## Current Work Focus
The project is in its initial setup phase. The core logic and UI components have been scaffolded according to the `README.md`.

## Recent Changes
- Initial project structure created (Next.js, TypeScript).
- Core UI components (`Dashboard`, `GameScreen`, `AliceAvatar`, `Login`, etc.) implemented.
- Custom hooks for game logic (`useGame`), speech recognition (`useSpeech`), and TTS (`useTTS`) developed.
- API utility for Google Apps Script integration (`api.ts`) created.
- Type definitions established (`types/speakcheck/index.ts`).
- Memory Bank initialization.
- Added explicit registration system with ID uniqueness check.
- Renamed application to "Speak Check AI Lab".

## Next Steps
1. **Verify Backend Integration:** Ensure `.env.local` is correctly configured and the Google Apps Script backend is responding as expected.
2. **Test Game Modes:** Manually test Grammar, Vocab, and Pronunciation modes to ensure the feedback engine works correctly.
3. **Refine Alice's Feedback:** Review and improve the feedback messages to be more age-appropriate and encouraging for SMP students.
4. **Implement Noticing Room Logic:** Ensure the specialized logic for error identification and correction in the Noticing Room is fully functional.
5. **Cross-Browser Testing:** Confirm performance and behavior in Chrome and Edge.

## Active Decisions and Considerations
- **Threshold for Success:** Current threshold for a "Pass" is 0.85 confidence/accuracy. This may need adjustment after pilot testing with actual students.
- **Feedback Strategy Logic:** The feedback strategy is determined based on attempt count, error type, and confidence. This logic is primarily in `useGame.ts`.
- **Language Selection:** Defaulting to 'en-US' or 'en-GB' for speech recognition. Needs consideration if student accent affects accuracy significantly.
- **Data Privacy:** Currently logging student ID and performance. Need to ensure minimal PII is stored in the Google Spreadsheet.

## Important Patterns and Preferences
- Use neumorphic design elements for consistency.
- Maintain Alice the AI Coach as the central interactive character.
- Keep components small and focused.
- Strong type safety across the application.