// ============================================
// APPLICATION STATE
// ============================================

const AppState = {
    currentMode: null,
    currentView: 'hero-page',
    currentRoadmapId: null,
    chatHistory: [],
    timerInterval: null,
    timerSeconds: 1500, // 25 minutes
    timerType: 'work', // work, short-break, long-break
    sessionInterval: null,
    sessionSeconds: 0,
    progressData: null,
    dailyGoals: [],
    completedGoals: 0,
    sessionsCompleted: 0,
    totalTimeToday: 0,
    timerSettings: {
        workDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        sessionsUntilLongBreak: 4,
        autoStartBreaks: false,
        notificationSound: true
    },
    preferences: {
        saveTheme: true,
        showWelcome: true
    }
};

// ============================================
// API CONFIGURATION
// ============================================

const API_BASE_URL = window.location.origin;

const API = {
    chat: async (message, mode) => {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message, mode })
        });
        return response.json();
    },
    
    generateRoadmap: async (data) => {
        const response = await fetch(`${API_BASE_URL}/api/roadmap/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    getRoadmap: async (roadmapId) => {
        const response = await fetch(`${API_BASE_URL}/api/roadmap/${roadmapId}`);
        return response.json();
    },
    
    selectTrack: async (roadmapId, trackType) => {
        const response = await fetch(`${API_BASE_URL}/api/roadmap/${roadmapId}/select`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ track_type: trackType })
        });
        return response.json();
    },
    
    getProgress: async (roadmapId) => {
        const response = await fetch(`${API_BASE_URL}/api/progress/${roadmapId}`);
        return response.json();
    },
    
    updateProgress: async (data) => {
        const response = await fetch(`${API_BASE_URL}/api/progress/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return response.json();
    },
    
    adjustGoals: async (roadmapId, data) => {
        const response = await fetch(`${API_BASE_URL}/api/progress/${roadmapId}/adjust`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ roadmap_id: roadmapId, ...data })
        });
        return response.json();
    },
    
    getStudyTechniques: async () => {
        const response = await fetch(`${API_BASE_URL}/api/study-techniques`);
        return response.json();
    },
    
    getDailyMotivation: async () => {
        const response = await fetch(`${API_BASE_URL}/api/motivation/daily`);
        return response.json();
    }
};

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Load saved preferences
    loadPreferences();
    
    // Check if we should show welcome screen
    const heroPage = document.getElementById('hero-page');
    const appPage = document.getElementById('app');
    const loadingScreen = document.getElementById('loading-screen');
    
    if (AppState.preferences.showWelcome && !sessionStorage.getItem('welcomed')) {
        setTimeout(() => {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            if (heroPage) heroPage.classList.remove('hidden');
        }, 1500);
    } else {
        // Skip to app
        setTimeout(() => {
            if (loadingScreen) loadingScreen.classList.add('hidden');
            if (appPage) appPage.classList.remove('hidden');
            if (AppState.currentMode) {
                navigateToView('chat-view');
            }
        }, 1500);
    }
    
    // Initialize event listeners
    setupHeroPage();
    setupModeSelection();
    setupChat();
    setupRoadmapGeneration();
    setupProgressDashboard();
    setupModals();
    setupTimer();
    setupDailyGoals();
    setupKeyboardShortcuts();
    setupSettings();
    loadDailyMotivation();
    loadDailyStats();
    
    // Set minimum date for deadline inputs
    const deadlineInput = document.getElementById('deadline');
    if (deadlineInput) {
        const today = new Date().toISOString().split('T')[0];
        deadlineInput.setAttribute('min', today);
    }
}

// ============================================
// HERO PAGE
// ============================================

