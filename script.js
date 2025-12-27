/* =====================
   ELEMENTS
===================== */
const heartContainer = document.getElementById("heart-container");
const envelopeContainer = document.getElementById("envelope-container");
const messageContainer = document.getElementById("message-container");
const fireworksCanvas = document.getElementById("fireworks-canvas");
const ctx = fireworksCanvas.getContext("2d");

/* =====================
   AUDIO
===================== */
const bgMusic = new Audio("audio/background.mp3");
bgMusic.loop = true;

const fireworkSound = new Audio("audio/fireworks.mp3");
const popSound = new Audio("audio/pop.mp3");
const thumpSound = new Audio("audio/thump.mp3");

/* =====================
   STATE
===================== */
let heartClicked = false;
let envelopeOpened = false;
let isTabHidden = false;
let fireworksRunning = false;

/* =====================
   INIT
===================== */
envelopeContainer.classList.add("hidden");
messageContainer.classList.add("hidden");
resizeCanvas();

/* =====================
   HEART CLICK
===================== */
heartContainer.addEventListener("click", () => {
    if (heartClicked) return;
    heartClicked = true;

    thumpSound.play();

    heartContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");

    startFallingItems();
    bgMusic.play();
});

/* =====================
   ENVELOPE CLICK
===================== */
envelopeContainer.addEventListener("click", () => {
    if (envelopeOpened) return;
    envelopeOpened = true;

    popSound.play();

    messageContainer.classList.remove("hidden");
    startFireworks();
});

/* =====================
   TAB VISIBILITY
===================== */
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        isTabHidden = true;
        stopFireworks();
        messageContainer.classList.add("hidden");
    } else {
        if (!isTabHidden || !envelopeOpened) return;
        isTabHidden = false;
        comebackEffect();
    }
});

/* =====================
   COMEBACK EFFECT
===================== */
function comebackEffect() {
    rainFireworks(() => {
        showMissYouText(() => {
            messageContainer.classList.remove("hidden");
            startFireworks();
        });
    });
}

/* =====================
   MISS YOU TEXT
===================== */
function showMissYouText(done) {
    const text = document.createElement("div");
    text.textContent = "Ich vermisse dich";
    text.style.position = "fixed";
    text.style.top = "45%";
    text.style.left = "50%";
    text.style.transform = "translate(-50%, -50%)";
    text.style.fontSize = "42px";
    text.style.fontWeight = "600";
    text.style.color = "#fff";
    text.style.textShadow = "0 0 20px rgba(255,255,255,0.9)";
    text.style.zIndex = 10;

    document.body.appendChild(text);

    heartFireworks();

    setTimeout(() => {
        text.remove();
        done && done();
    }, 3000);
}

/* =====================
   FIREWORKS CORE
===================== */
function startFireworks() {
    if (fireworksRunning) return;
    fireworksRunning = true;
    fireworkSound.play();
    animateFireworks();
}

function stopFireworks() {
    fireworksRunning = false;
    fireworkSound.pause();
}

function animateFireworks() {
    if (!fireworksRunning) return;
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);
    // simple sparkle demo (placeholder but stable)
    for (let i = 0; i < 6; i++) {
        ctx.fillStyle = `rgba(255,215,0,0.8)`;
        ctx.beginPath();
        ctx.arc(
            Math.random() * fireworksCanvas.width,
            Math.random() * fireworksCanvas.height,
            2,
            0,
            Math.PI * 2
        );
        ctx.fill();
    }
    requestAnimationFrame(animateFireworks);
}

/* =====================
   SPECIAL EFFECTS
===================== */
function rainFireworks(done) {
    let count = 0;
    const interval = setInterval(() => {
        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.fillRect(
            Math.random() * fireworksCanvas.width,
            Math.random() * fireworksCanvas.height,
            2,
            10
        );
        count++;
        if (count > 40) {
            clearInterval(interval);
            done && done();
        }
    }, 40);
}

function heartFireworks() {
    // nhẹ – chỉ là hiệu ứng tượng trưng
    ctx.fillStyle = "pink";
    ctx.beginPath();
    ctx.arc(
        fireworksCanvas.width / 2,
        fireworksCanvas.height / 2,
        30,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

/* =====================
   FALLING ITEMS
===================== */
function startFallingItems() {
    spawnItem("images/mai.png", "mayflower", 3000);
    spawnItem("images/banh_tet.png", "food-floating", 4000);
    spawnItem("images/thit_kho.png", "food-floating", 5000);
}

function spawnItem(src, className, interval) {
    setInterval(() => {
        const img = document.createElement("img");
        img.src = src;
        img.className = className;
        img.style.left = Math.random() * 100 + "vw";
        img.style.animationDuration = 5 + Math.random() * 5 + "s";
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 12000);
    }, interval);
}

/* =====================
   CANVAS
===================== */
function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
