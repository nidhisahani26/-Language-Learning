 let languages = {
    spanish: [
        { word: "Hola", meaning: "Hello", category: "greetings" },
        { word: "Gracias", meaning: "Thank you", category: "basic" },
        { word: "Por favor", meaning: "Please", category: "basic" },
        { word: "De nada", meaning: "You're welcome", category: "greetings" },
        { word: "Agua", meaning: "Water", category: "food" }
    ],
    french: [
        { word: "Bonjour", meaning: "Hello", category: "greetings" },
        { word: "Merci", meaning: "Thank you", category: "basic" },
        { word: "S'il vous plaît", meaning: "Please", category: "basic" },
        { word: "Au revoir", meaning: "Goodbye", category: "greetings" },
        { word: "Pain", meaning: "Bread", category: "food" }
    ],
    german: [
        { word: "Hallo", meaning: "Hello", category: "greetings" },
        { word: "Danke", meaning: "Thank you", category: "basic" },
        { word: "Bitte", meaning: "Please", category: "basic" },
        { word: "Auf Wiedersehen", meaning: "Goodbye", category: "greetings" },
        { word: "Brot", meaning: "Bread", category: "food" }
    ]
};

let currentLanguage = 'spanish';
let currentCardIndex = 0;
let currentQuizIndex = 0;
let flipped = {};

window.addEventListener('load', function() {
    setupEventListeners();
    loadFromStorage();
    renderLearn();
});

function setupEventListeners() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentLanguage = this.dataset.lang;
            currentCardIndex = 0;
            flipped = {};
            renderLearn();
        });
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            switchTab(e.target.dataset.tab);
        });
    });
    
    document.getElementById('addWordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        addWord();
    });
}

function renderLearn() {
    const learnContent = document.getElementById('learnContent');
    const words = languages[currentLanguage];
    
    if (words.length === 0) {
        learnContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <p>No words added yet. Add some words to learn!</p>
            </div>
        `;
        return;
    }
    
    const word = words[currentCardIndex];
    const isFlipped = flipped[currentLanguage + currentCardIndex];
    
    let html = `
        <div class="vocab-card" onclick="toggleFlip()">
            <p class="card-label">${isFlipped ? '✅ Meaning' : '📖 Word'}</p>
            <p class="card-word">${isFlipped ? word.meaning : word.word}</p>
            ${isFlipped ? `<p class="card-meaning">(${word.category})</p>` : ''}
        </div>
        
        <div class="navigation">
            <button class="btn btn-secondary" ${currentCardIndex === 0 ? 'disabled' : ''} onclick="previousWord()">← Previous</button>
            <span>${currentCardIndex + 1} / ${words.length}</span>
            <button class="btn btn-secondary" ${currentCardIndex === words.length - 1 ? 'disabled' : ''} onclick="nextWord()">Next →</button>
        </div>
    `;
    
    learnContent.innerHTML = html;
}

function toggleFlip() {
    const key = currentLanguage + currentCardIndex;
    flipped[key] = !flipped[key];
    renderLearn();
}

function nextWord() {
    const words = languages[currentLanguage];
    if (currentCardIndex < words.length - 1) {
        currentCardIndex++;
        flipped = {};
        renderLearn();
    }
}

function previousWord() {
    if (currentCardIndex > 0) {
        currentCardIndex--;
        flipped = {};
        renderLearn();
    }
}

function addWord() {
    const word = document.getElementById('wordInput').value.trim();
    const meaning = document.getElementById('meaningInput').value.trim();
    const category = document.getElementById('categorySelect').value;
    
    if (!word || !meaning) {
        alert('❌ Please fill all fields!');
        return;
    }
    
    languages[currentLanguage].push({ word, meaning, category });
    saveToStorage();
    
    alert('✅ Word added successfully!');
    document.getElementById('addWordForm').reset();
}

function renderQuiz() {
    const quizContent = document.getElementById('quizContent');
    const words = languages[currentLanguage];
    
    if (words.length < 2) {
        quizContent.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">❌</div>
                <p>Add at least 2 words to take the quiz.</p>
            </div>
        `;
        return;
    }
    
    const currentWord = words[currentQuizIndex];
    const options = [currentWord.meaning];
    
    while (options.length < 4) {
        const randomWord = words[Math.floor(Math.random() * words.length)];
        if (!options.includes(randomWord.meaning)) {
            options.push(randomWord.meaning);
        }
    }
    
    options.sort(() => Math.random() - 0.5);
    
    let html = `
        <div class="quiz-question">
            <p>What is the meaning of:</p>
            <p>${currentWord.word}</p>
        </div>
        
        <div class="quiz-options">
    `;
    
    options.forEach((option) => {
        html += `
            <div class="quiz-option" onclick="checkAnswer('${option}', '${currentWord.meaning}')">
                ${option}
            </div>
        `;
    });
    
    html += `
        </div>
        <div style="margin-top: 20px; text-align: center; color: #666; font-size: 14px;">
            Question ${currentQuizIndex + 1} of ${words.length}
        </div>
    `;
    
    quizContent.innerHTML = html;
}

function checkAnswer(selected, correct) {
    if (selected === correct) {
        alert('✅ Correct!');
        const words = languages[currentLanguage];
        if (currentQuizIndex < words.length - 1) {
            currentQuizIndex++;
            renderQuiz();
        } else {
            alert('🎉 Quiz completed! Great job!');
            currentQuizIndex = 0;
            renderQuiz();
        }
    } else {
        alert(`❌ Wrong! The correct answer is: ${correct}`);
    }
}

function switchTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    if (tabName === 'quiz') {
        renderQuiz();
    }
}

function saveToStorage() {
    localStorage.setItem('languages', JSON.stringify(languages));
}

function loadFromStorage() {
    const saved = localStorage.getItem('languages');
    if (saved) {
        languages = JSON.parse(saved);
    }
}