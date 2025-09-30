// Game State
const gameState = {
    day: 1,
    time: 100,
    color: 100,
    depth: 0,
    burnout: 0,
    monotonyLevel: 0,
    shortcuts: 0,
    challenges: 0,
    reflections: 0,
    history: [],
    gameOver: false
};

// Room Types and Narratives
const rooms = {
    shortcuts: [
        {
            title: "La Via Rapida",
            description: "Salta la riunione mattutina, risparmi tempo ma perdi connessione.",
            timeGain: 20,
            colorCost: 15,
            monotonyIncrease: 2
        },
        {
            title: "Fast Food Mentale",
            description: "Consuma contenuti veloci invece di leggere. Efficiente ma vuoto.",
            timeGain: 15,
            colorCost: 12,
            monotonyIncrease: 2
        },
        {
            title: "Automatismo",
            description: "Ripeti ieri senza pensare. Più tempo, meno presenza.",
            timeGain: 25,
            colorCost: 20,
            monotonyIncrease: 3
        },
        {
            title: "Il Protocollo",
            description: "Segui la procedura senza deviare. Sicuro ma grigio.",
            timeGain: 18,
            colorCost: 14,
            monotonyIncrease: 2
        }
    ],
    challenges: [
        {
            title: "Nuova Abilità",
            description: "Impara qualcosa di difficile. Costa tempo, costruisce profondità.",
            timeCost: 30,
            depthGain: 15,
            colorGain: 5,
            burnoutRisk: 10
        },
        {
            title: "Conversazione Profonda",
            description: "Parla davvero con qualcuno. Lento ma ricco di colore.",
            timeCost: 25,
            depthGain: 12,
            colorGain: 10,
            burnoutRisk: 5
        },
        {
            title: "Progetto Creativo",
            description: "Crea qualcosa di tuo. Faticoso ma vitale.",
            timeCost: 35,
            depthGain: 20,
            colorGain: 15,
            burnoutRisk: 15
        },
        {
            title: "Aiutare Qualcuno",
            description: "Dedica energia ad altri. Svuota e riempie insieme.",
            timeCost: 28,
            depthGain: 10,
            colorGain: 12,
            burnoutRisk: 12
        }
    ],
    reflection: [
        {
            title: "Meditazione",
            description: "Fermati. Osserva. Riduce burnout, costruisce presenza.",
            timeCost: 20,
            depthGain: 8,
            burnoutReduction: 15,
            monotonyReduction: 1
        },
        {
            title: "Diario",
            description: "Scrivi cosa senti. Processa l'esperienza.",
            timeCost: 25,
            depthGain: 10,
            burnoutReduction: 12,
            monotonyReduction: 2
        },
        {
            title: "Natura",
            description: "Esci. Respira. Ricarica colore e calma.",
            timeCost: 30,
            colorGain: 15,
            burnoutReduction: 20,
            monotonyReduction: 3
        },
        {
            title: "Riposo Vero",
            description: "Non fare nulla. Lascia che il vuoto riempia.",
            timeCost: 15,
            depthGain: 5,
            burnoutReduction: 25,
            monotonyReduction: 1
        }
    ]
};

// DOM Elements
const dayEl = document.getElementById('day');
const timeEl = document.getElementById('time');
const colorEl = document.getElementById('color');
const depthEl = document.getElementById('depth');
const burnoutEl = document.getElementById('burnout');
const narrativeEl = document.getElementById('narrative-text');
const choicesEl = document.getElementById('choices');
const messageEl = document.getElementById('message');
const restartBtn = document.getElementById('restart');
const historyLogEl = document.getElementById('history-log');

// Update UI
function updateUI() {
    dayEl.textContent = gameState.day;
    timeEl.textContent = gameState.time;
    colorEl.textContent = gameState.color;
    depthEl.textContent = gameState.depth;
    burnoutEl.textContent = gameState.burnout;
    
    // Apply monotony visual effects
    document.body.className = '';
    if (gameState.monotonyLevel >= 15) {
        document.body.classList.add('sterile');
    } else if (gameState.monotonyLevel >= 10) {
        document.body.classList.add('faded');
    } else if (gameState.monotonyLevel >= 5) {
        document.body.classList.add('monotone');
    }
}

// Show message
function showMessage(text, type = 'warning') {
    messageEl.textContent = text;
    messageEl.className = type;
    setTimeout(() => {
        messageEl.classList.add('hidden');
    }, 3000);
}

