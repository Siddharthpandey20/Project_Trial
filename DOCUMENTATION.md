# 📚 Complete Beginner's Guide to AI Study Mentor

> **A comprehensive guide for beginners to understand, customize, and learn from this project**

---

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & How It Works](#architecture--how-it-works)
3. [Backend - Python/FastAPI Guide](#backend---pythonfastapi-guide)
4. [Frontend - HTML/CSS/JavaScript Guide](#frontend---htmlcssjavascript-guide)
5. [Customization Guide](#customization-guide)
6. [Common Modifications](#common-modifications)
7. [Troubleshooting](#troubleshooting)
8. [Learning Resources](#learning-resources)

---

## 🎯 Project Overview

### What is this project?

This is an **AI-powered study companion** that helps students:
- Chat with an AI tutor for learning advice
- Generate personalized learning roadmaps
- Track progress with a visual dashboard
- Use Pomodoro timer for focused study sessions
- Set and complete daily goals

### Tech Stack (What's used?)

- **Backend**: Python + FastAPI (handles AI, data storage, API)
- **AI**: Google Gemini API (powers the chat assistant)
- **Frontend**: HTML + CSS + JavaScript (what you see and interact with)
- **Data**: In-memory storage (temporary, resets when server restarts)

---

## 🏗️ Architecture & How It Works

### The Big Picture

```
┌─────────────────┐        ┌──────────────────┐        ┌────────────────┐
│                 │        │                  │        │                │
│   Frontend      │◄──────►│   Backend        │◄──────►│   Gemini AI    │
│   (Browser)     │  HTTP  │   (FastAPI)      │  API   │   (Google)     │
│                 │        │                  │        │                │
└─────────────────┘        └──────────────────┘        └────────────────┘
   HTML/CSS/JS                Python Code               AI Model
```

### How Data Flows

1. **User Action**: You click a button or type a message
2. **Frontend**: JavaScript sends request to backend
3. **Backend**: Python processes request, may call Gemini AI
4. **AI Response**: Gemini generates intelligent response
5. **Backend**: Formats and sends data back
6. **Frontend**: Displays result beautifully to user

---

## 🐍 Backend - Python/FastAPI Guide

### File: `main.py` (Backend Server)

This file is the "brain" of your application. It handles all the logic.

#### **Lines 1-9: Import Libraries**
```python
from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import os
from datetime import datetime, timedelta
import json
```

**What this does:**
- Imports tools we need (like importing ingredients for a recipe)
- `FastAPI`: Web framework to create API endpoints
- `genai`: Google's AI library
- `pydantic`: Validates data (ensures correct format)
- `datetime`: Works with dates and times

#### **Lines 12-13: Create the App**
```python
app = FastAPI(title="AI Study Guide API")
```

**What this does:**
- Creates your web application instance
- Like creating a new restaurant where people can order (make requests)

#### **Lines 16-22: Enable CORS**
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**What this does:**
- Allows your frontend (running in browser) to talk to backend
- Without this, browsers block the requests for security
- `allow_origins=["*"]` means accept requests from anywhere

#### **Lines 25-27: Configure AI**
```python
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "your_Api_key_here")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-2.5-flash')
```

**What this does:**
- Gets your API key from environment variables
- Configures the Gemini AI with your key
- Creates an AI model instance (the AI brain)

#### **Lines 30-32: Data Storage**
```python
roadmaps_db = {}
progress_db = {}
chat_history = {}
```

**What this does:**
- Creates empty dictionaries to store data
- `{}` is an empty dictionary (like an empty phonebook)
- **Important**: Data stored here disappears when server restarts!

#### **Lines 35-52: Data Models (Pydantic)**
```python
class ChatMessage(BaseModel):
    message: str
    mode: str = "friendly"
```

**What this does:**
- Defines the shape/structure of data
- Like a form with specific fields
- Ensures data received is correct format
- `message: str` means message must be text
- `mode: str = "friendly"` means mode has default value

#### **Lines 55-88: generate_chat_response() Function**
```python
def generate_chat_response(message: str, mode: str, history: Optional[List[dict]] = None) -> str:
    try:
        system_prompt = f"""You are an AI Study Mentor assistant. 
        Current mode: {mode}
        """
        
        conversation = system_prompt + "\n\n"
        if history:
            for msg in history[-5:]:
                conversation += f"{msg['role']}: {msg['content']}\n"
        
        conversation += f"User: {message}\nAssistant:"
        
        response = model.generate_content(conversation)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error: {str(e)}")
```

**What this does:**
1. Takes user's message and conversation history
2. Builds a prompt for AI (instructions + conversation context)
3. Sends prompt to Gemini AI
4. Gets AI's response
5. Returns the text response
6. If error, raises HTTP exception

**Line by Line:**
- `def generate_chat_response(...)`: Function definition
- `try:`: Start error handling block
- `system_prompt = f"""..."""`: Instructions for AI (f-string allows variables)
- `conversation = ...`: Builds full conversation context
- `history[-5:]`: Gets last 5 messages from history
- `model.generate_content(...)`: Calls AI
- `return response.text`: Returns AI's answer
- `except Exception as e:`: Catches any errors

#### **Lines 155-182: /api/chat Endpoint**
```python
@app.post("/api/chat")
async def chat(chat_msg: ChatMessage):
    user_id = "default_user"
    
    if user_id not in chat_history:
        chat_history[user_id] = []
    
    chat_history[user_id].append({"role": "user", "content": chat_msg.message})
    
    response = generate_chat_response(chat_msg.message, chat_msg.mode, chat_history[user_id])
    
    chat_history[user_id].append({"role": "assistant", "content": response})
    
    return {
        "response": response,
        "timestamp": datetime.now().isoformat()
    }
```

**What this does:**
1. `@app.post("/api/chat")`: Creates a POST endpoint at /api/chat
2. Receives message from frontend
3. Saves user message to history
4. Calls AI to generate response
5. Saves AI response to history
6. Sends response back to frontend

**Understanding Each Part:**
- `@app.post(...)`: Decorator that creates API route
- `async def chat(...)`: Asynchronous function (can handle multiple requests)
- `chat_msg: ChatMessage`: Parameter validated by Pydantic model
- `chat_history[user_id].append(...)`: Add to list
- `return {...}`: Returns JSON response

#### **Lines 328-335: Start Server**
```python
if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("🎓 AI Study Guide Server Starting...")
    print("="*50)
    print(f"📍 Access the application at:")
    print(f"   → http://localhost:8000")
    uvicorn.run(app, host="127.0.0.1", port=8000)
```

**What this does:**
- Checks if file is run directly (not imported)
- Imports `uvicorn` server
- Prints startup message
- Starts server on localhost:8000

---

## 🎨 Frontend - HTML/CSS/JavaScript Guide

### File: `index.html` (Structure)

HTML is the **skeleton** - it defines structure and content.

#### **Lines 1-9: Document Setup**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="AI-powered study guide chatbot">
    <title>AI Study Guide & Learning Mentor</title>
    <link rel="stylesheet" href="/static/style.css">
```

**What this does:**
- `<!DOCTYPE html>`: Tells browser this is HTML5
- `<html lang="en">`: Root element, language is English
- `<head>`: Contains metadata (not visible on page)
- `<meta charset="UTF-8">`: Character encoding for text
- `<meta name="viewport"...>`: Makes site responsive on mobile
- `<title>`: Text shown in browser tab
- `<link rel="stylesheet"...>`: Links CSS file for styling

#### **Lines 10-18: Loading Screen**
```html
<div id="loading-screen" class="loading-screen">
    <div class="loading-content">
        <div class="loading-spinner"></div>
        <h2>Initializing Your Learning Companion...</h2>
    </div>
</div>
```

**What this does:**
- `<div>`: Container element (like a box)
- `id="loading-screen"`: Unique identifier (only one)
- `class="loading-screen"`: CSS class for styling
- Creates loading animation shown on startup

#### **Lines 20-115: Hero/Landing Page**
```html
<div id="hero-page" class="hero-page">
    <nav class="hero-nav">
        <div class="hero-logo-nav">
            <span class="logo-icon-nav">🎓</span>
            <span class="logo-text-nav">StudyMentor AI</span>
        </div>
        <button id="skip-intro-btn" class="btn-text">Skip to App →</button>
    </nav>
    
    <div class="hero-main">
        <h1 class="hero-main-title">
            Master Any Skill with
            <span class="gradient-text">AI-Powered</span>
            Learning
        </h1>
    </div>
</div>
```

**Understanding Elements:**
- `<nav>`: Navigation section
- `<span>`: Inline container for text
- `<button>`: Clickable button
- `<h1>`: Main heading (largest)
- `class="gradient-text"`: CSS class for gradient effect

#### **Lines 189-206: Chat Input**
```html
<textarea 
    id="chat-input" 
    placeholder="Ask me about your learning goals..." 
    rows="1"
    aria-label="Chat input"
></textarea>

<button id="send-btn" class="btn btn--primary" disabled>
    Send
</button>
```

**What this does:**
- `<textarea>`: Multi-line text input
- `id="chat-input"`: JavaScript uses this to get/set value
- `placeholder`: Gray text shown when empty
- `rows="1"`: Initial height
- `aria-label`: Accessibility for screen readers
- `disabled`: Button starts disabled (until you type)

---

### File: `app.js` (Behavior/Logic)

JavaScript makes the page **interactive** and handles communication.

#### **Lines 1-42: Application State**
```javascript
const AppState = {
    currentMode: null,
    currentView: 'hero-page',
    currentRoadmapId: null,
    chatHistory: [],
    timerInterval: null,
    timerSeconds: 1500,
    dailyGoals: [],
    // ... more properties
};
```

**What this does:**
- Creates object to store application state
- `const`: Variable that can't be reassigned
- Properties store current values (mode, view, timer, etc.)
- This is like the "memory" of your app

**Understanding const vs let vs var:**
- `const`: Can't reassign (use for objects, functions)
- `let`: Can reassign, block-scoped
- `var`: Old way, avoid using

#### **Lines 45-87: API Configuration**
```javascript
const API = {
    chat: async (message, mode) => {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, mode })
        });
        return response.json();
    },
    // ... more API methods
};
```

**What this does:**
- Defines functions to communicate with backend
- `async`: Function that uses await (handles async operations)
- `await fetch(...)`: Makes HTTP request, waits for response
- `method: 'POST'`: Type of request
- `headers`: Tells server we're sending JSON
- `JSON.stringify(...)`: Converts JavaScript object to JSON text
- `response.json()`: Converts response to JavaScript object

**Understanding async/await:**
```javascript
// Without async/await (callback hell)
fetch(url).then(response => {
    response.json().then(data => {
        console.log(data);
    });
});

// With async/await (much cleaner!)
const response = await fetch(url);
const data = await response.json();
console.log(data);
```

#### **Lines 90-96: Initialization**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});
```

**What this does:**
- Waits for HTML to fully load
- Then calls `initializeApp()` function
- `=>` is arrow function syntax (modern JavaScript)

**Arrow Function Syntax:**
```javascript
// Old way
function greet(name) {
    return "Hello " + name;
}

// New way (arrow function)
const greet = (name) => {
    return "Hello " + name;
};

// Even shorter (one line)
const greet = (name) => "Hello " + name;
```

#### **Lines 385-418: Send Message Function**
```javascript
async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    addChatMessage('user', message);
    chatInput.value = '';
    
    showTypingIndicator();
    
    try {
        const response = await API.chat(message, AppState.currentMode);
        hideTypingIndicator();
        addChatMessage('assistant', response.response);
        
        AppState.chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: response.response }
        );
    } catch (error) {
        hideTypingIndicator();
        addChatMessage('assistant', 'Sorry, I encountered an error.');
        console.error('Chat error:', error);
    }
}
```

**Line by Line Breakdown:**
1. `async function sendMessage()`: Declares async function
2. `const chatInput = document.getElementById('chat-input')`: Gets input element
3. `const message = chatInput.value.trim()`: Gets text, removes spaces
4. `if (!message) return`: Exit if empty
5. `addChatMessage('user', message)`: Show user's message
6. `chatInput.value = ''`: Clear input
7. `showTypingIndicator()`: Show "AI is thinking..."
8. `try {`: Start error handling
9. `const response = await API.chat(...)`: Call backend API
10. `hideTypingIndicator()`: Hide typing indicator
11. `addChatMessage('assistant', ...)`: Show AI response
12. `AppState.chatHistory.push(...)`: Save to history
13. `catch (error) {`: Handle errors
14. Show error message to user

#### **Lines 420-444: Add Chat Message Function**
```javascript
function addChatMessage(role, content) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    if (typeof marked !== 'undefined') {
        messageContent.innerHTML = marked.parse(content);
    } else {
        messageContent.textContent = content;
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}
```

**What this does:**
1. Gets container where messages go
2. Creates new div element
3. Sets CSS class for styling
4. Creates avatar (user icon or robot)
5. Creates message content div
6. Checks if markdown library available
7. If yes, parse markdown; if no, use plain text
8. Adds avatar to message div
9. Adds content to message div
10. Adds message to container
11. Scrolls to bottom to show new message

**Understanding DOM Manipulation:**
- `document.getElementById(...)`: Get element by id
- `document.createElement(...)`: Create new element
- `.className`: Set CSS classes
- `.textContent`: Set text content
- `.innerHTML`: Set HTML content
- `.appendChild(...)`: Add child element

---

### File: `style.css` (Appearance)

CSS makes the page **beautiful** and controls visual design.

#### **Lines 1-49: CSS Variables**
```css
:root {
    /* Focus Mode Colors */
    --focus-bg: #0a0a0a;
    --focus-surface: #1a1a1a;
    --focus-text: #e0e0e0;
    --focus-accent: #4a9eff;
    
    /* Spacing */
    --spacing-md: 1rem;
    --spacing-lg: 1.5rem;
    
    /* Border Radius */
    --radius-md: 0.5rem;
}
```

**What this does:**
- `:root`: Defines global CSS variables
- `--variable-name`: Custom property (can use anywhere)
- Stores colors, sizes, spacing for consistency
- Easy to change theme by updating variables

**How to Use Variables:**
```css
.button {
    background: var(--focus-accent);
    padding: var(--spacing-md);
    border-radius: var(--radius-md);
}
```

#### **Lines 51-56: Reset Styles**
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```

**What this does:**
- `*`: Selects all elements
- Removes default margins and padding
- `box-sizing: border-box`: Makes width calculations easier

#### **Lines 58-64: Body Styles**
```css
body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto';
    line-height: 1.6;
    transition: background-color var(--transition-base), color var(--transition-base);
    overflow-x: hidden;
}
```

**Understanding Each Property:**
- `font-family`: List of fonts (browser uses first available)
- `line-height: 1.6`: Space between lines (1.6x font size)
- `transition`: Smooth animation when changing properties
- `overflow-x: hidden`: Prevents horizontal scrollbar

#### **Lines 67-75: Focus Mode Styles**
```css
body.focus-mode {
    background-color: var(--focus-bg);
    color: var(--focus-text);
}

body.friendly-mode {
    background-color: var(--friendly-bg);
    color: var(--friendly-text);
}
```

**What this does:**
- `.focus-mode`: When body has this class
- Sets dark background and light text
- `.friendly-mode`: Light background and dark text
- JavaScript adds/removes these classes to switch modes

#### **Lines 77-80: Hidden Utility Class**
```css
.hidden {
    display: none !important;
}
```

**What this does:**
- `.hidden`: CSS class to hide elements
- `display: none`: Element is completely hidden
- `!important`: Overrides other styles (use sparingly)

#### **Lines 420-470: Chat Message Styles**
```css
.chat-message {
    display: flex;
    gap: 1rem;
    animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 85%;
}

@keyframes messageSlideIn {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}
```

**Understanding Properties:**
- `display: flex`: Flexbox layout (items side by side)
- `gap: 1rem`: Space between flex items
- `animation`: Plays animation when element appears
- `@keyframes`: Defines animation steps
- `opacity`: 0 = invisible, 1 = fully visible
- `transform`: Move, rotate, scale element
- `translateY(20px)`: Move down 20 pixels
- `scale(0.95)`: 95% of original size

#### **Lines 1900-1950: Responsive Design**
```css
@media (max-width: 1024px) {
    .chat-view {
        grid-template-columns: 1fr;
    }
    
    .chat-sidebar {
        display: none;
    }
}
```

**What this does:**
- `@media`: Media query for responsive design
- `(max-width: 1024px)`: On screens 1024px or smaller
- Changes layout to single column
- Hides sidebar on smaller screens

---

## 🎨 Customization Guide

### How to Change Colors

#### Option 1: Modify CSS Variables (Recommended)

**File**: `style.css` (Lines 1-49)

```css
:root {
    /* Change Focus Mode colors here */
    --focus-bg: #0a0a0a;          /* Background color */
    --focus-surface: #1a1a1a;     /* Card/surface color */
    --focus-accent: #4a9eff;      /* Accent color (buttons, links) */
    --focus-text: #e0e0e0;        /* Text color */
    
    /* Change Friendly Mode colors here */
    --friendly-bg: #f8f9fa;
    --friendly-accent: #667eea;
}
```

**Example - Make Focus Mode Purple:**
```css
:root {
    --focus-accent: #9d4edd;      /* Purple instead of blue */
}
```

#### Option 2: Create Custom Theme

**Add to `style.css`:**
```css
body.custom-theme {
    --focus-bg: #1a0033;          /* Dark purple */
    --focus-surface: #2d0052;
    --focus-accent: #b565ff;
    --focus-text: #e6d9ff;
}
```

**Add to `app.js` (in selectMode function):**
```javascript
function selectMode(mode) {
    if (mode === 'custom') {
        document.body.className = 'custom-theme';
    } else {
        document.body.className = mode === 'focus' ? 'focus-mode' : 'friendly-mode';
    }
}
```

### How to Change Fonts

**File**: `style.css` (Line 58)

```css
body {
    /* Current font stack */
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
}
```

**Option 1: Use Google Fonts**

1. Add to `index.html` `<head>` section:
```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
```

2. Update CSS:
```css
body {
    font-family: 'Poppins', sans-serif;
}
```

**Popular Font Combinations:**
```css
/* Modern & Clean */
font-family: 'Inter', sans-serif;

/* Friendly & Rounded */
font-family: 'Nunito', sans-serif;

/* Professional */
font-family: 'Roboto', sans-serif;

/* Elegant */
font-family: 'Playfair Display', serif;
```

### How to Change Layout

#### Make Sidebar Wider

**File**: `style.css` (around line 400)

```css
.chat-view {
    display: grid;
    grid-template-columns: 1fr 380px;  /* Change 380px to your desired width */
    gap: 1.5rem;
}
```

**Example - Wider sidebar:**
```css
.chat-view {
    grid-template-columns: 1fr 450px;  /* 450px sidebar */
}
```

#### Change Hero Page Layout

**File**: `style.css` (around line 270)

```css
.hero-main .hero-container {
    display: grid;
    grid-template-columns: 1fr 1fr;  /* Two equal columns */
    gap: 4rem;
}
```

**Make text take 60%, visual 40%:**
```css
.hero-main .hero-container {
    grid-template-columns: 60% 40%;
}
```

### How to Add New Quick Actions

**File**: `index.html` (around line 215)

```html
<div class="sidebar-section">
    <h3>Quick Actions</h3>
    <button class="btn btn--secondary btn--full-width quick-action-btn" data-action="generate-roadmap">
        📚 Generate Learning Roadmap
    </button>
    
    <!-- Add your new button here -->
    <button class="btn btn--secondary btn--full-width quick-action-btn" data-action="flashcards">
        🎴 Study Flashcards
    </button>
</div>
```

**File**: `app.js` (in handleQuickAction function, around line 460)

```javascript
function handleQuickAction(action) {
    switch (action) {
        case 'generate-roadmap':
            navigateToView('roadmap-generation');
            break;
        case 'flashcards':  // Add your action
            showFlashcards();
            break;
    }
}

function showFlashcards() {
    addChatMessage('assistant', 'Flashcard feature coming soon! 🎴');
}
```

### How to Modify Timer Durations

**File**: `app.js` (Lines 11-18)

```javascript
timerSettings: {
    workDuration: 25,              // Change to your preferred minutes
    shortBreak: 5,                 // Short break duration
    longBreak: 15,                 // Long break duration
    sessionsUntilLongBreak: 4,     // Sessions before long break
    autoStartBreaks: false,        // Auto-start breaks?
    notificationSound: true        // Play sound?
}
```

**Example - 50/10 Pomodoro:**
```javascript
timerSettings: {
    workDuration: 50,     // 50 minutes work
    shortBreak: 10,       // 10 minutes break
    longBreak: 30,        // 30 minutes long break
    sessionsUntilLongBreak: 3,
}
```

---

## 🔧 Common Modifications

### 1. Change Welcome Message

**File**: `app.js` (Lines 365-373)

```javascript
function getWelcomeMessage(mode) {
    if (mode === 'focus') {
        return "Focus Mode activated. Ready to learn?";  // Change this
    } else {
        return "Hello! Let's start learning! 🎉";  // Change this
    }
}
```

### 2. Add More Motivational Quotes

**File**: `main.py` (Lines 309-318)

```python
@app.get("/api/motivation/daily")
async def get_daily_motivation():
    quotes = [
        {"text": "Your quote here", "author": "Author Name"},
        {"text": "Another quote", "author": "Another Author"},
        # Add more quotes here
    ]
    
    import random
    return random.choice(quotes)
```

### 3. Modify Roadmap Generation

**File**: `main.py` (Lines 155-175)

Change the phases templates:

```python
phases_templates = {
    "beginner": [
        {"name": "Getting Started", "duration": "1 week", "topics": ["Introduction", "Setup"]},
        {"name": "Core Concepts", "duration": "2 weeks", "topics": ["Fundamentals", "Practice"]},
        # Add your custom phases
    ]
}
```

### 4. Change Animation Speed

**File**: `style.css`

```css
/* Find animation definitions */
@keyframes messageSlideIn {
    /* ... */
}

/* Change animation duration */
.chat-message {
    animation: messageSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    /*                      ^^^^                               */
    /*                    Change this number                   */
    /*                    0.2s = faster, 1s = slower          */
}
```

### 5. Add Custom Emojis/Icons

**File**: `index.html`

Find elements and change emojis:

```html
<!-- Original -->
<div class="card-icon">🤖</div>

<!-- Change to whatever you want -->
<div class="card-icon">🚀</div>
<div class="card-icon">💡</div>
<div class="card-icon">🎯</div>
```

### 6. Modify Button Styles

**File**: `style.css` (around line 700)

```css
.btn--primary {
    background: var(--focus-accent);
    color: white;
    padding: 0.625rem 1.25rem;      /* Change padding */
    border-radius: var(--radius-md); /* Change roundness */
    font-size: 0.9375rem;            /* Change text size */
}

/* Make buttons more rounded */
.btn--primary {
    border-radius: 2rem;  /* Very rounded */
}

/* Make buttons bigger */
.btn--primary {
    padding: 1rem 2rem;
    font-size: 1.1rem;
}
```

### 7. Change Background Gradient

**File**: `style.css` (around line 125)

```css
.hero-page {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    /*                                  ^^^^^^      ^^^^^^        */
    /*                                First color  Second color   */
}

/* Try different gradients */
/* Sunset */
background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);

/* Ocean */
background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);

