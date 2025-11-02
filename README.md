# 🎓 AI Study Guide & Learning Mentor

> **An intelligent, personalized learning companion powered by Google's Gemini AI**

![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)
![Status](https://img.shields.io/badge/Status-Active-success.svg)

An AI-powered study companion that revolutionizes how students learn by providing personalized roadmaps, real-time AI tutoring, and comprehensive progress tracking. Built with modern web technologies and powered by Google's Gemini AI.

---

## 🌟 What Makes This Project Unique?

### 1. **Dual-Mode Interface**
Unlike traditional learning platforms, this project offers two distinct modes tailored to different learning preferences:
- **🌙 Focus Mode**: Minimalist dark interface designed for deep concentration and distraction-free studying
- **☀️ Friendly Mode**: Warm, encouraging interface with celebrations and motivational elements

### 2. **AI-Powered Personalization**
Leverages Google's Gemini 2.5 Flash model to provide:
- Contextual, intelligent responses based on conversation history
- Adaptive learning recommendations
- Dynamic roadmap generation based on individual skill levels and time commitments

### 3. **Comprehensive Learning Ecosystem**
Not just a chatbot - it's a complete study companion featuring:
- Smart Pomodoro timer with customizable sessions
- Daily goal tracking with visual progress indicators
- Study technique library with practical tips
- Progress dashboard with interactive charts
- Session time logging and streak tracking

### 4. **Modern, Responsive Design**
- Beautiful gradient animations and smooth transitions
- Fully responsive layout (mobile, tablet, desktop)
- Accessibility-focused with ARIA labels
- Keyboard shortcuts for power users

### 5. **Developer-Friendly Architecture**
- Clean, modular code structure
- Comprehensive inline documentation
- RESTful API design
- Easy customization with CSS variables
- No database setup required (uses in-memory storage)

---

## ✨ Features Overview

### � Hero/Landing Page
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

### 🤖 Core Features

| Feature | Description | Benefit |
|---------|-------------|---------|
| **AI Chat Assistant** | Context-aware conversations using Gemini AI | Get instant, intelligent study advice |
| **Custom Roadmaps** | Generate 3 tailored learning paths (Intensive, Balanced, Relaxed) | Learn at your own pace |
| **Progress Dashboard** | Visual charts, milestones, and completion tracking | Stay motivated and accountable |
| **Pomodoro Timer** | Customizable work/break cycles with auto-switching | Boost productivity scientifically |
| **Daily Goals** | Set, track, and celebrate daily objectives | Build consistent study habits |
| **Study Techniques** | Library of proven learning methods | Study smarter, not harder |
| **Dual Themes** | Focus Mode (dark) & Friendly Mode (light) | Match your mood and environment |

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have:
- **Python 3.8 or higher** installed ([Download Python](https://www.python.org/downloads/))
- A **Google Gemini API key** ([Get one here](https://makersuite.google.com/app/apikey))
- Basic knowledge of command line interface
- A modern web browser (Chrome, Firefox, Safari, or Edge)

### Installation

#### Step 1: Get the Code

**Option A: Clone with Git**
```powershell
git clone https://github.com/Siddharthpandey20/Project_Trial.git
cd Project_Trial
```

**Option B: Download ZIP**
- Download the repository as ZIP
- Extract to your desired location
- Open terminal in that folder

#### Step 2: Install Dependencies
```powershell
pip install -r requirements.txt
```

#### Step 3: Configure API Key

**Method 1: Using .env file (Recommended)**

Create a file named `.env` in the project root:
```
GEMINI_API_KEY=your_actual_api_key_here
```

**Method 2: Using Environment Variable**

For PowerShell:
```powershell
$env:GEMINI_API_KEY="your_actual_api_key_here"
```

For CMD:
```cmd
set GEMINI_API_KEY=your_actual_api_key_here
```

**How to Get Your API Key:**

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated key
5. Paste it in your `.env` file or environment variable

> ⚠️ **Important**: Never commit your `.env` file to version control! It's already in `.gitignore`.

---

## 🎮 Running the Application

### Start the Server

**Method 1: Simple Start**
```powershell
python main.py
```

**Method 2: Development Mode (with auto-reload)**
```powershell
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

You should see:
```
==========================================
🎓 AI Study Guide Server Starting...
==========================================
📍 Access the application at:
   → http://localhost:8000
📚 API Documentation at:
   → http://localhost:8000/docs
==========================================
```

### Access the Application

1. **Main App**: Open [http://localhost:8000](http://localhost:8000)
2. **API Docs**: Visit [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API documentation
3. **Alternative**: You can also use [http://127.0.0.1:8000](http://127.0.0.1:8000)

### First Time Setup

1. You'll see a beautiful loading animation
2. The hero page will appear with a "Get Started" button
3. Click "Get Started" to enter the app
4. Choose your preferred mode (Focus or Friendly)
5. Start chatting with your AI study companion! 🎉

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

---

## 📖 How to Use

### 1️⃣ Choose Your Mode

Select the interface that matches your study style:
- **🌙 Focus Mode**: For deep concentration sessions
  - Dark theme reduces eye strain
  - Minimal distractions
  - Perfect for late-night studying
  
- **☀️ Friendly Mode**: For motivational learning
  - Bright, welcoming interface
  - Celebration animations
  - Great for daytime studying

### 2️⃣ Chat with AI

Ask your AI mentor anything:
- "How should I study for calculus?"
- "What's the best way to learn Python?"
- "Create a study schedule for me"
- "Explain the Pomodoro technique"

The AI remembers your conversation and provides contextual responses!

### 3️⃣ Generate Learning Roadmap

Click "📚 Generate Learning Roadmap" and provide:

| Field | Description | Example |
|-------|-------------|---------|
| **Learning Goal** | What you want to learn | "React Development" |
| **Time Commitment** | Hours per week | 10 hours/week |
| **Skill Level** | Beginner/Intermediate/Advanced | Beginner |
| **Learning Styles** | How you prefer to learn | Videos, Projects |
| **Deadline** | Optional target date | 2024-12-31 |
| **Budget** | Free/Mixed/Premium | Free resources |

You'll get **3 customized roadmaps**:
- 🔥 **Intensive Track**: Fast-paced learning
- ⚖️ **Balanced Track**: Sustainable progress
- 🌱 **Relaxed Track**: Gentle learning curve

### 4️⃣ Track Your Progress

Monitor your journey:
- View completion percentage
- Track current streak
- See time remaining
- Complete daily tasks
- Log study sessions

### 5️⃣ Use Pomodoro Timer

Stay focused with the built-in timer:
1. Click ⚙️ to customize durations
2. Press ▶️ to start
3. Work during work sessions
4. Take breaks when timer beeps
5. Watch your productivity soar! 📈

### 6️⃣ Set Daily Goals

Build consistent habits:
1. Click "+ Add Goal"
2. Enter goal and estimated time
3. Check off as you complete
4. Celebrate when all goals done! 🎉

### 7️⃣ Keyboard Shortcuts ⌨️

Power user? Use these shortcuts:
- `Ctrl + K`: Focus chat input
- `Ctrl + T`: Start/pause timer
- `Ctrl + M`: Toggle mode
- `Ctrl + G`: Add new goal

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

---

## 🛠️ Technology Stack

### Backend
| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **Python 3.8+** | Programming language | Easy to learn, powerful for AI |
| **FastAPI** | Web framework | Modern, fast, automatic API docs |
| **Google Gemini AI** | AI model | State-of-the-art language understanding |
| **Pydantic** | Data validation | Type safety and validation |
| **Uvicorn** | ASGI server | High-performance async server |

### Frontend
| Technology | Purpose | Why We Use It |
|------------|---------|---------------|
| **HTML5** | Structure | Semantic, accessible markup |
| **CSS3** | Styling | Modern features like Grid, Flexbox, animations |
| **Vanilla JavaScript** | Behavior | No framework overhead, pure JS power |
| **Chart.js** | Visualizations | Beautiful, responsive charts |
| **Marked.js** | Markdown parsing | Render formatted AI responses |

### Key Dependencies
```
fastapi==0.104.1          # Web framework
google-generativeai==0.3.1 # Gemini AI
pydantic==2.5.0           # Data validation
python-dotenv==1.0.0      # Environment variables
uvicorn==0.24.0           # ASGI server
```

---

## 🎨 Customization

Want to make it your own? This project is highly customizable!

### Change Colors
Edit `style.css` (Lines 1-49) to modify CSS variables:
```css
:root {
    --focus-accent: #4a9eff;  /* Change to your favorite color */
    --friendly-accent: #667eea;
}
```

### Modify Timer Defaults
Edit `app.js` (Lines 11-18):
```javascript
timerSettings: {
    workDuration: 25,    // Minutes
    shortBreak: 5,
    longBreak: 15,
}
```

### Add Custom Quick Actions
See detailed guide in `DOCUMENTATION.md`

**📚 For complete customization guide, see [DOCUMENTATION.md](DOCUMENTATION.md)**

---

## 📁 Project Structure

```
Project_Trial/
├── 📄 main.py                 # FastAPI backend server
├── 📄 requirements.txt        # Python dependencies
├── 📄 README.md              # You are here!
├── 📄 DOCUMENTATION.md       # Complete beginner's guide
├── 📄 .env                   # Environment variables (create this)
├── 📄 .gitignore             # Git ignore rules
│
└── 📁 static/                # Frontend files
    ├── 📄 index.html         # Main HTML structure
    ├── 📄 app.js             # JavaScript logic (2000+ lines)
    └── 📄 style.css          # Styling & animations (2100+ lines)
```

### File Purposes

| File | Lines | Purpose |
|------|-------|---------|
| `main.py` | 336 | Backend API, AI integration, data handling |
| `app.js` | 2000+ | Frontend logic, API calls, user interactions |
| `style.css` | 2100+ | Visual design, animations, responsive layout |
| `index.html` | 682 | Page structure, semantic markup |

---

## 🔌 API Endpoints

### Chat & AI
- `POST /api/chat` - Send message to AI assistant
- `GET /api/motivation/daily` - Get daily motivational quote
- `GET /api/study-techniques` - Get study technique recommendations

### Roadmap Management
- `POST /api/roadmap/generate` - Generate personalized roadmap
- `GET /api/roadmap/{roadmap_id}` - Retrieve specific roadmap
- `POST /api/roadmap/{roadmap_id}/select` - Select a learning track

### Progress Tracking
- `GET /api/progress/{roadmap_id}` - Get learning progress
- `POST /api/progress/update` - Update progress (tasks, time)
- `POST /api/progress/{roadmap_id}/adjust` - Adjust goals

**🔗 Interactive API docs available at: http://localhost:8000/docs**

---

## 🚧 Known Limitations & Future Improvements

### Current Limitations
- ⚠️ **In-Memory Storage**: Data is lost when server restarts
- ⚠️ **Single User**: No authentication system
- ⚠️ **No Database**: Progress isn't permanently saved
- ⚠️ **Local Only**: Not deployed to cloud

### Planned Improvements
- [ ] Add database integration (PostgreSQL/MongoDB)
- [ ] Implement user authentication (JWT)
- [ ] Add real-time collaboration features
- [ ] Create mobile app version
- [ ] Add more AI models support
- [ ] Implement flashcard system
- [ ] Add spaced repetition algorithm
- [ ] Export progress as PDF reports

**Want to contribute? See the Contributing section!**

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### For Beginners
1. Fix typos in documentation
2. Improve code comments
3. Add more motivational quotes
4. Create color themes
5. Report bugs

### For Intermediate
1. Add new study techniques
2. Improve UI/UX
3. Add animations
4. Optimize performance
5. Write tests

### For Advanced
1. Implement database integration
2. Add user authentication
3. Create API rate limiting
4. Add WebSocket support
5. Deploy to cloud

### How to Contribute
```bash
1. Fork the repository
2. Create your feature branch: git checkout -b feature/AmazingFeature
3. Commit changes: git commit -m 'Add AmazingFeature'
4. Push to branch: git push origin feature/AmazingFeature
5. Open a Pull Request
```

---

## 📝 Important Notes

### Security
- 🔒 Never commit your `.env` file
- 🔒 Keep your Gemini API key private
- 🔒 Don't share your API key in screenshots
- 🔒 Rotate your API key if accidentally exposed

### Development
- 💾 Data is temporary (in-memory storage)
- 🔄 Server restart clears all progress
- 🌐 Use `--reload` flag during development
- 📊 Check console for errors

### Production
- ⚡ For production, add proper database
- 👥 Implement user authentication
- 🔐 Add rate limiting
- 📈 Monitor API usage
- 🌍 Deploy to cloud platform

---

## 🐛 Troubleshooting

### Common Issues

**1. ModuleNotFoundError**
```powershell
# Solution: Install dependencies
pip install -r requirements.txt
```

**2. API Key Error**
```powershell
# Solution: Set your API key
$env:GEMINI_API_KEY="your_key_here"
```

**3. Port Already in Use**
```powershell
# Solution: Use different port
python main.py --port 8001
```

**4. Page Not Loading Styles**
- Clear browser cache (Ctrl+Shift+R)
- Check file structure
- Verify static files are in `static/` folder

**More solutions in [DOCUMENTATION.md](DOCUMENTATION.md)**

---

## 📚 Learning Resources

### For Beginners
- [Complete Documentation](DOCUMENTATION.md) - Start here!
- [Python Tutorial](https://docs.python.org/3/tutorial/)
- [JavaScript Guide](https://javascript.info/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)

### For Advanced Users
- [Gemini API Docs](https://ai.google.dev/docs)
- [FastAPI Advanced Guide](https://fastapi.tiangolo.com/advanced/)
- [CSS Grid & Flexbox](https://css-tricks.com/)

---

## 📊 Project Stats

- 📝 **Total Lines of Code**: ~5,000+
- 🎨 **CSS Classes**: 200+
- ⚡ **API Endpoints**: 11
- 🎯 **Features**: 15+
- 📱 **Responsive Breakpoints**: 3
- 🌈 **Color Themes**: 2
- ⌨️ **Keyboard Shortcuts**: 4

---

## 💖 Acknowledgments

- **Google Gemini AI** - For providing powerful AI capabilities
- **FastAPI** - For the amazing web framework
- **Chart.js** - For beautiful visualizations
- **Marked.js** - For markdown rendering
- **All Contributors** - For making this project better

---

## 📄 License

This project is licensed under the **MIT License** - see below for details:

```
MIT License

Copyright (c) 2024 Siddharth Pandey

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

**What this means:**
✅ Commercial use allowed  
✅ Modification allowed  
✅ Distribution allowed  
✅ Private use allowed  
⚠️ No warranty provided  
⚠️ No liability accepted  

---

## 📞 Support & Contact

### Get Help
- 📖 Read the [Documentation](DOCUMENTATION.md)
- 🐛 [Report Issues](https://github.com/Siddharthpandey20/Project_Trial/issues)
- 💬 [Ask Questions](https://github.com/Siddharthpandey20/Project_Trial/discussions)
- ⭐ [Star the Project](https://github.com/Siddharthpandey20/Project_Trial)

### Stay Updated
- 🔔 Watch the repository for updates
- 📢 Check the [Releases](https://github.com/Siddharthpandey20/Project_Trial/releases) page

---

## 🎉 Thank You!

Thank you for checking out this project! Whether you're:
- 📖 Learning from the code
- 🛠️ Building something similar
- 🤝 Contributing improvements
- ⭐ Just starring the repo

**Your interest makes this project worthwhile!** 

Happy Learning! 🎓✨

---

<div align="center">

**Made with ❤️ and lots of ☕**

**[⬆ Back to Top](#-ai-study-guide--learning-mentor)**

</div>
