# Spin The Wheel - WordIT Game Template

## 🎮 Overview
**Spin The Wheel** is a multiple-choice quiz game where questions are selected randomly via a "wheel spin" mechanic.
- **Creator** provides a list of questions (universal question bank).
- **Player** spins the wheel to get a random question, answers it, and earns points.
- **Goal**: Score as high as possible in 5 rounds.

## 🧱 Architecture
This module follows strict WordIT architecture:
- **GameTemplate Slug**: `spin-the-wheel`
- **Prefix Path**: `/api/game/game-type/spin-the-wheel` (via `game-list` router)
- **State**: Stateless. Progress is managed by FE or simple stateless endpoints.
- **Database**: Uses default `Games` and `Leaderboard` tables. No custom tables.

## 🛠️ Data Structure (`game_json`)
The `game_json` column in the `Games` table stores the configuration and question bank.

```json
{
  "totalRounds": 5,
  "questions": [
    {
      "question": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "answerIndex": 1
    },
    ...
  ]
}
```

## 🔌 API Endpoints

### Creator Mode
| Method | Endpoint | Description |
|os|os|os|
| **POST** | `/` | Create a new game instance. |
| **GET** | `/:game_id` | Get game details (creator view). |
| **PATCH** | `/:game_id` | Update game config/questions. |
| **DELETE** | `/:game_id` | Delete game instance. |

**Auth**: Required (Creator only).
**Body**: Uses `file_fields` for `thumbnail_image`.

### Player Mode
| Method | Endpoint | Description |
|os|os|os|
| **GET** | `/:game_id/play/public` | Get public game info (sanitized). |
| **GET** | `/:game_id/play/private` | Get full game info (creator only). |
| **POST** | `/:game_id/play/spin` | Spin logic: Returns 1 random question. |
| **POST** | `/:game_id/play/answer` | Validate answer. |
| **POST** | `/:game_id/play/finish` | Submit final score to Leaderboard. |
| **GET** | `/:game_id/leaderboard` | View top 20 scores. |

**Auth**:
- Public play: No auth required for `/spin` and `/answer`, Optional auth for `/finish` (guest vs user).
- Private play: Auth required.

## 🕹️ Gameplay Flow

1. **Start**: User requests `/play/public`. Backend returns game metadata + `totalRounds`.
2. **Round Loop (5x)**:
   - **Spin**: FE calls `/play/spin`. Backend returns a random question (without `answerIndex`).
   - **Answer**: User selects option. FE calls `/play/answer`. Backend verifies and returns `{ isCorrect: boolean, score: 20 }`.
3. **Finish**: FE calculates total score (or tracks locally). FE calls `/play/finish` with final score/time. Backend saves to `Leaderboard`.

## 🛡️ Validation
- **Schema**: Zod schemas in `schema/spin-the-wheel.schema.ts`.
- **Sanitization**: Public endpoints NEVER return `answerIndex`.