function setupHeroPage() {
    const getStartedBtn = document.getElementById('get-started-btn');
    const skipIntroBtn = document.getElementById('skip-intro-btn');
    const learnMoreBtn = document.getElementById('learn-more-btn');
    const featureCards = document.querySelectorAll('.feature-card-mini');
    
    const startApp = () => {
        sessionStorage.setItem('welcomed', 'true');
        const heroPage = document.getElementById('hero-page');
        const appPage = document.getElementById('app');
        if (heroPage) heroPage.classList.add('hidden');
        if (appPage) appPage.classList.remove('hidden');
    };
    
    if (getStartedBtn) {
        getStartedBtn.addEventListener('click', startApp);
    }
    
    if (skipIntroBtn) {
        skipIntroBtn.addEventListener('click', startApp);
    }
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', () => {
            // Scroll to feature cards section
            const featuresSection = document.querySelector('.hero-visual-section');
            if (featuresSection) {
                featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Make feature cards clickable
    featureCards.forEach(card => {
        card.addEventListener('click', startApp);
    });
    
    // Setup home button and clickable logo
    setupHomeNavigation();
}

// ============================================
// HOME NAVIGATION
// ============================================

function setupHomeNavigation() {
    const homeLogo = document.getElementById('home-logo');
    const homeBtn = document.getElementById('home-btn');
    
    const goToHome = () => {
        const heroPage = document.getElementById('hero-page');
        const appPage = document.getElementById('app');
        
        if (heroPage && appPage) {
            appPage.classList.add('hidden');
            heroPage.classList.remove('hidden');
            sessionStorage.removeItem('welcomed');
            
            // Reset to initial view
            navigateToView('mode-selection');
            
            // Clear chat if needed
            const chatMessages = document.getElementById('chat-messages');
            if (chatMessages) {
                // Optionally clear chat history
                // chatMessages.innerHTML = '';
            }
        }
    };
    
    if (homeLogo) {
        homeLogo.addEventListener('click', goToHome);
        homeLogo.style.cursor = 'pointer';
    }
    
    if (homeBtn) {
        homeBtn.addEventListener('click', goToHome);
    }
}

// ============================================
// PREFERENCES & LOCAL STORAGE
// ============================================

function loadPreferences() {
    const savedMode = localStorage.getItem('studyMentorMode');
    const savedTheme = localStorage.getItem('saveTheme');
    const savedWelcome = localStorage.getItem('showWelcome');
    const savedTimerSettings = localStorage.getItem('timerSettings');
    const savedGoals = localStorage.getItem('dailyGoals');
    const savedStats = localStorage.getItem('dailyStats');
    
    if (savedMode && savedTheme !== 'false') {
        AppState.currentMode = savedMode;
        document.body.className = savedMode === 'focus' ? 'focus-mode' : 'friendly-mode';
    }
    
    if (savedWelcome !== null) {
        AppState.preferences.showWelcome = savedWelcome === 'true';
    }
    
    if (savedTimerSettings) {
        AppState.timerSettings = JSON.parse(savedTimerSettings);
        AppState.timerSeconds = AppState.timerSettings.workDuration * 60;
    }
    
    if (savedGoals) {
        const goalsData = JSON.parse(savedGoals);
        const today = new Date().toDateString();
        if (goalsData.date === today) {
            AppState.dailyGoals = goalsData.goals;
            updateGoalsDisplay();
        }
    }
    
    if (savedStats) {
        const statsData = JSON.parse(savedStats);
        const today = new Date().toDateString();
        if (statsData.date === today) {
            AppState.sessionsCompleted = statsData.sessions;
            AppState.totalTimeToday = statsData.totalTime;
        }
    }
}

function savePreferences() {
    if (AppState.preferences.saveTheme && AppState.currentMode) {
        localStorage.setItem('studyMentorMode', AppState.currentMode);
    }
    localStorage.setItem('saveTheme', AppState.preferences.saveTheme);
    localStorage.setItem('showWelcome', AppState.preferences.showWelcome);
}

function saveDailyGoals() {
    const goalsData = {
        date: new Date().toDateString(),
        goals: AppState.dailyGoals
    };
    localStorage.setItem('dailyGoals', JSON.stringify(goalsData));
}

function saveDailyStats() {
    const statsData = {
        date: new Date().toDateString(),
        sessions: AppState.sessionsCompleted,
        totalTime: AppState.totalTimeToday
    };
    localStorage.setItem('dailyStats', JSON.stringify(statsData));
}

function loadDailyStats() {
    updateStatsDisplay();
}

function updateStatsDisplay() {
    const sessionsToday = document.getElementById('sessions-today');
    const totalTimeToday = document.getElementById('total-time-today');
    
    if (sessionsToday) {
        sessionsToday.textContent = AppState.sessionsCompleted;
    }
    
    if (totalTimeToday) {
        const hours = Math.floor(AppState.totalTimeToday / 60);
        const minutes = AppState.totalTimeToday % 60;
        totalTimeToday.textContent = `${hours}h ${minutes}m`;
    }
}

// ============================================
// MODE SELECTION
// ============================================

function setupModeSelection() {
    const modeCards = document.querySelectorAll('.mode-card');
    const modeToggle = document.getElementById('mode-toggle');
    
    modeCards.forEach(card => {
        const selectBtn = card.querySelector('.mode-select-btn');
        selectBtn.addEventListener('click', () => {
            const mode = card.dataset.mode;
            selectMode(mode);
        });
    });
    
    modeToggle.addEventListener('click', toggleMode);
}

function selectMode(mode) {
    AppState.currentMode = mode;
    document.body.className = mode === 'focus' ? 'focus-mode' : 'friendly-mode';
    
    // Save preference
    savePreferences();
    
    // Update mode toggle button
    const modeToggle = document.getElementById('mode-toggle');
    const modeIcon = modeToggle.querySelector('.mode-icon');
    const modeText = modeToggle.querySelector('.mode-text');
    
    if (mode === 'focus') {
        modeIcon.textContent = '🌙';
        modeText.textContent = 'Focus Mode';
    } else {
        modeIcon.textContent = '☀️';
        modeText.textContent = 'Friendly Mode';
    }
    
    // Navigate to chat view
    navigateToView('chat-view');
    
    // Send welcome message
    addChatMessage('assistant', getWelcomeMessage(mode));
}

function toggleMode() {
    const newMode = AppState.currentMode === 'focus' ? 'friendly' : 'focus';
    selectMode(newMode);
}

function getWelcomeMessage(mode) {
    if (mode === 'focus') {
        return "Focus Mode activated. I'm here to help you learn efficiently. What would you like to work on today?";
    } else {
        return "Welcome to your learning journey! 🎉 I'm excited to help you achieve your goals. What would you like to learn today?";
    }
}

// ============================================
// NAVIGATION
// ============================================

function navigateToView(viewId) {
    // Hide all views
    document.querySelectorAll('.view').forEach(view => {
        view.classList.add('hidden');
    });
    
    // Show selected view
    document.getElementById(viewId).classList.remove('hidden');
    AppState.currentView = viewId;
}

// ============================================
// CHAT FUNCTIONALITY
// ============================================

function setupChat() {
    const chatInput = document.getElementById('chat-input');
    const sendBtn = document.getElementById('send-btn');
    const voiceBtn = document.getElementById('voice-input-btn');
    
    // Auto-resize textarea
    chatInput.addEventListener('input', () => {
        chatInput.style.height = 'auto';
        chatInput.style.height = chatInput.scrollHeight + 'px';
        sendBtn.disabled = chatInput.value.trim() === '';
    });
    
    // Send message on Enter (Shift+Enter for new line)
    chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    sendBtn.addEventListener('click', sendMessage);
    
    // Voice input (placeholder - requires Web Speech API)
    voiceBtn.addEventListener('click', () => {
        addChatMessage('assistant', 'Voice input feature coming soon! 🎤');
    });
    
    // Quick action buttons
    document.querySelectorAll('.quick-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            handleQuickAction(action);
        });
    });
}

