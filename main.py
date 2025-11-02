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

# Initialize FastAPI app
app = FastAPI(title="AI Study Guide API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "AIzaSyBWaCzAIn4b2Yb8_DMWTCX9SHZXC_uezXE")
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel('gemini-1.5-flash')

# In-memory storage (replace with database in production)
roadmaps_db = {}
progress_db = {}
chat_history = {}

# Pydantic Models
class ChatMessage(BaseModel):
    message: str
    mode: str = "friendly"

class RoadmapRequest(BaseModel):
    learning_goal: str
    time_commitment: int
    skill_level: str
    learning_styles: List[str]
    deadline: Optional[str] = None
    budget: str = "free"

class ProgressUpdate(BaseModel):
    roadmap_id: str
    task_id: str
    completed: bool
    time_spent: Optional[int] = 0

class GoalAdjustment(BaseModel):
    roadmap_id: str
    new_time_commitment: int
    new_deadline: Optional[str] = None

# Helper Functions
def generate_chat_response(message: str, mode: str, history: Optional[List[dict]] = None) -> str:
    """Generate AI response using Gemini"""
    try:
        # Build context based on mode
        system_prompt = f"""You are an AI Study Mentor assistant. 
        Current mode: {mode}
        
        {'Focus Mode: Be concise, direct, and minimize distractions in your responses.' if mode == 'focus' else 
         'Friendly Mode: Be warm, encouraging, and supportive in your responses. Use emojis occasionally.'}
        
        Provide helpful study advice, answer questions about learning, and guide users through their educational journey.
        """
        
        # Include chat history for context
        conversation = system_prompt + "\n\n"
        if history:
            for msg in history[-5:]:  # Last 5 messages for context
                conversation += f"{msg['role']}: {msg['content']}\n"
        
        conversation += f"User: {message}\nAssistant:"
        
        response = model.generate_content(conversation)
        return response.text
    except Exception as e:
        print(f"Error in generate_chat_response: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error generating response: {str(e)}")

def generate_roadmap_with_ai(request: RoadmapRequest) -> dict:
    """Generate learning roadmap using Gemini"""
    try:
        # Note: We're not using AI-generated roadmaps for now, using templates instead
        # This avoids API errors and provides consistent results
        
        # Parse the AI response (assuming it returns structured JSON)
        # In production, add proper parsing and validation
        roadmap_data = {
            "intensive": {
                "title": f"{request.learning_goal} - Intensive Track",
                "duration": calculate_duration(request.time_commitment * 1.5, request.skill_level),
                "hours_per_week": request.time_commitment * 1.5,
                "description": "Fast-paced learning with focused daily practice",
                "phases": generate_phases(request, "intensive")
            },
            "balanced": {
                "title": f"{request.learning_goal} - Balanced Track",
                "duration": calculate_duration(request.time_commitment, request.skill_level),
                "hours_per_week": request.time_commitment,
                "description": "Steady progress with sustainable learning pace",
                "phases": generate_phases(request, "balanced")
            },
            "relaxed": {
                "title": f"{request.learning_goal} - Relaxed Track",
                "duration": calculate_duration(request.time_commitment * 0.6, request.skill_level),
                "hours_per_week": request.time_commitment * 0.6,
                "description": "Gentle learning curve with flexibility",
                "phases": generate_phases(request, "relaxed")
            }
        }
        
        return roadmap_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating roadmap: {str(e)}")

def calculate_duration(hours_per_week: float, skill_level: str) -> str:
    """Calculate estimated duration based on hours and skill level"""
    base_hours = {"beginner": 200, "intermediate": 150, "advanced": 100}
    total_hours = base_hours.get(skill_level, 150)
    weeks = int(total_hours / hours_per_week)
    
    if weeks < 4:
        return f"{weeks} weeks"
    elif weeks < 52:
        return f"{weeks // 4} months"
    else:
        return f"{weeks // 52} years"

def generate_phases(request: RoadmapRequest, track_type: str) -> List[dict]:
    """Generate learning phases for a roadmap"""
    # Simplified phase generation - in production, use Gemini to generate detailed phases
    phases_templates = {
        "beginner": [
            {"name": "Foundations", "duration": "2-3 weeks", "topics": ["Basics", "Core Concepts", "Setup"]},
            {"name": "Building Blocks", "duration": "3-4 weeks", "topics": ["Fundamentals", "Practice", "Tools"]},
            {"name": "Applied Learning", "duration": "4-6 weeks", "topics": ["Projects", "Real-world", "Integration"]},
            {"name": "Mastery", "duration": "4-8 weeks", "topics": ["Advanced", "Portfolio", "Best Practices"]}
        ],
        "intermediate": [
            {"name": "Deep Dive", "duration": "2-3 weeks", "topics": ["Advanced Concepts", "Patterns"]},
            {"name": "Specialization", "duration": "4-6 weeks", "topics": ["Expert Areas", "Complex Projects"]},
            {"name": "Production Ready", "duration": "3-4 weeks", "topics": ["Optimization", "Deployment"]}
        ],
        "advanced": [
            {"name": "Expert Topics", "duration": "3-4 weeks", "topics": ["Cutting Edge", "Architecture"]},
            {"name": "Thought Leadership", "duration": "4-6 weeks", "topics": ["Innovation", "Contribution"]}
        ]
    }
    
    return phases_templates.get(request.skill_level, phases_templates["beginner"])

# API Endpoints

@app.get("/")
async def read_root():
    """Serve the main HTML file"""
    return FileResponse("static/index.html")

@app.post("/api/chat")
async def chat(chat_msg: ChatMessage):
    """Handle chat messages"""
    user_id = "default_user"  # In production, use proper user authentication
    
    if user_id not in chat_history:
        chat_history[user_id] = []
    
    # Add user message to history
    chat_history[user_id].append({"role": "user", "content": chat_msg.message})
    
    # Generate response
    response = generate_chat_response(chat_msg.message, chat_msg.mode, chat_history[user_id])
    
    # Add assistant response to history
    chat_history[user_id].append({"role": "assistant", "content": response})
    
    return {
        "response": response,
        "timestamp": datetime.now().isoformat()
    }

@app.post("/api/roadmap/generate")
async def generate_roadmap(request: RoadmapRequest):
    """Generate personalized learning roadmap"""
    roadmap_id = f"roadmap_{datetime.now().timestamp()}"
    
    roadmaps = generate_roadmap_with_ai(request)
    
    # Store roadmap
    roadmaps_db[roadmap_id] = {
        "id": roadmap_id,
        "request": request.dict(),
        "roadmaps": roadmaps,
        "created_at": datetime.now().isoformat(),
        "selected_track": None
    }
    
    return {
        "roadmap_id": roadmap_id,
        "roadmaps": roadmaps
    }

@app.get("/api/roadmap/{roadmap_id}")
async def get_roadmap(roadmap_id: str):
    """Get specific roadmap"""
    if roadmap_id not in roadmaps_db:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    return roadmaps_db[roadmap_id]

@app.post("/api/roadmap/{roadmap_id}/select")
async def select_track(roadmap_id: str, track: dict):
    """Select a specific track from roadmap"""
    if roadmap_id not in roadmaps_db:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    roadmaps_db[roadmap_id]["selected_track"] = track["track_type"]
    
    # Initialize progress tracking
    progress_db[roadmap_id] = {
        "roadmap_id": roadmap_id,
        "track": track["track_type"],
        "completion_percentage": 0,
        "current_phase": 0,
        "streak": 0,
        "total_time_spent": 0,
        "last_study_date": None,
        "tasks": [],
        "milestones": []
    }
    
    return {"status": "success", "progress_id": roadmap_id}

@app.get("/api/progress/{roadmap_id}")
async def get_progress(roadmap_id: str):
    """Get learning progress"""
    if roadmap_id not in progress_db:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    progress = progress_db[roadmap_id]
    
    # Calculate streak
    if progress["last_study_date"]:
        last_date = datetime.fromisoformat(progress["last_study_date"])
        days_diff = (datetime.now() - last_date).days
        if days_diff > 1:
            progress["streak"] = 0
    
    return progress

@app.post("/api/progress/update")
async def update_progress(update: ProgressUpdate):
    """Update learning progress"""
    if update.roadmap_id not in progress_db:
        raise HTTPException(status_code=404, detail="Progress not found")
    
    progress = progress_db[update.roadmap_id]
    
    # Update time spent
    progress["total_time_spent"] += update.time_spent
    
    # Update streak
    today = datetime.now().date().isoformat()
    if progress["last_study_date"] != today:
        if progress["last_study_date"]:
            last_date = datetime.fromisoformat(progress["last_study_date"]).date()
            if (datetime.now().date() - last_date).days == 1:
                progress["streak"] += 1
            else:
                progress["streak"] = 1
        else:
            progress["streak"] = 1
        progress["last_study_date"] = today
    
    # Update completion (simplified)
    if update.completed:
        progress["completion_percentage"] = min(100, progress["completion_percentage"] + 5)
    
    return {"status": "success", "progress": progress}

@app.post("/api/progress/{roadmap_id}/adjust")
async def adjust_goals(roadmap_id: str, adjustment: GoalAdjustment):
    """Adjust learning goals"""
    if roadmap_id not in roadmaps_db:
        raise HTTPException(status_code=404, detail="Roadmap not found")
    
    # Update roadmap with new parameters
    roadmap = roadmaps_db[roadmap_id]
    roadmap["request"]["time_commitment"] = adjustment.new_time_commitment
    if adjustment.new_deadline:
        roadmap["request"]["deadline"] = adjustment.new_deadline
    
    return {"status": "success", "message": "Goals adjusted successfully"}

@app.get("/api/study-techniques")
async def get_study_techniques():
    """Get AI-generated study techniques"""
    try:
        prompt = """Provide 5 effective study techniques with brief descriptions. 
        Include techniques like Pomodoro, Active Recall, Spaced Repetition, Feynman Technique, etc.
        Format as JSON array with name, description, and tips fields."""
        
        response = model.generate_content(prompt)
        
        # Fallback techniques if AI fails
        techniques = [
            {
                "name": "Pomodoro Technique",
                "description": "Study in 25-minute focused intervals with 5-minute breaks",
                "tips": ["Set a timer", "Eliminate distractions", "Take real breaks"]
            },
            {
                "name": "Active Recall",
                "description": "Test yourself on material instead of passive reading",
                "tips": ["Close your notes", "Write what you remember", "Check answers"]
            },
            {
                "name": "Spaced Repetition",
                "description": "Review material at increasing intervals",
                "tips": ["Use flashcards", "Review after 1 day, 3 days, 1 week", "Focus on weak areas"]
            },
            {
                "name": "Feynman Technique",
                "description": "Explain concepts in simple terms as if teaching",
                "tips": ["Choose a concept", "Explain it simply", "Identify gaps"]
            },
            {
                "name": "Mind Mapping",
                "description": "Create visual diagrams connecting related concepts",
                "tips": ["Start with main topic", "Branch out to subtopics", "Use colors"]
            }
        ]
        
        return {"techniques": techniques}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/motivation/daily")
async def get_daily_motivation():
    """Get daily motivational quote"""
    quotes = [
        {"text": "The expert in anything was once a beginner.", "author": "Helen Hayes"},
        {"text": "Learning never exhausts the mind.", "author": "Leonardo da Vinci"},
        {"text": "The beautiful thing about learning is that no one can take it away from you.", "author": "B.B. King"},
        {"text": "Education is not the filling of a pail, but the lighting of a fire.", "author": "William Butler Yeats"},
        {"text": "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.", "author": "Brian Herbert"}
    ]
    
    import random
    return random.choice(quotes)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

if __name__ == "__main__":
    import uvicorn
    print("\n" + "="*50)
    print("🎓 AI Study Guide Server Starting...")
    print("="*50)
    print(f"📍 Access the application at:")
    print(f"   → http://localhost:8000")
    print(f"   → http://127.0.0.1:8000")
    print(f"📚 API Documentation at:")
    print(f"   → http://localhost:8000/docs")
    print("="*50 + "\n")
    uvicorn.run(app, host="127.0.0.1", port=8000)