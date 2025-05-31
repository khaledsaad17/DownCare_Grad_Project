        // Emotions data
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

        // Game variables
        let currentEmotion;
        let score = 0;
        let attempts = 3;
        let bestScore = localStorage.getItem('bestScore') || 0;
        let usedEmotions = [];

        // DOM elements
        const startScreen = document.getElementById('startScreen');
        const gameArea = document.getElementById('gameArea');
        const gameOver = document.getElementById('gameOver');
        const startBtn = document.getElementById('startBtn');
        const restartBtn = document.getElementById('restartBtn');
        const emojiContainer = document.getElementById('emojiContainer');
        const optionsContainer = document.getElementById('optionsContainer');
        const feedback = document.getElementById('feedback');
        const scoreElement = document.getElementById('score');
        const bestScoreElement = document.getElementById('bestScore');
        const finalScore = document.getElementById('finalScore');
        const finalBestScore = document.getElementById('finalBestScore');
        const attemptsContainer = document.getElementById('attemptsContainer');

        // Start game
        startBtn.addEventListener('click', () => {
            startScreen.classList.add('hidden');
            gameArea.classList.remove('hidden');
            resetGame();
            nextEmotion();
        });

        // Restart game
        restartBtn.addEventListener('click', () => {
            gameOver.classList.add('hidden');
            gameArea.classList.remove('hidden');
            resetGame();
            nextEmotion();
        });

        function resetGame() {
            score = 0;
            attempts = 3;
            usedEmotions = [];
            updateScore();
            updateAttempts();
        }

        function nextEmotion() {
            // If all emotions have been used, reset the usedEmotions array
            if (usedEmotions.length === emotions.length) {
                usedEmotions = [];
            }

            // Find an emotion that hasn't been used yet
            let availableEmotions = emotions.filter(emotion => !usedEmotions.includes(emotion));
            currentEmotion = availableEmotions[Math.floor(Math.random() * availableEmotions.length)];
            usedEmotions.push(currentEmotion);

            // Display the emoji
            emojiContainer.textContent = currentEmotion.emoji;

            // Clear previous options
            optionsContainer.innerHTML = '';

            // Shuffle options
            const shuffledOptions = [...currentEmotion.options].sort(() => Math.random() - 0.5);

            // Create option buttons
            shuffledOptions.forEach(option => {
                const button = document.createElement('button');
                button.className = 'option';
                button.textContent = option;
                button.addEventListener('click', () => checkAnswer(option));
                optionsContainer.appendChild(button);
            });

            // Clear feedback
            feedback.textContent = '';
            feedback.className = 'feedback';
        }

        function checkAnswer(selectedOption) {
            if (selectedOption === currentEmotion.name) {
                // Correct answer
                feedback.textContent = 'برافو عليك!';
                feedback.className = 'feedback correct';
                score++;
                updateScore();
                createConfetti();
                setTimeout(nextEmotion, 1500);
            } else {
                // Wrong answer
                feedback.textContent = 'للأسف غلط! جرب تانى';
                feedback.className = 'feedback incorrect';
                attempts--;
                updateAttempts();
                
                if (attempts === 0) {
                    // Game over
                    setTimeout(() => {
                        gameArea.classList.add('hidden');
                        gameOver.classList.remove('hidden');
                        finalScore.textContent = score;
                        finalBestScore.textContent = bestScore;
                    }, 1000);
                }
            }
        }

        function updateScore() {
            scoreElement.textContent = score;
            if (score > bestScore) {
                bestScore = score;
                localStorage.setItem('bestScore', bestScore);
                bestScoreElement.textContent = bestScore;
            }
        }

        function updateAttempts() {
            const hearts = attemptsContainer.querySelectorAll('.heart');
            hearts.forEach((heart, index) => {
                if (index < attempts) {
                    heart.style.visibility = 'visible';
                } else {
                    heart.style.visibility = 'hidden';
                }
            });
        }

        function createConfetti() {
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti';
                confetti.style.left = Math.random() * 100 + 'vw';
                confetti.style.backgroundColor = getRandomColor();
                confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
                document.body.appendChild(confetti);
                
                setTimeout(() => {
                    confetti.remove();
                }, 5000);
            }
        }

        function getRandomColor() {
            const colors = ['#FF5252', '#FFEB3B', '#4CAF50', '#2196F3', '#9C27B0', '#FF9800'];
            return colors[Math.floor(Math.random() * colors.length)];
        }