async function sendMessage() {
    const chatInput = document.getElementById('chat-input');
    const message = chatInput.value.trim();
    
    if (!message) return;
    
    // Add user message to chat
    addChatMessage('user', message);
    chatInput.value = '';
    chatInput.style.height = 'auto';
    document.getElementById('send-btn').disabled = true;
    
    // Show typing indicator
    showTypingIndicator();
    
    try {
        // Get AI response
        const response = await API.chat(message, AppState.currentMode);
        
        // Hide typing indicator
        hideTypingIndicator();
        
        // Add assistant message
        addChatMessage('assistant', response.response);
        
        // Store in history
        AppState.chatHistory.push(
            { role: 'user', content: message },
            { role: 'assistant', content: response.response }
        );
    } catch (error) {
        hideTypingIndicator();
        addChatMessage('assistant', 'Sorry, I encountered an error. Please try again.');
        console.error('Chat error:', error);
    }
}

function addChatMessage(role, content) {
    const messagesContainer = document.getElementById('chat-messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${role}`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = role === 'user' ? '👤' : '🤖';
    
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    
    // Use marked.js to parse markdown if available
    if (typeof marked !== 'undefined') {
        messageContent.innerHTML = marked.parse(content);
    } else {
        messageContent.textContent = content;
    }
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(messageContent);
    messagesContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showTypingIndicator() {
    document.getElementById('typing-indicator').classList.remove('hidden');
}

function hideTypingIndicator() {
    document.getElementById('typing-indicator').classList.add('hidden');
}

function handleQuickAction(action) {
    switch (action) {
        case 'generate-roadmap':
            navigateToView('roadmap-generation');
            break;
        case 'view-progress':
            if (AppState.currentRoadmapId) {
                loadProgressDashboard();
                navigateToView('progress-dashboard');
            } else {
                addChatMessage('assistant', 'You haven\'t created a roadmap yet. Would you like to create one?');
            }
            break;
        case 'study-techniques':
            showStudyTechniques();
            break;
    }
}

async function showStudyTechniques() {
    try {
        const data = await API.getStudyTechniques();
        let message = '📚 **Effective Study Techniques:**\n\n';
        
        data.techniques.forEach((technique, index) => {
            message += `**${index + 1}. ${technique.name}**\n`;
            message += `${technique.description}\n`;
            message += `Tips: ${technique.tips.join(', ')}\n\n`;
        });
        
        addChatMessage('assistant', message);
    } catch (error) {
        addChatMessage('assistant', 'I can help you with study techniques! Ask me about Pomodoro, Active Recall, or Spaced Repetition.');
    }
}

// ============================================
// ROADMAP GENERATION
// ============================================

function setupRoadmapGeneration() {
    const roadmapForm = document.getElementById('roadmap-form');
    const backBtn = document.getElementById('back-to-chat');
    const timeCommitment = document.getElementById('time-commitment');
    const timeValue = document.getElementById('time-value');
    
    // Update time commitment display
    timeCommitment.addEventListener('input', () => {
        timeValue.textContent = timeCommitment.value;
    });
    
    // Form submission
    roadmapForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await generateRoadmap();
    });
    
    // Back button
    backBtn.addEventListener('click', () => {
        navigateToView('chat-view');
    });
}

