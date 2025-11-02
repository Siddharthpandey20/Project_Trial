# AI Study Guide & Learning Mentor

An AI-powered study guide chatbot with personalized learning roadmaps and progress tracking, built with FastAPI and Google's Gemini AI.

# AI Study Guide & Learning Mentor

An AI-powered study guide chatbot with personalized learning roadmaps and progress tracking, built with FastAPI and Google's Gemini AI.

## ✨ New Features Added!

### 🌟 Hero/Landing Page
- Beautiful animated welcome screen
- Feature showcase with smooth animations
- "Get Started" button to begin your journey

### ⏰ Enhanced Pomodoro Timer
- **Customizable durations** (work, short break, long break)
- **Auto-switching** between work and break sessions  
- **Session tracking** - counts completed sessions today
- **Total time tracking** - shows total study time for the day
- **Timer settings modal** - Configure all timer preferences
- **Audio notifications** - Optional sound when timer completes

### 🎯 Daily Goals Tracker  
- **Add custom goals** with estimated time
- **Visual progress ring** showing completion percentage
- **Check off goals** as you complete them
- **Delete goals** you no longer need
- **Celebration** when all goals are completed!
- **Auto-save** - goals persist in browser storage

### ⌨️ Keyboard Shortcuts
- `Ctrl + K` - Focus chat input
- `Ctrl + T` - Start/pause timer
- `Ctrl + M` - Toggle Focus/Friendly mode
- `Ctrl + G` - Add new goal

### ⚙️ Settings Panel
- Theme persistence (remember your mode)
- Timer configuration
- Data export (download as JSON)
- Clear all data option
- Keyboard shortcuts reference

## Features

- 🤖 **AI Chat Assistant**: Get study advice and learning guidance
- 🗺️ **Personalized Roadmaps**: Generate custom learning paths based on your goals
- 📊 **Progress Tracking**: Monitor your learning journey with visual dashboards
- ⏱️ **Pomodoro Timer**: Built-in study timer for focused sessions
- 🌙 **Focus Mode**: Dark, minimal interface for concentration
- ☀️ **Friendly Mode**: Warm, encouraging interface with celebrations
- 📚 **Study Techniques**: Learn effective learning methods

## Requirements

- Python 3.8 or higher
- Google Gemini API key

## Installation

1. **Clone or download the repository**

2. **Install dependencies**:
```powershell
pip install -r requirements.txt
```

3. **Set up your Gemini API key**:
   - Option 1: Create a `.env` file in the project root:
     ```
     GEMINI_API_KEY=your_actual_api_key_here
     ```
   - Option 2: Set as environment variable in PowerShell:
     ```powershell
     $env:GEMINI_API_KEY="your_actual_api_key_here"
     ```

   To get a Gemini API key:
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Create a new API key

## Running the Application

1. **Start the server**:
```powershell
python main.py
```

Or use uvicorn directly:
```powershell
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

2. **Open your browser**:
   - Navigate to: `http://localhost:8000`
   - The API documentation is available at: `http://localhost:8000/docs`

## Project Structure

```
Taru/
├── main.py              # FastAPI backend application
├── requirements.txt     # Python dependencies
├── .env                # Environment variables (create this)
├── .env.example        # Environment variables template
├── README.md           # This file
└── static/
    ├── index.html      # Frontend HTML
    ├── app.js          # Frontend JavaScript
    └── style.css       # Frontend styles
```

## Usage

1. **Choose Your Mode**: Select between Focus Mode (dark, minimal) or Friendly Mode (bright, encouraging)

2. **Chat with AI**: Ask questions about learning, get study advice, or request a personalized roadmap

3. **Generate Roadmap**: Click "Generate Learning Roadmap" and fill in:
   - Learning goal
   - Time commitment
   - Skill level
   - Preferred learning styles
   - Optional deadline

4. **Track Progress**: View your learning progress, complete tasks, and track study sessions

## API Endpoints

- `GET /` - Main application
- `POST /api/chat` - Chat with AI assistant
- `POST /api/roadmap/generate` - Generate learning roadmap
- `GET /api/roadmap/{roadmap_id}` - Get specific roadmap
- `POST /api/roadmap/{roadmap_id}/select` - Select a track
- `GET /api/progress/{roadmap_id}` - Get progress
- `POST /api/progress/update` - Update progress
- `POST /api/progress/{roadmap_id}/adjust` - Adjust goals
- `GET /api/study-techniques` - Get study techniques
- `GET /api/motivation/daily` - Get daily motivation

## Technologies Used

- **Backend**: FastAPI, Python
- **AI**: Google Gemini 1.5 Flash
- **Frontend**: Vanilla JavaScript, HTML5, CSS3
- **Charts**: Chart.js
- **Markdown**: Marked.js

## Notes

- This uses in-memory storage - data will be lost when the server restarts
- For production, implement proper database storage
- Add user authentication for multi-user support
- The API key in the code is a placeholder - replace with your own

## License

MIT License - feel free to use and modify as needed!

## Support

For issues or questions, please create an issue in the repository.