// Add to history
function addToHistory(text) {
    gameState.history.push(text);
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `Giorno ${gameState.day}: ${text}`;
    historyLogEl.insertBefore(entry, historyLogEl.firstChild);
}

// Get random room from category
function getRandomRoom(category) {
    const roomList = rooms[category];
    return roomList[Math.floor(Math.random() * roomList.length)];
}

// Generate narrative based on game state
function generateNarrative() {
    let narrative = '';
    
    if (gameState.day === 1) {
        narrative = 'Ti svegli. Un altro giorno. La routine ti chiama, ma qualcosa dentro vuole cambiare...';
    } else if (gameState.burnout >= 80) {
        narrative = 'Tutto è pesante. Ogni gesto costa troppo. Il burnout ti consuma...';
    } else if (gameState.monotonyLevel >= 15) {
        narrative = 'Il grigio ha vinto. Ogni giorno uguale. Le parole perdono senso. Sei bloccato nel vuoto sterile.';
    } else if (gameState.color <= 20) {
        narrative = 'Il mondo perde colore. Tutto diventa sfumature di grigio. Dove è finita la vita?';
    } else if (gameState.depth >= 50) {
        narrative = 'Senti la profondità che hai costruito. Ogni scelta ha lasciato un segno. Stai crescendo.';
    } else if (gameState.monotonyLevel >= 10) {
        narrative = 'La monotonia si insinua. I giorni si fondono. Le scelte sembrano tutte uguali.';
    } else if (gameState.time <= 30) {
        narrative = 'Il tempo scorre via. Hai corso troppo, ora arrivi stanco alla sera.';
    } else {
        const narratives = [
            'Un nuovo giorno. Nuove scelte. Cosa costruirai oggi?',
            'Il loop continua. Ma tu non sei lo stesso di ieri.',
            'Tra routine e cambiamento, cerchi il tuo equilibrio.',
            'Ogni giorno è un esperimento. Cosa imparerai oggi?',
            'La tensione tra velocità e profondità definisce la tua giornata.'
        ];
        narrative = narratives[Math.floor(Math.random() * narratives.length)];
    }
    
    // Apply text reduction based on monotony
    if (gameState.monotonyLevel >= 15) {
        narrative = narrative.split(' ').slice(0, 5).join(' ') + '...';
    } else if (gameState.monotonyLevel >= 10) {
        narrative = narrative.split(' ').slice(0, 8).join(' ') + '...';
    }
    
    narrativeEl.textContent = narrative;
}

// Present choices
function presentChoices() {
    choicesEl.innerHTML = '';
    
    // Always offer one of each type
    const shortcut = getRandomRoom('shortcuts');
    const challenge = getRandomRoom('challenges');
    const reflection = getRandomRoom('reflection');
    
    const choices = [
        { type: 'shortcut', room: shortcut },
        { type: 'challenge', room: challenge },
        { type: 'reflection', room: reflection }
    ];
    
    choices.forEach(({ type, room }) => {
        const btn = document.createElement('button');
        btn.className = `choice-btn ${type}`;
        btn.innerHTML = `
            <strong>${room.title}</strong>
            <div class="choice-description">${room.description}</div>
        `;
        btn.addEventListener('click', () => makeChoice(type, room));
        choicesEl.appendChild(btn);
    });
}