async function generateRoadmap() {
    const generateBtn = document.getElementById('generate-roadmaps');
    generateBtn.disabled = true;
    generateBtn.textContent = 'Generating... 🔄';
    
    // Collect form data
    const learningStyles = Array.from(document.querySelectorAll('input[name="learning-style"]:checked'))
        .map(cb => cb.value);
    
    const budget = document.querySelector('input[name="budget"]:checked').value;
    
    const formData = {
        learning_goal: document.getElementById('learning-goal').value,
        time_commitment: parseInt(document.getElementById('time-commitment').value),
        skill_level: document.getElementById('skill-level').value,
        learning_styles: learningStyles,
        deadline: document.getElementById('deadline').value || null,
        budget: budget
    };
    
    try {
        const response = await API.generateRoadmap(formData);
        AppState.currentRoadmapId = response.roadmap_id;
        
        // Display roadmaps
        displayRoadmaps(response.roadmaps);
        
        // Show results section
        document.getElementById('roadmap-results').classList.remove('hidden');
        document.getElementById('roadmap-results').scrollIntoView({ behavior: 'smooth' });
        
    } catch (error) {
        console.error('Error generating roadmap:', error);
        alert('Failed to generate roadmap. Please try again.');
    } finally {
        generateBtn.disabled = false;
        generateBtn.textContent = 'Generate My Roadmaps 🚀';
    }
}

function displayRoadmaps(roadmaps) {
    const container = document.getElementById('roadmap-comparison');
    container.innerHTML = '';
    
    Object.entries(roadmaps).forEach(([key, roadmap]) => {
        const card = createRoadmapCard(key, roadmap);
        container.appendChild(card);
    });
}

function createRoadmapCard(trackType, roadmap) {
    const card = document.createElement('div');
    card.className = 'roadmap-card';
    card.dataset.trackType = trackType;
    
    card.innerHTML = `
        <h3>${roadmap.title}</h3>
        <div class="roadmap-meta">
            <p><strong>Duration:</strong> ${roadmap.duration}</p>
            <p><strong>Time per week:</strong> ${roadmap.hours_per_week} hours</p>
            <p>${roadmap.description}</p>
        </div>
        <div class="roadmap-phases">
            <h4>Learning Phases:</h4>
            <ul>
                ${roadmap.phases.map(phase => `
                    <li>
                        <strong>${phase.name}</strong> (${phase.duration})
                        <br>
                        <small>${phase.topics.join(', ')}</small>
                    </li>
                `).join('')}
            </ul>
        </div>
        <button class="btn btn--primary btn--full-width select-roadmap-btn">
            Select This Track
        </button>
    `;
    
    card.querySelector('.select-roadmap-btn').addEventListener('click', async () => {
        await selectRoadmap(trackType, roadmap);
    });
    
    return card;
}

async function selectRoadmap(trackType, roadmap) {
    try {
        await API.selectTrack(AppState.currentRoadmapId, trackType);
        
        // Show celebration
        showCelebrationModal('Roadmap Selected! 🎉', 'Your personalized learning path is ready. Let\'s start your journey!');
        
        // Navigate to progress dashboard
        setTimeout(() => {
            loadProgressDashboard();
            navigateToView('progress-dashboard');
        }, 2000);
        
    } catch (error) {
        console.error('Error selecting roadmap:', error);
        alert('Failed to select roadmap. Please try again.');
    }
}

// ============================================
// PROGRESS DASHBOARD
// ============================================