/* Forest */
background: linear-gradient(135deg, #56ab2f 0%, #a8e063 100%);

/* Purple Dream */
background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
```

---

## 🐛 Troubleshooting

### Common Errors & Solutions

#### 1. "ModuleNotFoundError: No module named 'fastapi'"

**Problem**: Required Python package not installed

**Solution**:
```powershell
pip install -r requirements.txt
```

#### 2. "API key not found" or "Invalid API key"

**Problem**: Gemini API key not configured

**Solution**:
1. Get key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create `.env` file:
```
GEMINI_API_KEY=your_actual_key_here
```
3. Or set environment variable:
```powershell
$env:GEMINI_API_KEY="your_key_here"
```

#### 3. Styles Not Loading (Page looks broken)

**Problem**: CSS file not found

**Solution**:
1. Check file structure:
```
Taru/
├── main.py
└── static/
    ├── index.html
    ├── app.js
    └── style.css
```

2. Verify CSS link in HTML:
```html
<link rel="stylesheet" href="/static/style.css">
```

#### 4. JavaScript Not Working (Buttons don't respond)

**Problem**: JavaScript errors

**Solution**:
1. Open browser console (F12)
2. Look for red errors
3. Common fixes:
   - Check if `app.js` is loaded: View → Developer → JavaScript Console
   - Clear browser cache: Ctrl+Shift+R
   - Check JavaScript path in HTML:
   ```html
   <script src="/static/app.js"></script>
   ```

#### 5. Server Won't Start (Port already in use)

**Problem**: Port 8000 is already being used

**Solution**:
1. Use different port:
```powershell
python main.py --port 8001
```

Or modify `main.py`:
```python
uvicorn.run(app, host="127.0.0.1", port=8001)
```

2. Or kill process using port 8000:
```powershell
# Find process
netstat -ano | findstr :8000

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

#### 6. CORS Error in Browser

**Problem**: Browser blocking requests

**Solution**: Already configured in `main.py`, but ensure:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # This should be present
    allow_methods=["*"],
    allow_headers=["*"],
)
```

#### 7. Changes Not Appearing

**Solution**:
1. **Hard refresh**: Ctrl+Shift+R (clears cache)
2. **Restart server**: Stop with Ctrl+C, then restart
3. **Clear browser data**: Settings → Clear browsing data
4. **Check correct file**: Make sure you edited the right file!

---

## 📚 Learning Resources

### HTML
- [MDN HTML Basics](https://developer.mozilla.org/en-US/docs/Learn/HTML)
- [HTML Elements Reference](https://developer.mozilla.org/en-US/docs/Web/HTML/Element)

### CSS
- [MDN CSS Basics](https://developer.mozilla.org/en-US/docs/Learn/CSS)
- [Flexbox Guide](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [Grid Layout Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [CSS Variables Tutorial](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

### JavaScript
- [JavaScript.info](https://javascript.info/) - Comprehensive tutorial
- [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- [Async/Await Tutorial](https://javascript.info/async-await)

### Python
- [Python Official Tutorial](https://docs.python.org/3/tutorial/)
- [Real Python Tutorials](https://realpython.com/)

### FastAPI
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [FastAPI Tutorial](https://fastapi.tiangolo.com/tutorial/)

### Tools
- [VS Code](https://code.visualstudio.com/) - Best code editor
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/) - Debug websites
- [Postman](https://www.postman.com/) - Test APIs

---

## 🎓 Key Concepts for Beginners

### Frontend vs Backend

```
Frontend (Client-Side)          Backend (Server-Side)
┌─────────────────┐            ┌──────────────────┐
│  What user sees │            │  Behind scenes   │
│  HTML/CSS/JS    │◄──────────►│  Python/FastAPI  │
│  Runs in browser│            │  Runs on server  │
│  Presentation   │            │  Logic & Data    │
└─────────────────┘            └──────────────────┘
```

### HTTP Methods

- **GET**: Retrieve data (like reading a book)
- **POST**: Send/create data (like submitting a form)
- **PUT**: Update data (like editing a document)
- **DELETE**: Remove data (like deleting a file)

### Async Programming

```javascript
// Synchronous (blocking)
const data = getData();        // Waits here
console.log(data);            // Runs after getData finishes

