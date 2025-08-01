# 🔗 Word Train Game

A fun and challenging word chain game built with React, TypeScript, and powered by Google Gemini AI. Create chains of words where each word must start with the last letter of the previous word!

## 🎮 How to Play

1. **Start the Game**: Click "Start New Game" to begin
2. **Word Chain**: Each word must start with the last letter of the previous word
3. **Time Limit**: You have 10 seconds to enter your word
4. **Win Condition**: First player (you or computer) to fail loses the round
5. **AI Opponent**: The computer uses Google Gemini AI to generate challenging words

## 🚀 Features

- **Real-time Gameplay**: Fast-paced word chain challenges
- **AI Opponent**: Powered by Google Gemini AI for intelligent word generation
- **Score Tracking**: Persistent score tracking with localStorage
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Modern UI**: Beautiful, animated interface with dark/light mode support
- **Word Validation**: Real-time word validation and feedback
- **Timer System**: Visual countdown timer with animations

## 🛠️ Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd my-word-train
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Copy `.env.example` to `.env` (if exists) or create a `.env` file
   - Get your Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Add your API key to `.env`:
     ```
     VITE_GEMINI_API_KEY=your-actual-api-key-here
     ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── App/            # Main app component
│   ├── GameBoard/      # Game orchestration
│   ├── WordDisplay/    # Word chain display
│   ├── UserInput/      # Player input component
│   ├── Timer/          # Countdown timer
│   ├── GameStatus/     # Game state display
│   ├── ScoreBoard/     # Score tracking
│   └── GameControls/   # Game control buttons
├── hooks/              # Custom React hooks
│   ├── useTimer.ts     # Timer logic
│   ├── useGameState.ts # Game state management
│   ├── useLocalStorage.ts # Persistent storage
│   └── useWordValidation.ts # Word validation
├── services/           # Business logic
│   ├── geminiApi.ts    # AI word generation
│   ├── gameLogic.ts    # Core game rules
│   └── wordValidation.ts # Word validation
├── types/              # TypeScript definitions
├── utils/              # Helper functions
└── styles/             # Global styles and themes
```

## 🎨 Architecture Highlights

- **Component-Based**: Modular React components with single responsibilities
- **Custom Hooks**: Reusable logic for timer, game state, and validation
- **Service Layer**: Separated business logic from UI components
- **Type Safety**: Full TypeScript implementation
- **Responsive Design**: Mobile-first CSS with modern layout techniques
- **Performance**: Optimized with React best practices

## 🔧 Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **CSS3** - Styling with custom properties
- **Google Gemini AI** - AI word generation
- **ESLint** - Code linting

## 🎯 Game Rules

1. The game starts with a random word
2. Players alternate turns (Human vs Computer)
3. Each new word must start with the last letter of the previous word
4. Words must be valid English words (2-20 characters)
5. No word can be repeated in the same game
6. Players have 10 seconds to submit their word
7. First to fail (invalid word, timeout, or repetition) loses the round

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🎉 Enjoy Playing!

Have fun creating word chains and challenging the AI! The game gets more interesting as you discover creative word combinations and try to outsmart the computer opponent.
