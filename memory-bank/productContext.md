# Product Context: Speak Check AI Lab

## Why this project exists
Language learning, specifically speaking, is often the most challenging part of English as a Foreign Language (EFL) for Indonesian students. Students often lack opportunities for practice and receive insufficient or inconsistent feedback. Teachers may not have the capacity to give personalized, real-time feedback to every student in a large class.

Speak Check AI Lab addresses these challenges by providing:
- A risk-free environment for speaking practice.
- Instant, research-based feedback that guides students toward correct language use.
- Gamified elements (XP, progress tracking) to maintain motivation.

## Problems it solves
1. **Lack of Practice Opportunities:** Students can practice anytime on their devices.
2. **Inconsistent Feedback:** The AI provides systematic feedback based on established SLA strategies.
3. **Fear of Making Mistakes:** Practicing with an AI coach (Alice) is less intimidating than speaking in front of a class.
4. **Teacher Overload:** Automates basic speaking drills and feedback, allowing teachers to focus on more complex instruction.

## How it should work
1. **Login:** Student enters their details (Name, Class, ID).
2. **Dashboard:** Student chooses a game mode (Grammar, Vocab, Pronunciation, or Noticing).
3. **Practice Session:**
    - AI Coach (Alice) presents a prompt or question.
    - Student responds by speaking (activated by clicking a microphone icon).
    - Web Speech API converts speech to text.
    - Feedback Engine analyzes the transcript against the target content.
4. **Feedback Loop:**
    - If correct: Alice gives positive reinforcement.
    - If errors detected: Alice provides one of 5 feedback types (Recast, Clarification Request, etc.) to help the student correct themselves.
5. **Results & XP:** Student earns XP based on their performance and completes the session.
6. **Data Sync:** All progress is logged to a Google Sheet for teacher review.

## User Experience Goals
- **Engaging & Friendly:** The UI uses a "Soft UI" (Neumorphism) aesthetic that is visually appealing and approachable.
- **Interactive:** Alice the avatar reacts with different moods (happy, thinking, encouraging) to create a sense of presence.
- **Clear & Simple:** Minimalist navigation and clear instructions to ensure students can use it independently.
- **Responsive Feedback:** Instant visual and auditory responses to speech input to keep the flow of the game.