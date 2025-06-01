const emotions = [
    { emoji: "😊", name: "فرحان", options: ["فرحان", "زعلان", "متعصب", "متفاجئ"] },
    { emoji: "😢", name: "زعلان", options: ["زعلان", "فرحان", "خايف", "نعسان"] },
    { emoji: "😠", name: "متعصب", options: ["متعصب", "فرحان", "جعان", "معرفش"] },
    { emoji: "😨", name: "خايف", options: ["خايف", "فرحان", "متعصب", "مندهش"] },
    { emoji: "😲", name: "مندهش", options: ["مندهش", "زعلان", "متعصب", "خايف"] },
    { emoji: "😴", name: "نعسان", options: ["نعسان", "فرحان", "متعصب", "جعان"] },
    { emoji: "😋", name: "جعان", options: ["جعان", "فرحان", "زعلان", "مندهش"] },
    { emoji: "😕", name: "معرفش", options: ["معرفش", "فرحان", "متعصب", "خايف"] },
    { emoji: "😍", name: "بحب", options: ["بحب", "زعلان", "متعصب", "مندهش"] },
    { emoji: "😎", name: "رائع", options: ["رائع", "زعلان", "خايف", "جعان"] },
    { emoji: "🤔", name: "بفكر", options: ["بفكر", "فرحان", "متعصب", "نعسان"] },
    { emoji: "🤗", name: "حضن", options: ["حضن", "زعلان", "متعصب", "خايف"] }
];

const elements = {
    startScreen: document.getElementById('startScreen'),
    gameArea: document.getElementById('gameArea'),
    gameOver: document.getElementById('gameOver'),
    emojiContainer: document.getElementById('emojiContainer'),
    optionsContainer: document.getElementById('optionsContainer'),
    feedback: document.getElementById('feedback'),
    scoreElement: document.getElementById('score'),
    bestScoreElement: document.getElementById('bestScore'),
    finalScore: document.getElementById('finalScore'),
    finalBestScore: document.getElementById('finalBestScore'),
    attemptsContainer: document.getElementById('attemptsContainer')
};

let state = {
    currentEmotion: null,
    score: 0,
    attempts: 3,
    bestScore: localStorage.getItem('bestScore') || 0,
    usedEmotions: []
};

document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', restartGame);

function startGame() {
    toggleScreens('startScreen', 'gameArea');
    resetGame();
    nextEmotion();
}

function restartGame() {
    toggleScreens('gameOver', 'gameArea');
    resetGame();
    nextEmotion();
}

function toggleScreens(hide, show) {
    elements[hide].classList.add('hidden');
    elements[show].classList.remove('hidden');
}

function resetGame() {
    state = { ...state, score: 0, attempts: 3, usedEmotions: [] };
    updateScore();
    updateAttempts();
}

function nextEmotion() {
    if (state.usedEmotions.length === emotions.length) state.usedEmotions = [];
    
    const availableEmotions = emotions.filter(e => !state.usedEmotions.includes(e));
    state.currentEmotion = availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
    state.usedEmotions.push(state.currentEmotion);
    
    elements.emojiContainer.textContent = state.currentEmotion.emoji;
    elements.optionsContainer.innerHTML = '';
    
    [...state.currentEmotion.options].sort(() => Math.random() - 0.5)
        .forEach(option => {
            const button = document.createElement('button');
            button.className = 'option';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option));
            elements.optionsContainer.appendChild(button);
        });
    
    elements.feedback.textContent = '';
    elements.feedback.className = 'feedback';
}

function checkAnswer(selectedOption) {
    if (selectedOption === state.currentEmotion.name) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

function handleCorrectAnswer() {
    elements.feedback.textContent = 'برافو عليك!';
    elements.feedback.className = 'feedback correct';
    state.score++;
    updateScore();
    createConfetti();
    setTimeout(nextEmotion, 1500);
}

function handleWrongAnswer() {
    elements.feedback.textContent = 'للأسف غلط! جرب تانى';
    elements.feedback.className = 'feedback incorrect';
    state.attempts--;
    updateAttempts();
    
    if (state.attempts === 0) {
        setTimeout(() => {
            toggleScreens('gameArea', 'gameOver');
            elements.finalScore.textContent = state.score;
            elements.finalBestScore.textContent = state.bestScore;
        }, 1000);
    }
}

function updateScore() {
    elements.scoreElement.textContent = state.score;
    if (state.score > state.bestScore) {
        state.bestScore = state.score;
        localStorage.setItem('bestScore', state.bestScore);
        elements.bestScoreElement.textContent = state.bestScore;
    }
}

function updateAttempts() {
    const hearts = elements.attemptsContainer.querySelectorAll('.heart');
    hearts.forEach((heart, i) => heart.style.visibility = i < state.attempts ? 'visible' : 'hidden');
}

function createConfetti() {
    const colors = ['#FF5252', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800'];
    
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = `${Math.random() * 100}vw`;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = `${Math.random() * 3 + 2}s`;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 5000);
    }
}