function setupProgressDashboard() {
    const startSessionBtn = document.getElementById('start-session');
    const endSessionBtn = document.getElementById('end-session');
    const logTimeBtn = document.getElementById('log-time');
    const adjustGoalsBtn = document.getElementById('adjust-goals');
    const getHelpBtn = document.getElementById('get-help');
    const continueBtn = document.getElementById('continue-learning');
    
    startSessionBtn.addEventListener('click', startStudySession);
    endSessionBtn.addEventListener('click', endStudySession);
    logTimeBtn.addEventListener('click', logManualTime);
    adjustGoalsBtn.addEventListener('click', () => showModal('goal-adjustment-modal'));
    getHelpBtn.addEventListener('click', () => {
        navigateToView('chat-view');
        addChatMessage('assistant', 'I\'m here to help! What questions do you have about your learning journey?');
    });
    continueBtn.addEventListener('click', () => navigateToView('chat-view'));
}

async function loadProgressDashboard() {
    if (!AppState.currentRoadmapId) return;
    
    try {
        const progress = await API.getProgress(AppState.currentRoadmapId);
        AppState.progressData = progress;
        
        // Update stats
        document.getElementById('completion-percentage').textContent = progress.completion_percentage + '%';
        document.getElementById('current-streak').textContent = progress.streak;
        
        // Create progress chart
        createProgressChart(progress);
        
        // Load tasks
        loadDailyTasks();
        
        // Load milestones
        loadMilestones();
        
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

function createProgressChart(progress) {
    const ctx = document.getElementById('progress-chart').getContext('2d');
    
    // Destroy existing chart if any
    if (window.progressChart) {
        window.progressChart.destroy();
    }
    
    window.progressChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Current'],
            datasets: [{
                label: 'Progress %',
                data: [0, 15, 25, 30, progress.completion_percentage],
                borderColor: '#4a9eff',
                backgroundColor: 'rgba(74, 158, 255, 0.1)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

function loadDailyTasks() {
    const tasksContainer = document.getElementById('daily-tasks');
    tasksContainer.innerHTML = '';
    
    const sampleTasks = [
        { id: 1, text: 'Complete tutorial section', completed: false },
        { id: 2, text: 'Practice coding exercises', completed: false },
        { id: 3, text: 'Review yesterday\'s material', completed: false }
    ];
    
    sampleTasks.forEach(task => {
        const taskElement = document.createElement('div');
        taskElement.className = 'task-item';
        taskElement.innerHTML = `
            <input type="checkbox" id="task-${task.id}" ${task.completed ? 'checked' : ''}>
            <label for="task-${task.id}">${task.text}</label>
        `;
        
        taskElement.querySelector('input').addEventListener('change', (e) => {
            handleTaskCompletion(task.id, e.target.checked);
        });
        
        tasksContainer.appendChild(taskElement);
    });
}

function loadMilestones() {
    const timelineContainer = document.getElementById('milestone-timeline');
    timelineContainer.innerHTML = '';
    
    const sampleMilestones = [
        { name: 'Completed Basics', date: '2 weeks ago', completed: true },
        { name: 'First Project', date: '1 week ago', completed: true },
        { name: 'Advanced Concepts', date: 'In Progress', completed: false },
        { name: 'Final Project', date: 'Upcoming', completed: false }
    ];
    
    sampleMilestones.forEach(milestone => {
        const milestoneElement = document.createElement('div');
        milestoneElement.className = `milestone-item ${milestone.completed ? 'completed' : ''}`;
        milestoneElement.innerHTML = `
            <div class="milestone-marker">${milestone.completed ? '✓' : '○'}</div>
            <div class="milestone-content">
                <h4>${milestone.name}</h4>
                <p>${milestone.date}</p>
            </div>
        `;
        timelineContainer.appendChild(milestoneElement);
    });
}

async function handleTaskCompletion(taskId, completed) {
    try {
        await API.updateProgress({
            roadmap_id: AppState.currentRoadmapId,
            task_id: taskId.toString(),
            completed: completed,
            time_spent: 0
        });
        
        if (completed) {
            showCelebrationModal('Task Completed! 🎉', 'Great work! Keep up the momentum!');
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// ============================================
// STUDY SESSION TRACKING
// ============================================

function startStudySession() {
    AppState.sessionSeconds = 0;
    AppState.sessionInterval = setInterval(() => {
        AppState.sessionSeconds++;
        updateSessionDisplay();
    }, 1000);
    
    document.getElementById('start-session').disabled = true;
    document.getElementById('end-session').disabled = false;
}

function endStudySession() {
    clearInterval(AppState.sessionInterval);
    
    // Log the time
    logTime(AppState.sessionSeconds);
    
    document.getElementById('start-session').disabled = false;
    document.getElementById('end-session').disabled = true;
    document.getElementById('session-time').textContent = '00:00';
    AppState.sessionSeconds = 0;
}

function updateSessionDisplay() {
    const hours = Math.floor(AppState.sessionSeconds / 3600);
    const minutes = Math.floor((AppState.sessionSeconds % 3600) / 60);
    const seconds = AppState.sessionSeconds % 60;
    
    const display = hours > 0 
        ? `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
        : `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('session-time').textContent = display;
}

function logManualTime() {
    const hours = parseInt(document.getElementById('manual-hours').value) || 0;
    const minutes = parseInt(document.getElementById('manual-minutes').value) || 0;
    const totalSeconds = (hours * 3600) + (minutes * 60);
    
    if (totalSeconds > 0) {
        logTime(totalSeconds);
        document.getElementById('manual-hours').value = '';
        document.getElementById('manual-minutes').value = '';
    }
}

async function logTime(seconds) {
    try {
        await API.updateProgress({
            roadmap_id: AppState.currentRoadmapId,
            task_id: 'session',
            completed: false,
            time_spent: Math.floor(seconds / 60) // Convert to minutes
        });
        
        // Reload progress
        await loadProgressDashboard();
        
        showCelebrationModal('Time Logged! ⏱️', `Great session! You studied for ${Math.floor(seconds / 60)} minutes.`);
    } catch (error) {
        console.error('Error logging time:', error);
    }
}

// ============================================
// POMODORO TIMER
// ============================================

function setupTimer() {
    const startBtn = document.getElementById('timer-start');
    const pauseBtn = document.getElementById('timer-pause');
    const resetBtn = document.getElementById('timer-reset');
    const settingsBtn = document.getElementById('timer-settings-btn');
    
    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (pauseBtn) pauseBtn.addEventListener('click', pauseTimer);
    if (resetBtn) resetBtn.addEventListener('click', resetTimer);
    if (settingsBtn) settingsBtn.addEventListener('click', () => showModal('timer-settings-modal'));
    
    updateTimerDisplay();
}

function startTimer() {
    if (AppState.timerInterval) return;
    
    AppState.timerInterval = setInterval(() => {
        if (AppState.timerSeconds > 0) {
            AppState.timerSeconds--;
            updateTimerDisplay();
        } else {
            timerComplete();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(AppState.timerInterval);
    AppState.timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    AppState.timerSeconds = AppState.timerSettings.workDuration * 60;
    AppState.timerType = 'work';
    updateTimerDisplay();
}

function timerComplete() {
    pauseTimer();
    
    // Play notification sound if enabled
    if (AppState.timerSettings.notificationSound) {
        playNotificationSound();
    }
    
    if (AppState.timerType === 'work') {
        // Work session completed
        AppState.sessionsCompleted++;
        AppState.totalTimeToday += AppState.timerSettings.workDuration;
        saveDailyStats();
        updateStatsDisplay();
        
        // Determine break type
        const isLongBreak = AppState.sessionsCompleted % AppState.timerSettings.sessionsUntilLongBreak === 0;
        AppState.timerType = isLongBreak ? 'long-break' : 'short-break';
        AppState.timerSeconds = isLongBreak ? 
            AppState.timerSettings.longBreak * 60 : 
            AppState.timerSettings.shortBreak * 60;
        
        showCelebrationModal(
            '🎉 Work Session Complete!',
            `Great focus! Time for a ${isLongBreak ? 'long' : 'short'} break.`
        );
        
        if (AppState.timerSettings.autoStartBreaks) {
            setTimeout(() => startTimer(), 2000);
        }
    } else {
        // Break completed
        AppState.timerType = 'work';
        AppState.timerSeconds = AppState.timerSettings.workDuration * 60;
        
        showCelebrationModal(
            '⏰ Break Over!',
            'Ready to get back to work? Let\'s stay productive!'
        );
        
        if (AppState.timerSettings.autoStartBreaks) {
            setTimeout(() => startTimer(), 2000);
        }
    }
    
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timer-display');
    const timerType = document.getElementById('timer-type');
    
    if (timerDisplay) {
        const minutes = Math.floor(AppState.timerSeconds / 60);
        const seconds = AppState.timerSeconds % 60;
        timerDisplay.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (timerType) {
        const typeText = AppState.timerType === 'work' ? 'Work Session' :
                         AppState.timerType === 'short-break' ? 'Short Break' : 'Long Break';
        timerType.textContent = typeText;
    }
}

function playNotificationSound() {
    // Create a simple beep sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
    } catch (e) {
        console.log('Audio notification not supported');
    }
}

// ============================================
// DAILY GOALS
// ============================================

function setupDailyGoals() {
    const addGoalBtn = document.getElementById('add-goal-btn');
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', () => showModal('add-goal-modal'));
    }
    
    updateGoalsDisplay();
}

function updateGoalsDisplay() {
    const goalsList = document.getElementById('daily-goals-list');
    const goalsCompleted = document.getElementById('goals-completed');
    const goalsTotal = document.getElementById('goals-total');
    
    goalsList.innerHTML = '';
    
    AppState.dailyGoals.forEach((goal, index) => {
        const goalItem = document.createElement('div');
        goalItem.className = `goal-item ${goal.completed ? 'completed' : ''}`;
        
        goalItem.innerHTML = `
            <input type="checkbox" class="goal-checkbox" ${goal.completed ? 'checked' : ''} data-index="${index}">
            <span class="goal-text">${goal.text}</span>
            <span class="goal-time">${goal.time}m</span>
            <button class="goal-delete" data-index="${index}">×</button>
        `;
        
        goalItem.querySelector('.goal-checkbox').addEventListener('change', (e) => {
            toggleGoal(index, e.target.checked);
        });
        
        goalItem.querySelector('.goal-delete').addEventListener('click', () => {
            deleteGoal(index);
        });
        
        goalsList.appendChild(goalItem);
    });
    
    const completed = AppState.dailyGoals.filter(g => g.completed).length;
    const total = AppState.dailyGoals.length;
    
    goalsCompleted.textContent = completed;
    goalsTotal.textContent = total;
    
    // Update progress ring
    const progressRing = document.querySelector('.progress-ring-circle');
    const circumference = 2 * Math.PI * 52;
    const progress = total > 0 ? (completed / total) : 0;
    const offset = circumference - (progress * circumference);
    progressRing.style.strokeDashoffset = offset;
}

function addGoal(text, time) {
    AppState.dailyGoals.push({
        text: text,
        time: parseInt(time),
        completed: false,
        createdAt: new Date().toISOString()
    });
    saveDailyGoals();
    updateGoalsDisplay();
}

function toggleGoal(index, completed) {
    AppState.dailyGoals[index].completed = completed;
    saveDailyGoals();
    updateGoalsDisplay();
    
    if (completed) {
        const allCompleted = AppState.dailyGoals.every(g => g.completed);
        if (allCompleted && AppState.dailyGoals.length > 0) {
            setTimeout(() => {
                showCelebrationModal(
                    '🎊 All Goals Completed!',
                    'Amazing work! You\'ve completed all your goals for today!'
                );
            }, 300);
        }
    }
}

function deleteGoal(index) {
    AppState.dailyGoals.splice(index, 1);
    saveDailyGoals();
    updateGoalsDisplay();
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+K - Focus chat input
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            if (AppState.currentView === 'chat-view') {
                document.getElementById('chat-input').focus();
            }
        }
        
        // Ctrl+T - Toggle timer
        if (e.ctrlKey && e.key === 't') {
            e.preventDefault();
            if (AppState.timerInterval) {
                pauseTimer();
            } else {
                startTimer();
            }
        }
        
        // Ctrl+M - Toggle mode
        if (e.ctrlKey && e.key === 'm') {
            e.preventDefault();
            toggleMode();
        }
        
        // Ctrl+G - Add goal
        if (e.ctrlKey && e.key === 'g') {
            e.preventDefault();
            showModal('add-goal-modal');
        }
    });
}

// ============================================
// SETTINGS
// ============================================

function setupSettings() {
    const settingsBtn = document.getElementById('settings-btn');
    const saveTimerSettingsBtn = document.getElementById('save-timer-settings');
    const saveGoalBtn = document.getElementById('save-goal-btn');
    const exportDataBtn = document.getElementById('export-data-btn');
    const clearDataBtn = document.getElementById('clear-data-btn');
    
    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => showModal('settings-modal'));
    }
    
    if (saveTimerSettingsBtn) {
        saveTimerSettingsBtn.addEventListener('click', saveTimerSettings);
    }
    
    if (saveGoalBtn) {
        saveGoalBtn.addEventListener('click', saveGoal);
    }
    
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', exportData);
    }
    
    if (clearDataBtn) {
        clearDataBtn.addEventListener('click', clearAllData);
    }
}

function saveTimerSettings() {
    AppState.timerSettings.workDuration = parseInt(document.getElementById('work-duration').value);
    AppState.timerSettings.shortBreak = parseInt(document.getElementById('short-break').value);
    AppState.timerSettings.longBreak = parseInt(document.getElementById('long-break').value);
    AppState.timerSettings.sessionsUntilLongBreak = parseInt(document.getElementById('sessions-until-long-break').value);
    AppState.timerSettings.autoStartBreaks = document.getElementById('auto-start-breaks').checked;
    AppState.timerSettings.notificationSound = document.getElementById('notification-sound').checked;
    
    localStorage.setItem('timerSettings', JSON.stringify(AppState.timerSettings));
    
    // Reset timer to new work duration
    resetTimer();
    
    hideModal('timer-settings-modal');
    showCelebrationModal('✅ Settings Saved', 'Timer settings updated successfully!');
}

function saveGoal() {
    const goalText = document.getElementById('goal-input').value.trim();
    const goalTime = document.getElementById('goal-time').value;
    
    if (goalText) {
        addGoal(goalText, goalTime);
        document.getElementById('goal-input').value = '';
        document.getElementById('goal-time').value = '30';
        hideModal('add-goal-modal');
    }
}

function exportData() {
    const data = {
        goals: AppState.dailyGoals,
        stats: {
            sessions: AppState.sessionsCompleted,
            totalTime: AppState.totalTimeToday,
            date: new Date().toDateString()
        },
        timerSettings: AppState.timerSettings,
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-mentor-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    
    URL.revokeObjectURL(url);
}

function clearAllData() {
    if (confirm('Are you sure you want to clear all data? This cannot be undone.')) {
        localStorage.clear();
        sessionStorage.clear();
        location.reload();
    }
}

// ============================================
// MODALS
// ============================================

function setupModals() {
    const celebrationClose = document.getElementById('celebration-close');
    const modalCancelBtns = document.querySelectorAll('.modal-cancel');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const saveGoalChangesBtn = document.getElementById('save-goal-changes');
    
    if (celebrationClose) {
        celebrationClose.addEventListener('click', () => hideModal('celebration-modal'));
    }
    
    modalCancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) hideModal(modal.id);
        });
    });
    
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) hideModal(modal.id);
        });
    });
    
    if (saveGoalChangesBtn) {
        saveGoalChangesBtn.addEventListener('click', saveGoalAdjustments);
    }
    
    // Close modal on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) hideModal(modal.id);
        });
    });
    
    // Setup goal adjustment modal slider
    const newTimeCommitment = document.getElementById('new-time-commitment');
    const newTimeValue = document.getElementById('new-time-value');
    
    if (newTimeCommitment && newTimeValue) {
        newTimeCommitment.addEventListener('input', () => {
            newTimeValue.textContent = newTimeCommitment.value + ' hours/week';
        });
    }
    
    // Load timer settings into modal
    const workDuration = document.getElementById('work-duration');
    const shortBreak = document.getElementById('short-break');
    const longBreak = document.getElementById('long-break');
    const sessionsUntilLongBreak = document.getElementById('sessions-until-long-break');
    const autoStartBreaks = document.getElementById('auto-start-breaks');
    const notificationSound = document.getElementById('notification-sound');
    
    if (workDuration) workDuration.value = AppState.timerSettings.workDuration;
    if (shortBreak) shortBreak.value = AppState.timerSettings.shortBreak;
    if (longBreak) longBreak.value = AppState.timerSettings.longBreak;
    if (sessionsUntilLongBreak) sessionsUntilLongBreak.value = AppState.timerSettings.sessionsUntilLongBreak;
    if (autoStartBreaks) autoStartBreaks.checked = AppState.timerSettings.autoStartBreaks;
    if (notificationSound) notificationSound.checked = AppState.timerSettings.notificationSound;
}