// Asynchronous (non-blocking)
const data = await getData(); // Waits but doesn't block
console.log(data);            // Runs when data is ready
```

### CSS Selectors

```css
/* Element selector */
div { color: blue; }

/* Class selector */
.my-class { color: blue; }

/* ID selector */
#my-id { color: blue; }

/* Descendant selector */
div p { color: blue; }  /* All p inside div */

/* Direct child */
div > p { color: blue; }  /* Only direct p children */

/* Multiple classes */
.class1.class2 { color: blue; }
```

### JavaScript Events

```javascript
// Click event
button.addEventListener('click', () => {
    console.log('Button clicked!');
});

// Input event
input.addEventListener('input', (e) => {
    console.log('User typed:', e.target.value);
});

// Form submit
form.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent page reload
    // Handle form data
});
```

---

## 💡 Project Ideas to Practice

1. **Add Note-Taking Feature**
   - Create textarea for notes
   - Save to localStorage
   - Add delete/edit functionality

2. **Implement Dark/Light Toggle**
   - Add toggle button
   - Switch CSS variables
   - Save preference

3. **Create Study Statistics**
   - Track time spent
   - Show charts
   - Export data

4. **Add More Study Techniques**
   - Active recall cards
   - Spaced repetition
   - Mind mapping

5. **Build Quiz Feature**
   - Create questions
   - Track answers
   - Show scores

---

## 🤝 Contributing

Feel free to:
- Modify and experiment
- Share improvements
- Ask questions
- Learn and teach others

Remember: **The best way to learn is by doing!** Don't be afraid to break things - you can always revert changes.

---

**Happy Learning! 🎓✨**
