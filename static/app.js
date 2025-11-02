// ============================================
// APPLICATION STATE
// ============================================

const AppState = {
    currentMode: null,
    currentView: 'mode-selection',
    currentRoadmapId: null,
    chatHistory: [],
    timerInterval: null,
    timerSeconds: 1500, // 25 minutes
    sessionInterval: null,
    sessionSeconds: 0,
    progressData: null
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
    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('app').classList.remove('hidden');
    }, 1500);
    
    // Initialize event listeners
    setupModeSelection();
    setupChat();
    setupRoadmapGeneration();
    setupProgressDashboard();
    setupModals();
    setupTimer();
    loadDailyMotivation();
    
    // Set minimum date for deadline inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('deadline').setAttribute('min', today);
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
    
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
}

function startTimer() {
    if (AppState.timerInterval) return;
    
    AppState.timerInterval = setInterval(() => {
        if (AppState.timerSeconds > 0) {
            AppState.timerSeconds--;
            updateTimerDisplay();
        } else {
            pauseTimer();
            showCelebrationModal('Pomodoro Complete! 🍅', 'Great work! Time for a 5-minute break.');
            AppState.timerSeconds = 1500;
            updateTimerDisplay();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(AppState.timerInterval);
    AppState.timerInterval = null;
}

function resetTimer() {
    pauseTimer();
    AppState.timerSeconds = 1500;
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const minutes = Math.floor(AppState.timerSeconds / 60);
    const seconds = AppState.timerSeconds % 60;
    document.getElementById('timer-display').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// ============================================
// MODALS
// ============================================

function setupModals() {
    const celebrationClose = document.getElementById('celebration-close');
    const modalCancelBtns = document.querySelectorAll('.modal-cancel');
    const modalCloseBtns = document.querySelectorAll('.modal-close');
    const saveGoalChangesBtn = document.getElementById('save-goal-changes');
    
    celebrationClose.addEventListener('click', () => hideModal('celebration-modal'));
    
    modalCancelBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal.id);
        });
    });
    
    modalCloseBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal.id);
        });
    });
    
    saveGoalChangesBtn.addEventListener('click', saveGoalAdjustments);
    
    // Close modal on backdrop click
    document.querySelectorAll('.modal-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            hideModal(modal.id);
        });
    });
    
    // Setup goal adjustment modal slider
    const newTimeCommitment = document.getElementById('new-time-commitment');
    const newTimeValue = document.getElementById('new-time-value');
    
    newTimeCommitment.addEventListener('input', () => {
        newTimeValue.textContent = newTimeCommitment.value + ' hours/week';
    });
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