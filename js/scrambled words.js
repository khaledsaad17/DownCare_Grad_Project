        document.addEventListener('DOMContentLoaded', () => {
    // العناصر الرئيسية
    const wordDisplay = document.getElementById('word-display');
    const lettersContainer = document.getElementById('letters-container');
    const checkBtn = document.getElementById('check-btn');
    const resetBtn = document.getElementById('reset-btn');
    const restartBtn = document.getElementById('restart-btn');
    const feedback = document.getElementById('feedback');
    const attemptsDisplay = document.getElementById('attempts');
    const scoreDisplay = document.getElementById('score');
    const bestScoreDisplay = document.getElementById('best-score');
    const gameOverScreen = document.getElementById('game-over');
    const finalScoreDisplay = document.getElementById('final-score');
    const currentImage = document.getElementById('current-image');
    const stars = document.querySelector('.stars');
    
    // بيانات اللعبة
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
    
    let currentWord = '';
    let scrambledWord = '';
    let selectedLetters = [];
    let attempts = 3;
    let score = 0;
    let bestScore = localStorage.getItem('bestScore') || 0;
    let usedWords = [];
    
    // تهيئة اللعبة
    function initGame() {
        // اختيار كلمة عشوائية لم تستخدم من قبل
        let availableWords = words.filter(wordObj => !usedWords.includes(wordObj.word));
        if (availableWords.length === 0) {
            availableWords = [...words];
            usedWords = [];
        }
        
        const randomIndex = Math.floor(Math.random() * availableWords.length);
        currentWord = availableWords[randomIndex].word;
        currentImage.src = availableWords[randomIndex].image;
        usedWords.push(currentWord);
        
        // خلط الحروف
        scrambledWord = shuffleWord(currentWord);
        
        // عرض الكلمة المخلوطة
        displayScrambledWord();
        
        // إعادة تعيين المحاولات
        attempts = 3;
        attemptsDisplay.textContent = attempts;
        
        // إخفاء شاشة Game Over
        gameOverScreen.style.display = 'none';
        
        // مسح التعليقات السابقة
        feedback.textContent = '';
        feedback.className = 'feedback';
        
        // تفعيل الأزرار
        checkBtn.disabled = false;
        resetBtn.disabled = false;
        
        // إنشاء تأثير النجوم
        animateStars();
    }
    
    // خلط الكلمة
    function shuffleWord(word) {
        const letters = word.split('');
        for (let i = letters.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [letters[i], letters[j]] = [letters[j], letters[i]];
        }
        return letters.join('');
    }
    
    // عرض الكلمة المخلوطة
    function displayScrambledWord() {
        lettersContainer.innerHTML = '';
        selectedLetters = [];
        
        // إنشاء أزرار الحروف
        scrambledWord.split('').forEach((letter, index) => {
            const letterElement = document.createElement('div');
            letterElement.className = 'letter';
            letterElement.textContent = letter;
            letterElement.dataset.index = index;
            letterElement.addEventListener('click', () => selectLetter(letterElement));
            lettersContainer.appendChild(letterElement);
        });
        
        wordDisplay.textContent = '';
    }
    
    // اختيار حرف (تم التعديل هنا)
    function selectLetter(letterElement) {
        const letter = letterElement.textContent;
        
        if (letterElement.classList.contains('selected')) {
            // إلغاء التحديد
            letterElement.classList.remove('selected');
            const selectedIndex = selectedLetters.indexOf(letter);
            selectedLetters.splice(selectedIndex, 1);
        } else {
            // تحديد الحرف
            letterElement.classList.add('selected');
            selectedLetters.push(letter);
        }
        
        // تحديث عرض الكلمة المختارة
        updateWordDisplay();
    }
    
    // تحديث عرض الكلمة المختارة (تم التعديل هنا)
    function updateWordDisplay() {
        // عرض الكلمة المكونة حسب ترتيب النقر
        wordDisplay.textContent = selectedLetters.join('');
    }
    
    // التحقق من الإجابة
    function checkAnswer() {
        const userWord = wordDisplay.textContent;
        
        if (userWord === currentWord) {
            // الإجابة صحيحة
            feedback.textContent = 'إجابة صحيحة! أحسنت!';
            feedback.className = 'feedback correct';
            score++;
            scoreDisplay.textContent = score;
            
            // تحديث أفضل نتيجة
            if (score > bestScore) {
                bestScore = score;
                bestScoreDisplay.textContent = bestScore;
                localStorage.setItem('bestScore', bestScore);
            }
            
            // تعطيل الأزرار مؤقتًا
            checkBtn.disabled = true;
            resetBtn.disabled = true;
            
            // عرض تأثيرات النجاح
            createConfetti();
            animateStars(true);
            
            // الانتقال إلى الكلمة التالية بعد تأخير
            setTimeout(() => {
                initGame();
            }, 2000);
        } else {
            // الإجابة خاطئة
            attempts--;
            attemptsDisplay.textContent = attempts;
            
            if (attempts <= 0) {
                // انتهت المحاولات
                endGame();
            } else {
                feedback.textContent = 'حاول مرة أخرى!';
                feedback.className = 'feedback incorrect';
                shakeAnimation();
            }
        }
    }
    
    // إنهاء اللعبة
    function endGame() {
        gameOverScreen.style.display = 'flex';
        finalScoreDisplay.textContent = `نقاطك النهائية: ${score}`;
        checkBtn.disabled = true;
        resetBtn.disabled = true;
        
        // عرض تأثيرات الخسارة
        animateStars(false);
    }
    
    // إعادة تعيين الكلمة الحالية (تم التعديل هنا)
    function resetCurrentWord() {
        selectedLetters = [];
        wordDisplay.textContent = '';
        feedback.textContent = '';
        feedback.className = 'feedback';
        
        // إلغاء تحديد جميع الحروف
        document.querySelectorAll('.letter').forEach(letter => {
            letter.classList.remove('selected');
        });
    }
    
    // إنشاء تأثير الكونفيتي
    function createConfetti() {
        const colors = ['#4169e1', '#ffd700', '#ff69b4', '#2e8b57', '#dc143c'];
        
        for (let i = 0; i < 50; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.width = Math.random() * 10 + 5 + 'px';
            confetti.style.height = confetti.style.width;
            confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
            
            document.querySelector('.container').appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }
    
    // تأثير اهتزاز عند الخطأ
    function shakeAnimation() {
        const container = document.querySelector('.container');
        container.style.animation = 'shake 0.5s';
        
        setTimeout(() => {
            container.style.animation = '';
        }, 500);
    }
    
    // تأثير النجوم المتحركة
    function animateStars(isHappy = false) {
        stars.style.animation = 'none';
        void stars.offsetWidth; // Trigger reflow
        
        if (isHappy) {
            stars.style.animation = 'jump 0.5s';
            stars.textContent = '⭐⭐⭐⭐⭐';
        } else if (attempts <= 0) {
            stars.textContent = '⭐';
        } else {
            stars.textContent = '⭐'.repeat(attempts) + '☆'.repeat(3 - attempts);
        }
    }
    
    // إضافة أنيميشن القفز للنجوم
    const style = document.createElement('style');
    style.textContent = `
        @keyframes jump {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
        }
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
    `;
    document.head.appendChild(style);
    
    // معالجات الأحداث
    checkBtn.addEventListener('click', checkAnswer);
    resetBtn.addEventListener('click', resetCurrentWord);
    restartBtn.addEventListener('click', () => {
        score = 0;
        scoreDisplay.textContent = score;
        initGame();
    });
    
    // بدء اللعبة
    initGame();
});