/* ===================== DOM ===================== */
const heartContainer = document.getElementById("heart-container");
const heart = document.getElementById("heart");

const envelopeContainer = document.getElementById("envelope-container");
const envelope = document.getElementById("envelope");

const messageContainer = document.getElementById("message-container");

const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

const backgroundMusic = document.getElementById("backgroundMusic");
const popSound = document.getElementById("popSound");
const fireworkSound = document.getElementById("fireworksSound");

/* ===================== CANVAS ===================== */
canvas.width = innerWidth;
canvas.height = innerHeight;
window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

/* ===================== STATE ===================== */
let giftStarted = false;
let envelopeOpened = false;
let fireworksActive = false;
let isTabActive = true;
let isTextMode = false;

let fireworks = [];
let textParticles = [];

/* ❤️ VALENTINE EASTER EGG ===================== */
let heartBeatCount = 0;        // đếm nhịp pháo tim
let valentineShown = false;   // đảm bảo chỉ hiện 1 lần

/* ===================== LOAD PAGE ===================== */
envelopeContainer.classList.add("hidden");
messageContainer.classList.add("hidden");

/* ===================== CLICK HEART ===================== */
heartContainer.addEventListener("click", () => {
    if (giftStarted) return;
    giftStarted = true;

    heartContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");

    createMaiRain();
    startFoodRain();

    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.35;
    backgroundMusic.play().catch(() => {});
});

/* ===================== CLICK ENVELOPE ===================== */
envelope.addEventListener("click", () => {
    if (envelopeOpened) return;
    envelopeOpened = true;

    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden");

    popSound.currentTime = 0;
    popSound.play().catch(() => {});

    fireworksActive = true;
});

/* ===================== TAB VISIBILITY ===================== */
document.addEventListener("visibilitychange", () => {
    isTabActive = !document.hidden;

    if (!envelopeOpened) return;

    if (!isTabActive) {
        fireworksActive = false;
        isTextMode = false;
    } else {
        rainFireworksDown();
        startMissTextSequence();
    }
});

/* ===================== MISS TEXT SEQUENCE ===================== */
function startMissTextSequence() {
    if (isTextMode) return;
    isTextMode = true;

    messageContainer.classList.add("hidden-soft");
    generateText("Ich vermisse dich");

    setTimeout(() => heartFirework(), 800);

    setTimeout(() => {
        isTextMode = false;
        textParticles = [];
        messageContainer.classList.remove("hidden-soft");
        fireworksActive = true;
    }, 4200);
}

/* ===================== FIREWORK ENGINE ===================== */
function spawnFirework() {
    fireworks.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        targetY: canvas.height * (0.25 + Math.random() * 0.25),
        vy: 6,
        exploded: false,
        particles: []
    });
}

function updateFireworks() {
    if (fireworksActive && !isTextMode && Math.random() < 0.05) {
        spawnFirework();
    }

    fireworks.forEach((fw, i) => {
        if (!fw.exploded) {
            fw.y -= fw.vy;
            drawDot(fw.x, fw.y, "#fff");

            if (fw.y <= fw.targetY) {
                fw.exploded = true;
                fireworkSound.currentTime = 0;
                fireworkSound.play().catch(() => {});

                for (let p = 0; p < 45; p++) {
                    fw.particles.push({
                        x: fw.x,
                        y: fw.y,
                        vx: Math.cos(Math.random() * Math.PI * 2) * 3,
                        vy: Math.sin(Math.random() * Math.PI * 2) * 3,
                        life: 50,
                        color: randomColor()
                    });
                }
            }
        } else {
            fw.particles.forEach(pt => {
                pt.x += pt.vx;
                pt.y += pt.vy;
                pt.life--;
                drawDot(pt.x, pt.y, pt.color);
            });
            fw.particles = fw.particles.filter(p => p.life > 0);
        }

        if (fw.exploded && fw.particles.length === 0) {
            fireworks.splice(i, 1);
        }
    });
}