function showModal(modalId) {
    document.getElementById(modalId).classList.remove('hidden');
}

function hideModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
}

function showCelebrationModal(title, message) {
    document.getElementById('celebration-title').textContent = title;
    document.getElementById('celebration-message').textContent = message;
    showModal('celebration-modal');
}

async function saveGoalAdjustments() {
    const newTimeCommitment = parseInt(document.getElementById('new-time-commitment').value);
    const newDeadline = document.getElementById('new-deadline').value;
    
    try {
        await API.adjustGoals(AppState.currentRoadmapId, {
            new_time_commitment: newTimeCommitment,
            new_deadline: newDeadline || null
        });
        
        hideModal('goal-adjustment-modal');
        showCelebrationModal('Goals Updated! 🎯', 'Your learning plan has been adjusted to match your new schedule.');
        
        // Reload progress dashboard
        await loadProgressDashboard();
    } catch (error) {
        console.error('Error adjusting goals:', error);
        alert('Failed to update goals. Please try again.');
    }
}

// ============================================
// DAILY MOTIVATION
// ============================================

async function loadDailyMotivation() {
    try {
        const quote = await API.getDailyMotivation();
        document.getElementById('daily-quote').textContent = quote.text;
        document.querySelector('.quote-author').textContent = `- ${quote.author}`;
    } catch (error) {
        console.error('Error loading motivation:', error);
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// ============================================
// ERROR HANDLING
// ============================================

window.addEventListener('error', (event) => {
    console.error('Global error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason);
});