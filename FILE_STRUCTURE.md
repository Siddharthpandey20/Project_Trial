# 📂 File Structure Quick Reference

## Complete File Tree

```
Project_Trial/
│
├── 📄 main.py                    # Backend server (336 lines)
├── 📄 requirements.txt           # Python dependencies
├── 📄 README.md                  # Project overview & setup guide
├── 📄 DOCUMENTATION.md           # Complete beginner's documentation
├── 📄 FILE_STRUCTURE.md          # This file
├── 📄 .env                       # Your API keys (CREATE THIS - not in git)
├── 📄 .env.example               # Template for .env file
├── 📄 .gitignore                 # Git ignore rules
│
├── 📁 static/                    # Frontend files
│   ├── 📄 index.html             # HTML structure (682 lines)
│   ├── 📄 app.js                 # JavaScript logic (2000+ lines)
│   └── 📄 style.css              # Styles & animations (2100+ lines)
│
└── 📁 env/                       # Python virtual environment (auto-generated)
    ├── 📄 pyvenv.cfg
    ├── 📁 Include/
    ├── 📁 Lib/
    │   └── 📁 site-packages/     # Installed Python packages
    └── 📁 Scripts/
        ├── activate              # Activate script (Linux/Mac)
        ├── activate.bat          # Activate script (Windows CMD)
        └── Activate.ps1          # Activate script (PowerShell)
```

---

## 📄 File Purposes & Key Sections

### `main.py` - Backend Server
**Purpose**: FastAPI backend, handles all server-side logic

| Lines | Purpose | What It Does |
|-------|---------|--------------|
| 1-10 | Imports | Load required libraries |
| 12-13 | App Init | Create FastAPI application |
| 16-22 | CORS | Enable cross-origin requests |
| 25-27 | AI Config | Configure Gemini AI |
| 30-32 | Storage | In-memory data storage |
| 35-52 | Models | Pydantic data validation models |
| 55-88 | AI Function | Generate chat responses |
| 90-152 | Roadmap Gen | Generate learning roadmaps |
| 155-182 | Chat API | POST /api/chat endpoint |
| 184-211 | Roadmap API | POST /api/roadmap/generate |
| 213-325 | Progress API | Progress tracking endpoints |
| 328-336 | Server Start | Run the server |

**Key Functions:**
- `generate_chat_response()`: Talks to Gemini AI
- `generate_roadmap_with_ai()`: Creates learning paths
- `calculate_duration()`: Estimates learning time
- `generate_phases()`: Creates roadmap phases

---

### `static/index.html` - Frontend Structure
**Purpose**: HTML structure and content

| Lines | Section | What It Contains |
|-------|---------|------------------|
| 1-9 | Head | Meta tags, title, CSS/JS links |
| 10-18 | Loading | Loading screen animation |
| 20-115 | Hero Page | Landing page with features |
| 117-685 | Main App | Application interface |
| 120-135 | Header | Navigation and controls |
| 138-185 | Mode Select | Choose Focus/Friendly mode |
| 189-330 | Chat View | Chat interface and sidebar |
| 333-420 | Roadmap Gen | Roadmap generation form |
| 423-540 | Progress | Progress dashboard |
| 543-682 | Modals | Popup dialogs |

**Key Elements:**
- `#loading-screen`: Startup animation
- `#hero-page`: Welcome/landing page
- `#app`: Main application container
- `#chat-view`: Chat interface
- `#roadmap-generation`: Create roadmap form
- `#progress-dashboard`: Track progress

---

### `static/app.js` - Frontend Logic
**Purpose**: JavaScript application logic

| Lines | Section | What It Does |
|-------|---------|--------------|
| 1-42 | State | Application state object |
| 45-87 | API Config | API endpoint definitions |
| 90-140 | Init | Initialize application |
| 143-175 | Hero Page | Landing page functionality |
| 178-220 | Navigation | Page routing and home button |
| 223-265 | Preferences | Save/load user settings |
| 268-295 | Mode Selection | Choose and switch modes |
| 298-320 | Navigation | View switching |
| 323-480 | Chat | Chat functionality |
| 483-625 | Roadmap | Generate roadmaps |
| 628-850 | Progress | Track progress |
| 853-1050 | Timer | Pomodoro timer logic |
| 1053-1150 | Goals | Daily goals tracking |
| 1153-1200 | Shortcuts | Keyboard shortcuts |
| 1203-1350 | Settings | App settings & preferences |
| 1353-1550 | Modals | Modal dialogs management |

**Key Functions:**
- `initializeApp()`: Start the app
- `sendMessage()`: Send chat to AI
- `generateRoadmap()`: Create learning path
- `startTimer()`: Begin Pomodoro session
- `addGoal()`: Add daily goal
- `showModal()`: Display popup

---

### `static/style.css` - Styling & Design
**Purpose**: Visual design, layout, and animations

| Lines | Section | What It Styles |
|-------|---------|----------------|
| 1-49 | Variables | CSS custom properties (colors, spacing) |
| 51-80 | Reset | Global resets and body styles |
| 83-120 | Loading | Loading screen animation |
| 123-600 | Hero Page | Landing page design |
| 603-750 | Header | App header and navigation |
| 753-920 | Buttons | All button styles |
| 923-1050 | Mode Select | Mode selection cards |
| 1053-1700 | Chat View | Chat interface layout |
| 1703-1900 | Roadmap | Roadmap generation form |
| 1903-2050 | Progress | Progress dashboard |
| 2053-2100 | Modals | Modal dialog styles |
| 2103-2136 | Responsive | Mobile/tablet layouts |