/* ===================== TAB RETURN RAIN ===================== */
function rainFireworksDown() {
    fireworks.forEach(fw => {
        if (!fw.exploded) fw.vy = -8;
    });
    fireworkSound.currentTime = 0;
    fireworkSound.play().catch(() => {});
}

/* ===================== TEXT PARTICLES ===================== */
function generateText(text) {
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = 200;
    const c = off.getContext("2d");

    c.font = "900 120px Segoe UI";
    c.textAlign = "center";
    c.fillStyle = "#fff";
    c.fillText(text, off.width / 2, 140);

    const data = c.getImageData(0, 0, off.width, off.height).data;
    textParticles = [];

    for (let y = 0; y < off.height; y += 3) {
        for (let x = 0; x < off.width; x += 3) {
            if (data[(y * off.width + x) * 4 + 3] > 150) {
                textParticles.push({
                    x,
                    y: y + canvas.height * 0.35,
                    life: 200
                });
            }
        }
    }
}

function drawTextParticles() {
    textParticles.forEach(p => {
        drawDot(p.x, p.y, "#fff");
        p.life--;
    });
    textParticles = textParticles.filter(p => p.life > 0);
}

/* ===================== HEART FIREWORK ===================== */
function heartFirework() {
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.4;

    heartBeatCount++; // ❤️ VALENTINE EASTER EGG: đếm nhịp tim

    for (let i = 0; i < 120; i++) {
        const t = (i / 120) * Math.PI * 2;
        fireworks.push({
            exploded: true,
            particles: [{
                x: cx,
                y: cy,
                vx: Math.cos(t) * 4,
                vy: Math.sin(t) * 4,
                life: 40,
                color: i % 2 ? "#ff66cc" : "#fff"
            }]
        });
    }

    // ❤️ VALENTINE EASTER EGG: hiện chữ sau nhịp thứ 14
    if (heartBeatCount === 14 && !valentineShown) {
        valentineShown = true;
        showValentineText();
    }
}

/* ❤️ VALENTINE EASTER EGG ===================== */
function showValentineText() {
    const text = document.createElement("div");
    text.textContent = "happy valentine anh iu 💘";
    text.style.position = "fixed";
    text.style.top = "55%";
    text.style.left = "50%";
    text.style.transform = "translate(-50%, -50%)";
    text.style.fontSize = "18px";
    text.style.opacity = "0";
    text.style.color = "#fff";
    text.style.letterSpacing = "1px";
    text.style.transition = "opacity 1.2s ease";
    text.style.zIndex = "30";

    document.body.appendChild(text);

    requestAnimationFrame(() => (text.style.opacity = "1"));

    setTimeout(() => (text.style.opacity = "0"), 2200);
    setTimeout(() => text.remove(), 3500);
}

/* ===================== DRAW ===================== */
function drawDot(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function randomColor() {
    return ["#ff4d4d", "#ffd700", "#ff66cc", "#ffffff"][
        Math.floor(Math.random() * 4)
    ];
}

/* ===================== LOOP ===================== */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    updateFireworks();
    if (isTextMode) drawTextParticles();
    requestAnimationFrame(animate);
}
animate();

/* ===================== MAI + FOOD RAIN ===================== */
function createMaiRain() {
    setInterval(() => {
        const img = document.createElement("img");
        img.src = "images/mai.png";
        img.className = "mayflower";
        img.style.left = Math.random() * 100 + "vw";
        img.style.animationDuration = 3 + Math.random() * 3 + "s";
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 7000);
    }, 180);
}

function startFoodRain() {
    const foods = ["thit_kho.png", "banh_tet.png"];
    setInterval(() => {
        const img = document.createElement("img");
        img.src = "images/" + foods[Math.floor(Math.random() * foods.length)];
        img.className = "food-floating";
        img.style.left = Math.random() * 100 + "vw";
        img.style.animationDuration = 7 + Math.random() * 4 + "s";
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 14000);
    }, 2200);
}