// Make a choice
function makeChoice(type, room) {
    let message = '';
    
    if (type === 'shortcut') {
        gameState.time += room.timeGain;
        gameState.color -= room.colorCost;
        gameState.monotonyLevel += room.monotonyIncrease;
        gameState.shortcuts++;
        message = `Hai guadagnato ${room.timeGain} tempo ma perso ${room.colorCost} colore.`;
        addToHistory(`Scorciatoia: ${room.title}`);
    } else if (type === 'challenge') {
        gameState.time -= room.timeCost;
        gameState.depth += room.depthGain;
        gameState.color += room.colorGain;
        gameState.challenges++;
        
        // Burnout risk
        if (Math.random() * 100 < room.burnoutRisk) {
            gameState.burnout += room.burnoutRisk;
            message = `Hai costruito ${room.depthGain} profondità ma il burnout aumenta!`;
        } else {
            message = `Hai costruito ${room.depthGain} profondità e guadagnato ${room.colorGain} colore.`;
        }
        
        if (gameState.monotonyLevel > 0) {
            gameState.monotonyLevel -= 1;
        }
        
        addToHistory(`Sfida: ${room.title}`);
    } else if (type === 'reflection') {
        gameState.time -= room.timeCost;
        gameState.depth += room.depthGain;
        gameState.burnout -= room.burnoutReduction;
        gameState.monotonyLevel -= room.monotonyReduction;
        gameState.reflections++;
        
        if (room.colorGain) {
            gameState.color += room.colorGain;
        }
        
        message = `Hai riflettuto. Burnout ridotto di ${room.burnoutReduction}.`;
        addToHistory(`Riflessione: ${room.title}`);
    }
    
    // Clamp values
    gameState.time = Math.max(0, Math.min(200, gameState.time));
    gameState.color = Math.max(0, Math.min(100, gameState.color));
    gameState.burnout = Math.max(0, Math.min(100, gameState.burnout));
    gameState.monotonyLevel = Math.max(0, gameState.monotonyLevel);
    
    showMessage(message, 'success');
    
    // Check for game over conditions
    checkGameOver();
    
    if (!gameState.gameOver) {
        // Advance day
        advanceDay();
    }
}

// Advance to next day
function advanceDay() {
    gameState.day++;
    
    // Natural time decay
    gameState.time -= 5;
    
    // Natural color decay if using too many shortcuts
    if (gameState.monotonyLevel > 5) {
        gameState.color -= 2;
    }
    
    updateUI();
    generateNarrative();
    presentChoices();
}

// Check game over conditions
function checkGameOver() {
    let gameOverMessage = '';
    let gameOverType = 'danger';
    
    if (gameState.burnout >= 100) {
        gameOverMessage = 'BURNOUT TOTALE. Sei esausto. Hai spinto troppo senza riposarti. Il loop si ferma.';
        gameOverType = 'danger';
        gameState.gameOver = true;
    } else if (gameState.monotonyLevel >= 20) {
        gameOverMessage = 'BLOCCO STERILE. La monotonia ha vinto. Sei intrappolato in un loop vuoto senza colore né significato.';
        gameOverType = 'danger';
        gameState.gameOver = true;
    } else if (gameState.color <= 0) {
        gameOverMessage = 'APATIA COMPLETA. Il colore è svanito completamente. Tutto è grigio. Il mondo ha perso significato.';
        gameOverType = 'danger';
        gameState.gameOver = true;
    } else if (gameState.time <= 0) {
        gameOverMessage = 'ESAURIMENTO TEMPORALE. Hai usato troppo tempo in sfide senza guadagnarne. Il giorno finisce prima che tu possa fare altro.';
        gameOverType = 'danger';
        gameState.gameOver = true;
    } else if (gameState.depth >= 100 && gameState.color >= 60 && gameState.burnout < 50) {
        gameOverMessage = `CRESCITA DELIBERATA RAGGIUNTA! Hai costruito profondità vera mantenendo colore e equilibrio. Hai imparato a bilanciare routine e crescita in ${gameState.day} giorni.`;
        gameOverType = 'success';
        gameState.gameOver = true;
    }
    
    if (gameState.gameOver) {
        showGameOver(gameOverMessage, gameOverType);
    }
}

// Show game over screen
function showGameOver(message, type) {
    narrativeEl.textContent = message;
    choicesEl.innerHTML = '';
    messageEl.textContent = `Statistiche finali: ${gameState.shortcuts} scorciatoie, ${gameState.challenges} sfide, ${gameState.reflections} riflessioni.`;
    messageEl.className = type;
    restartBtn.classList.remove('hidden');
}

// Restart game
function restartGame() {
    gameState.day = 1;
    gameState.time = 100;
    gameState.color = 100;
    gameState.depth = 0;
    gameState.burnout = 0;
    gameState.monotonyLevel = 0;
    gameState.shortcuts = 0;
    gameState.challenges = 0;
    gameState.reflections = 0;
    gameState.history = [];
    gameState.gameOver = false;
    
    historyLogEl.innerHTML = '';
    messageEl.classList.add('hidden');
    restartBtn.classList.add('hidden');
    
    updateUI();
    generateNarrative();
    presentChoices();
}

// Event listeners
restartBtn.addEventListener('click', restartGame);

// Initialize game
updateUI();
generateNarrative();
presentChoices();
