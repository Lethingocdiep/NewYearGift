/* =====================
   DOM
===================== */
const heartContainer = document.getElementById("heart-container");
const envelopeContainer = document.getElementById("envelope-container");
const messageContainer = document.getElementById("message-container");
const canvas = document.getElementById("fireworks-canvas");

const bgMusic = new Audio("audio/music.mp3");
bgMusic.loop = true;

let fireworksActive = false;
let envelopeOpened = false;

/* =====================
   TEXT: Ich vermisse dich
===================== */
const missText = document.createElement("div");
missText.id = "miss-text";
missText.classList.add("hidden");
missText.innerText = "Ich vermisse dich";
document.body.appendChild(missText);

/* =====================
   INIT
===================== */
envelopeContainer.classList.add("hidden");
messageContainer.classList.add("hidden");

/* =====================
   HEART CLICK
===================== */
heartContainer.addEventListener("click", () => {
    heartContainer.classList.add("hidden");

    envelopeContainer.classList.remove("hidden");

    startFallingItems();
    startMusic();
});

/* =====================
   ENVELOPE CLICK
===================== */
envelopeContainer.addEventListener("click", () => {
    if (envelopeOpened) return;
    envelopeOpened = true;

    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden");

    startFireworks();
});

/* =====================
   MUSIC
===================== */
function startMusic() {
    bgMusic.play().catch(() => {});
}

/* =====================
   FALLING ITEMS
===================== */
function startFallingItems() {
    setInterval(() => createFalling("mayflower", "img/may.png", 3000), 800);
    setInterval(() => createFalling("food-floating", "img/food.png", 4000), 1400);
}

function createFalling(className, src, duration) {
    const img = document.createElement("img");
    img.src = src;
    img.className = className;
    img.style.left = Math.random() * 100 + "vw";
    img.style.animationDuration = duration + "ms";
    document.body.appendChild(img);

    setTimeout(() => img.remove(), duration);
}

/* =====================
   FIREWORKS
===================== */
function startFireworks() {
    fireworksActive = true;
    loopFireworks();
}

function stopFireworks() {
    fireworksActive = false;
}

function loopFireworks() {
    if (!fireworksActive) return;
    launchFirework();
    setTimeout(loopFireworks, 600);
}

function launchFirework() {
    // placeholder – bạn đang có logic pháo hoa sẵn trong repo
}

/* =====================
   TAB VISIBILITY
===================== */
document.addEventListener("visibilitychange", () => {
    if (!envelopeOpened) return;

    if (document.hidden) {
        stopFireworks();
        messageContainer.classList.add("hidden-soft");
        missText.classList.add("hidden");
    } else {
        rainFireworks(() => {
            showMissText();
        });
    }
});

/* =====================
   RETURN EFFECT
===================== */
function rainFireworks(callback) {
    let count = 0;
    const rain = setInterval(() => {
        launchFirework();
        count++;
        if (count > 12) {
            clearInterval(rain);
            callback();
        }
    }, 120);
}

function showMissText() {
    missText.classList.remove("hidden");

    heartFireworks();

    setTimeout(() => {
        missText.classList.add("hidden");
        messageContainer.classList.remove("hidden-soft");
        startFireworks();
    }, 3000);
}

function heartFireworks() {
    // placeholder – bắn pháo hoa hình tim (logic cũ của bạn)
}
