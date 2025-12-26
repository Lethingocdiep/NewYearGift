/* =====================
   DOM
===================== */
const heart = document.getElementById("heart");
const heartContainer = document.getElementById("heart-container");
const envelopeContainer = document.getElementById("envelope-container");
const messageContainer = document.getElementById("message-container");

const popSound = document.getElementById("popSound");
const backgroundMusic = document.getElementById("backgroundMusic");
const fireworkSound = document.getElementById("fireworksSound");

/* =====================
   STATE
===================== */
let giftStarted = false;
let envelopeOpened = false;
let tabActive = true;

let fireworksEnabled = false;
let textMode = false;
let popPlayed = false;

const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

let fireworks = [];
let textParticles = [];

/* =====================
   CLICK HEART
===================== */
heart.addEventListener("click", () => {
    giftStarted = true;
    heartContainer.classList.add("fade-out");
    setTimeout(() => {
        heartContainer.classList.add("hidden");
        envelopeContainer.classList.remove("hidden");
    }, 600);

    createMaiRain();
    startFoodRain();

    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.3;
    backgroundMusic.play();
});

/* =====================
   CLICK ENVELOPE
===================== */
document.getElementById("envelope").addEventListener("click", () => {
    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden"); // show lời chúc + hình
    envelopeOpened = true;

    fireworksEnabled = true; // pháo hoa thường bắn
    if (!popPlayed) {
        popSound.volume = 0.8;
        popSound.play();
        popPlayed = true;
    }
});

/* =====================
   FIREWORK LOOP
===================== */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // pháo hoa thường
    if (fireworksEnabled && !textMode) {
        if (Math.random() < 0.04) spawnFirework();
    }

    fireworks.forEach((fw, i) => {
        if (!fw.exploded) {
            fw.y -= fw.vy;
            drawDot(fw.x, fw.y, "#fff");

            if (fw.y <= fw.targetY) {
                fw.exploded = true;
                fireworkSound.currentTime = 0;
                fireworkSound.play();

                for (let p = 0; p < 40; p++) {
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

    // text mode
    if (textMode) handleText();

    requestAnimationFrame(animate);
}
animate();

/* =====================
   SPAWN FIREWORK
===================== */
function spawnFirework() {
    fireworks.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        targetY: canvas.height * (0.2 + Math.random() * 0.3),
        vy: 6,
        exploded: false,
        particles: []
    });
}

/* =====================
   VISIBILITY LOGIC
===================== */
document.addEventListener("visibilitychange", () => {
    tabActive = !document.hidden;
    if (!giftStarted || !envelopeOpened) return;

    if (!tabActive) {
        fireworksEnabled = false; // pháo hoa ngưng
        messageContainer.style.visibility = "hidden"; // ẩn lời chúc + hình
    } else {
        // pháo hoa rơi rào
        fireworks.forEach(fw => { if (!fw.exploded) fw.vy = -8; });
        fireworkSound.currentTime = 0;
        fireworkSound.play();

        startTextSequence(); // chữ Ich vermisse dich
    }
});

/* =====================
   TEXT SEQUENCE
===================== */
function startTextSequence() {
    if (textMode) return;

    textMode = true;
    fireworksEnabled = true;
    generateText("Ich vermisse dich");

    setTimeout(() => burstHeart(), 1200);
    setTimeout(() => endText(), 4200);
}

function endText() {
    textMode = false;
    fireworksEnabled = true;
    messageContainer.style.visibility = "visible"; // show lại lời chúc + hình
}

/* =====================
   TEXT PARTICLES
===================== */
function generateText(text) {
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;

    const c = off.getContext("2d");
    c.font = "bold 120px Segoe UI";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillStyle = "white";
    c.fillText(text, off.width / 2, off.height * 0.45);

    const d = c.getImageData(0, 0, off.width, off.height).data;
    textParticles = [];

    for (let y = 0; y < off.height; y += 2) {
        for (let x = 0; x < off.width; x += 2) {
            if (d[(y * off.width + x) * 4 + 3] > 150) {
                textParticles.push({
                    x: x,
                    y: y,
                    life: 180
                });
            }
        }
    }
}

function handleText() {
    textParticles.forEach(p => {
        drawDot(p.x, p.y, "#fff");
        p.life--;
    });
    textParticles = textParticles.filter(p => p.life > 0);
}

/* =====================
   HEART FIREWORK
===================== */
function burstHeart() {
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.4;

    for (let i = 0; i < 120; i++) {
        const t = i / 120 * Math.PI * 2;
        fireworks.push({
            exploded: true,
            particles: [{
                x: cx,
                y: cy,
                vx: Math.cos(t) * 4,
                vy: Math.sin(t) * 4,
                life: 40,
                color: i % 2 ? "#ff66cc" : "#ffffff"
            }]
        });
    }
}

/* =====================
   DRAW & COLORS
===================== */
function drawDot(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = color;
    ctx.fill();
    ctx.shadowBlur = 0;
}

function randomColor() {
    return ["#ff4d4d", "#ffd700", "#ff66cc", "#ffffff"]
        [Math.floor(Math.random() * 4)];
}

/* =====================
   FALLING OBJECTS
===================== */
function createMaiRain() {
    setInterval(() => {
        const f = document.createElement("img");
        f.src = "images/mai.png";
        f.className = "mayflower";
        f.style.left = Math.random() * 100 + "vw";
        f.style.animationDuration = 4 + Math.random() * 4 + "s";
        document.body.appendChild(f);
        setTimeout(() => f.remove(), 8000);
    }, 260);
}

function startFoodRain() {
    setInterval(() => {
        const items = ["thit_kho.png", "banh_tet.png"];
        const img = document.createElement("img");
        img.src = "images/" + items[Math.floor(Math.random() * items.length)];
        img.className = "food-floating";
        img.style.left = Math.random() * 100 + "vw";
        img.style.animationDuration = 8 + Math.random() * 5 + "s";
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 15000);
    }, 4000);
}
