document.addEventListener('DOMContentLoaded', () => {

    const elements = {
        wordDisplay: document.getElementById('word-display'),
        lettersContainer: document.getElementById('letters-container'),
        checkBtn: document.getElementById('check-btn'),
        resetBtn: document.getElementById('reset-btn'),
        restartBtn: document.getElementById('restart-btn'),
        feedback: document.getElementById('feedback'),
        attemptsDisplay: document.getElementById('attempts'),
        scoreDisplay: document.getElementById('score'),
        bestScoreDisplay: document.getElementById('best-score'),
        gameOverScreen: document.getElementById('game-over'),
        finalScoreDisplay: document.getElementById('final-score'),
        currentImage: document.getElementById('current-image'),
        stars: document.querySelector('.stars'),
        container: document.querySelector('.container')
    };

    const words = [
        { word: "تفاح", image: "img/تفاحة.jpg" },
        { word: "قطة", image: "img/قطة.jpg" },
        { word: "كلب", image: "img/كلب.jpg" },
        { word: "زهرة", image: "img/زهرة.jpeg" },
        { word: "بيت", image: "img/منزل.jpeg" },
        { word: "سيارة", image: "img/سيارة.jpg" },
        { word: "شمس", image: "img/شمس.webp" },
        { word: "قمر", image: "img/قمر.jpg" },
        { word: "كتاب", image: "img/كتاب.png" },
        { word: "كرة", image: "img/كره.jpeg" }
    ];

    const state = {
        currentWord: '',
        scrambledWord: '',
        selectedLetters: [],
        attempts: 3,
        score: 0,
        bestScore: localStorage.getItem('bestScore') || 0,
        usedWords: []
    };

    function initGame() {
        let availableWords = words.filter(wordObj => !state.usedWords.includes(wordObj.word));
        if (availableWords.length === 0) {
            availableWords = [...words];
            state.usedWords = [];
        }

        const { word, image } = availableWords[Math.floor(Math.random() * availableWords.length)];
        state.currentWord = word;
        state.usedWords.push(word);
        elements.currentImage.src = image;

        state.scrambledWord = shuffleWord(word);
        state.attempts = 3;
        state.selectedLetters = [];
        
        renderGame();
    }

    function shuffleWord(word) {
        return [...word].sort(() => Math.random() - 0.5).join('');
    }

    function renderGame() {
        elements.lettersContainer.innerHTML = '';
        elements.wordDisplay.textContent = '';
        elements.feedback.textContent = '';
        elements.feedback.className = 'feedback';
        elements.attemptsDisplay.textContent = state.attempts;
        elements.gameOverScreen.style.display = 'none';
        elements.checkBtn.disabled = false;
        elements.resetBtn.disabled = false;

        [...state.scrambledWord].forEach((letter, index) => {
            const letterElement = document.createElement('div');
            letterElement.className = 'letter';
            letterElement.textContent = letter;
            letterElement.dataset.index = index;
            letterElement.addEventListener('click', () => toggleLetterSelection(letterElement));
            elements.lettersContainer.appendChild(letterElement);
        });
    }

    function toggleLetterSelection(letterElement) {
        const letter = letterElement.textContent;
        letterElement.classList.toggle('selected');
        
        if (letterElement.classList.contains('selected')) {
            state.selectedLetters.push(letter);
        } else {
            state.selectedLetters = state.selectedLetters.filter(l => l !== letter);
        }
        
        elements.wordDisplay.textContent = state.selectedLetters.join('');
    }

    function checkAnswer() {
        const userWord = elements.wordDisplay.textContent;
        
        if (userWord === state.currentWord) {
            handleCorrectAnswer();
        } else {
            handleWrongAnswer();
        }
    }

    function handleCorrectAnswer() {
        state.score++;
        elements.scoreDisplay.textContent = state.score;
        
        if (state.score > state.bestScore) {
            state.bestScore = state.score;
            elements.bestScoreDisplay.textContent = state.bestScore;
            localStorage.setItem('bestScore', state.bestScore);
        }

        showFeedback('إجابة صحيحة! أحسنت!', 'correct');
        elements.checkBtn.disabled = true;
        elements.resetBtn.disabled = true;
        
        createConfetti();
        
        setTimeout(initGame, 2000);
    }

    function handleWrongAnswer() {
        state.attempts--;
        elements.attemptsDisplay.textContent = state.attempts;
        
        if (state.attempts <= 0) {
            endGame();
        } else {
            showFeedback('حاول مرة أخرى!', 'incorrect');
            shakeAnimation();
        }
    }

    function endGame() {
        elements.gameOverScreen.style.display = 'flex';
        elements.finalScoreDisplay.textContent = `نقاطك النهائية: ${state.score}`;
        elements.checkBtn.disabled = true;
        elements.resetBtn.disabled = true;
        animateStars(false);
    }

    function resetCurrentWord() {
        state.selectedLetters = [];
        elements.wordDisplay.textContent = '';
        showFeedback('', '');
        document.querySelectorAll('.letter').forEach(letter => {
            letter.classList.remove('selected');
        });
    }

    function showFeedback(message, type) {
        elements.feedback.textContent = message;
        elements.feedback.className = `feedback ${type}`;
    }

    function createConfetti() {
        const colors = ['#4169e1', '#ffd700', '#ff69b4', '#2e8b57', '#dc143c'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.cssText = `
                left: ${Math.random() * 100}%;
                background-color: ${colors[Math.floor(Math.random() * colors.length)]};
                width: ${Math.random() * 10 + 5}px;
                height: ${confetti.style.width};
                animation-duration: ${Math.random() * 3 + 2}s;
            `;
            elements.container.appendChild(confetti);
            setTimeout(() => confetti.remove(), 5000);
        }
    }

    function shakeAnimation() {
        elements.container.style.animation = 'shake 0.5s';
        setTimeout(() => elements.container.style.animation = '', 500);
    }
    const style = document.createElement('style');
    style.textContent = `
        @keyframes jump { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }
        @keyframes shake { 
            0%, 100% { transform: translateX(0); } 
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); } 
            20%, 40%, 60%, 80% { transform: translateX(10px); } 
        }
    `;
    document.head.appendChild(style);
    elements.checkBtn.addEventListener('click', checkAnswer);
    elements.resetBtn.addEventListener('click', resetCurrentWord);
    elements.restartBtn.addEventListener('click', () => {
        state.score = 0;
        elements.scoreDisplay.textContent = state.score;
        initGame();
    });

    initGame();
});