let hunger = 100;
let happiness = 100;
let energy = 100;
let isAnimating = false; // trava para animações especiais
let gameOver = false;    // indica se o Tamago morreu
let currentGif = "";     // guarda GIF atual para evitar reinício desnecessário

// --- Música de fundo ---
const backgroundMusic = new Audio("SOUND/music_loop.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.3;
backgroundMusic.play().catch(() => {
    console.log("Clique em algum botão para ativar a música.");
});

// --- Atualiza barra e valor dentro dela ---
function updateBar(id, value) {
    const bar = document.getElementById(id);
    bar.style.width = value + "%";
    bar.textContent = Math.round(value) + "%";
}

// --- Atualiza a mensagem ---
function updateMessage() {
    const msg = document.getElementById("tamagoMessage");
    if (gameOver) msg.textContent = "Seu Tamago se foi... 💔";
    else if (hunger <= 0 || happiness <= 0 || energy <= 0) msg.textContent = "Estou muito fraco...";
    else if (hunger < 30) msg.textContent = "Estou com fome!";
    else if (happiness < 30) msg.textContent = "Estou triste!";
    else if (energy < 20) msg.textContent = "Estou com sono!";
    else msg.textContent = "Estou feliz!";
}

// --- Atualiza GIF principal ---
function updateTamagoGif() {
    if (isAnimating || gameOver) return;

    const tamago = document.getElementById("tamagoGif");
    let newGif = "";

    if (energy < 20) newGif = "IMG/poyo-sono.gif";
    else if (hunger < 30) newGif = "IMG/poyo-fome.gif";
    else newGif = "IMG/poyo-feliz.gif";

    if (currentGif !== newGif) {
        tamago.src = newGif;
        currentGif = newGif;
    }
}

// --- Checa morte ---
function checkDeath() {
    if (!gameOver && (hunger <= 0 || happiness <= 0 || energy <= 0)) {
        gameOver = true;
        isAnimating = true;
        playSound("death_sound.wav");

        const tamago = document.getElementById("tamagoGif");
        tamago.src = "IMG/poyo-fall.gif?" + Date.now();
        currentGif = "IMG/poyo-fall.gif";

        const msg = document.getElementById("tamagoMessage");
        msg.textContent = "Seu Tamago se foi... 💔";

        document.getElementById("button_restart").style.display = "inline-block";
    }
}

// --- Diminuir status automaticamente ---
setInterval(() => {
    if (gameOver) return;

    hunger = Math.max(hunger - 3, 0);
    happiness = Math.max(happiness - 0.8, 0);
    energy = Math.max(energy - 0.5, 0);

    updateBar("hungerBar", hunger);
    updateBar("happinessBar", happiness);
    updateBar("energyBar", energy);
    updateMessage();
    updateTamagoGif();
    checkDeath();
}, 1000);

// --- Animação especial ---
function playAnimation(gif, callback) {
    if (gameOver) return;

    const tamago = document.getElementById("tamagoGif");
    isAnimating = true;
    tamago.src = gif + "?" + Date.now();
    currentGif = gif;

    setTimeout(() => {
        isAnimating = false;
        updateTamagoGif();
        updateMessage();
        if (callback) callback();
    }, 2000);
}

// --- Botões de interação ---
document.getElementById("button_01").addEventListener("click", () => {
    if (gameOver) return;
    hunger = Math.min(hunger + 20, 100);
    updateBar("hungerBar", hunger);
    playSound("button_sound.wav");
    playAnimation("IMG/kirby-soup.gif");
});

document.getElementById("button_02").addEventListener("click", () => {
    if (gameOver) return;
    happiness = Math.min(happiness + 20, 100);
    updateBar("happinessBar", happiness);
    playSound("button_sound.wav");
    playAnimation("IMG/poyo-carinho.gif");
});

document.getElementById("button_03").addEventListener("click", () => {
    if (gameOver) return;
    energy = Math.min(energy + 20, 100);
    updateBar("energyBar", energy);
    playSound("button_sound.wav");
    playAnimation("IMG/poyo-exercicio.gif");
});

// --- Botão de reinício ---
document.getElementById("button_restart").addEventListener("click", () => {
    hunger = 100;
    happiness = 100;
    energy = 100;
    gameOver = false;
    isAnimating = false;
    currentGif = "";

    updateBar("hungerBar", hunger);
    updateBar("happinessBar", happiness);
    updateBar("energyBar", energy);
    updateMessage();
    updateTamagoGif();
    document.getElementById("button_restart").style.display = "none";
});

// --- Toca som ---
function playSound(file) {
    const audio = new Audio("SOUND/" + file);
    audio.play();
}

// --- Emojis contínuos ---
function spawnContinuousEmojis() {
    const screen = document.getElementById("tamagoScreen");
    const emojis = ["❤️","⭐","💫","✨","🍀","🌸"];

    setInterval(() => {
        if (gameOver) return;

        const span = document.createElement("span");
        span.className = "emoji";
        span.textContent = emojis[Math.floor(Math.random() * emojis.length)];

        span.style.left = Math.random() * 80 + "%";
        span.style.top = Math.random() * 80 + "%";

        screen.appendChild(span);

        setTimeout(() => {
            if (span.parentNode) screen.removeChild(span);
        }, 1500);

    }, 300);
}
spawnContinuousEmojis();


// botão visível apenas no início
const startBtn = document.createElement("button");
startBtn.textContent = "Clique para começar a música e o jogo!";
startBtn.style.position = "absolute";
startBtn.style.top = "50%";
startBtn.style.left = "50%";
startBtn.style.transform = "translate(-50%, -50%)";
startBtn.style.padding = "10px 20px";
startBtn.style.fontSize = "1.2rem";
document.body.appendChild(startBtn);

startBtn.addEventListener("click", () => {
    backgroundMusic.play();
    document.body.removeChild(startBtn); // remove botão após clique
});