**Key Classes:**
- `.focus-mode`: Dark theme styles
- `.friendly-mode`: Light theme styles
- `.chat-message`: Chat bubble styles
- `.btn--primary`: Primary button
- `.sidebar-section`: Sidebar cards
- `.modal-content`: Popup dialogs

---

## 🎯 Where to Make Changes

### Want to change colors?
**File**: `style.css` **Lines**: 1-49 (CSS Variables)

### Want to modify timer defaults?
**File**: `app.js` **Lines**: 11-18 (timerSettings)

### Want to add API endpoint?
**File**: `main.py` **Lines**: Add after line 325

### Want to add new page/view?
**Files**: 
1. `index.html` - Add HTML structure
2. `app.js` - Add navigation logic
3. `style.css` - Add styling

### Want to change AI behavior?
**File**: `main.py` **Lines**: 55-88 (generate_chat_response)

### Want to modify roadmap templates?
**File**: `main.py` **Lines**: 145-160 (phases_templates)

### Want to add keyboard shortcut?
**File**: `app.js` **Lines**: 1153-1200 (setupKeyboardShortcuts)

---

## 📊 File Statistics

| File | Lines | Size (approx) | Language | Complexity |
|------|-------|---------------|----------|------------|
| main.py | 336 | ~10 KB | Python | ⭐⭐⭐ |
| app.js | 2000+ | ~60 KB | JavaScript | ⭐⭐⭐⭐ |
| style.css | 2100+ | ~65 KB | CSS | ⭐⭐⭐ |
| index.html | 682 | ~25 KB | HTML | ⭐⭐ |
| **Total** | **5118+** | **~160 KB** | | |

---

## 🔍 Find Specific Features

### Feature: Chat with AI
- **Backend**: `main.py` lines 155-182 (`/api/chat`)
- **Frontend Logic**: `app.js` lines 385-444 (`sendMessage()`)
- **HTML**: `index.html` lines 189-206 (textarea & button)
- **Styles**: `style.css` lines 1053-1700

### Feature: Pomodoro Timer
- **Backend**: None (frontend only)
- **Frontend Logic**: `app.js` lines 853-1050
- **HTML**: `index.html` lines 250-280
- **Styles**: `style.css` lines 1350-1450

### Feature: Daily Goals
- **Backend**: None (localStorage)
- **Frontend Logic**: `app.js` lines 1053-1150
- **HTML**: `index.html` lines 232-248
- **Styles**: `style.css` lines 1480-1600

### Feature: Learning Roadmaps
- **Backend**: `main.py` lines 90-152, 184-240
- **Frontend Logic**: `app.js` lines 483-625
- **HTML**: `index.html` lines 333-420
- **Styles**: `style.css` lines 1703-1900

### Feature: Progress Tracking
- **Backend**: `main.py` lines 242-298
- **Frontend Logic**: `app.js` lines 628-850
- **HTML**: `index.html` lines 423-540
- **Styles**: `style.css` lines 1903-2050

---

## 🗂️ Dependencies Overview

### Python Packages (`requirements.txt`)
```
fastapi==0.104.1          → Web framework
google-generativeai       → Gemini AI
pydantic==2.5.0          → Data validation
python-dotenv==1.0.0     → Load .env files
uvicorn==0.24.0          → ASGI server
python-multipart         → File uploads
```

### JavaScript Libraries (CDN)
```javascript
// In index.html <head>
Chart.js       → Progress charts
Marked.js      → Markdown rendering
```

---

## 🎨 Color Scheme Reference

### Focus Mode (Dark)
```css
Background:  #0a0a0a (near black)
Surface:     #1a1a1a (dark gray)
Text:        #e0e0e0 (light gray)
Accent:      #4a9eff (blue)
```

### Friendly Mode (Light)
```css
Background:  #f8f9fa (off-white)
Surface:     #ffffff (white)
Text:        #2d3748 (dark gray)
Accent:      #667eea (purple)
```

### Hero Page Gradient
```css
Start:  #667eea (purple)
End:    #764ba2 (dark purple)
```

---

## 📝 Naming Conventions

### CSS Classes
- `btn--primary`: Primary button (BEM style)
- `chat-message`: Chat bubble
- `.focus-mode`: Dark theme
- `.friendly-mode`: Light theme
- `.hidden`: Hide element

### JavaScript
- `camelCase`: Functions and variables
- `PascalCase`: Classes (not used much)
- `UPPER_CASE`: Constants

### Python
- `snake_case`: Functions and variables
- `PascalCase`: Classes
- `UPPER_CASE`: Constants

---

## 🚀 Quick Navigation

**Starting Point**: `main.py` → Starts server
**Entry Page**: `static/index.html` → First page loaded
**App Logic**: `static/app.js` → Makes everything work
**Visual Design**: `static/style.css` → Makes it beautiful

**For Learning**: Start with `DOCUMENTATION.md`
**For Setup**: Start with `README.md`
**For Code Reference**: Use this file!

---

**📚 More Help**: See [DOCUMENTATION.md](DOCUMENTATION.md) for detailed explanations of how each part works!
