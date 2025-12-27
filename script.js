/* ===================== DOM ===================== */
const heart = document.getElementById("heart");
const heartContainer = document.getElementById("heart-container");
const envelopeContainer = document.getElementById("envelope-container");
const envelope = document.getElementById("envelope");
const messageContainer = document.getElementById("message-container");

const bgMusic = document.getElementById("backgroundMusic");
const popSound = document.getElementById("popSound");
const fireSound = document.getElementById("fireworksSound");
const thumpSound = document.getElementById("thumpSound");

const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");
canvas.width = innerWidth;
canvas.height = innerHeight;

/* ===================== STATE ===================== */
let started = false;
let envelopeOpened = false;
let fireworksEnabled = false;
let textMode = false;
let fireworks = [];
let textParticles = [];

/* ===================== HEART THUMP ===================== */
thumpSound.loop = true;
thumpSound.volume = 0.5;
thumpSound.play();

/* ===================== CLICK HEART ===================== */
heart.addEventListener("click", () => {
    if (started) return;
    started = true;

    thumpSound.pause();
    thumpSound.currentTime = 0;

    heartContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");

    startMaiRain();
    startFoodRain();

    bgMusic.loop = true;
    bgMusic.volume = 0.3;
    bgMusic.play();
});

/* ===================== CLICK ENVELOPE ===================== */
envelope.addEventListener("click", () => {
    if (envelopeOpened) return;
    envelopeOpened = true;

    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden");

    popSound.volume = 0.8;
    popSound.play();

    fireworksEnabled = true;
});

/* ===================== VISIBILITY ===================== */
document.addEventListener("visibilitychange", () => {
    if (!envelopeOpened) return;

    if (document.hidden) {
        fireworksEnabled = false;
        textMode = false;
    } else {
        startTextSequence();
    }
});

/* ===================== TEXT SEQUENCE ===================== */
function startTextSequence() {
    if (textMode) return;

    textMode = true;
    fireworksEnabled = false;
    messageContainer.classList.add("hidden-soft");

    generateText("Ich vermisse dich");
    heartFirework();

    setTimeout(() => {
        textMode = false;
        fireworksEnabled = true;
        messageContainer.classList.remove("hidden-soft");
        textParticles = [];
    }, 4200);
}

/* ===================== FIREWORK LOOP ===================== */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (fireworksEnabled && Math.random() < 0.06) spawnFirework();

    fireworks.forEach((fw, i) => {
        if (!fw.exploded) {
            fw.y -= fw.vy;
            drawDot(fw.x, fw.y, "#fff");
            if (fw.y <= fw.targetY) explode(fw);
        } else {
            fw.particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.life--;
                drawDot(p.x, p.y, p.color);
            });
            fw.particles = fw.particles.filter(p => p.life > 0);
        }
        if (fw.exploded && fw.particles.length === 0) fireworks.splice(i, 1);
    });

    if (textMode) drawTextParticles();
    requestAnimationFrame(animate);
}
animate();

/* ===================== FIREWORK HELPERS ===================== */
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

function explode(fw) {
    fw.exploded = true;
    fireSound.currentTime = 0;
    fireSound.play();

    for (let i = 0; i < 50; i++) {
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

/* ===================== TEXT ===================== */
function generateText(text) {
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = 200;
    const c = off.getContext("2d");

    c.font = "900 120px Segoe UI";
    c.fillStyle = "#fff";
    c.textAlign = "center";
    c.fillText(text, off.width / 2, 140);

    const data = c.getImageData(0, 0, off.width, off.height).data;
    textParticles = [];

    for (let y = 0; y < off.height; y += 3) {
        for (let x = 0; x < off.width; x += 3) {
            if (data[(y * off.width + x) * 4 + 3] > 150) {
                textParticles.push({ x, y: y + canvas.height * 0.35, life: 200 });
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

    for (let i = 0; i < 140; i++) {
        const t = i / 140 * Math.PI * 2;
        fireworks.push({
            exploded: true,
            particles: [{
                x: cx,
                y: cy,
                vx: Math.cos(t) * 4,
                vy: Math.sin(t) * 4,
                life: 50,
                color: "#ff66cc"
            }]
        });
    }
}

/* ===================== DRAW ===================== */
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
    return ["#ff4d4d", "#ffd700", "#ff66cc", "#ffffff"][Math.floor(Math.random() * 4)];
}

/* ===================== FALLING ITEMS ===================== */
function startMaiRain() {
    setInterval(() => {
        const img = document.createElement("img");
        img.src = "images/mai.png";
        img.className = "mayflower";
        img.style.left = Math.random() * 100 + "vw";
        img.style.animationDuration = 3 + Math.random() * 3 + "s";
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 8000);
    }, 180);
}

function startFoodRain() {
    setInterval(() => {
        const foods = ["thit_kho.png", "banh_tet.png"];
        const img = document.createElement("img");
        img.src = "images/" + foods[Math.floor(Math.random() * foods.length)];
        img.className = "food-floating";
        img.style.left = Math.random() * 100 + "vw";
        img.style.animationDuration = 6 + Math.random() * 4 + "s";
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 12000);
    }, 2000);
}
