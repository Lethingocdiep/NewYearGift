const heart = document.getElementById("heart");
const heartContainer = document.getElementById("heart-container");

const envelopeContainer = document.getElementById("envelope-container");
const messageContainer = document.getElementById("message-container");

const thumpSound = new Audio("audio/thump.mp3");
const popSound = document.getElementById("popSound");

let backgroundMusic = document.getElementById("backgroundMusic");
let popPlayed = false;

// -------------------- Nhịp tim --------------------
thumpSound.volume = 0.5;
thumpSound.play();

let foodIntervalStarted = false;

// -------------------- Click trái tim --------------------
heart.addEventListener("click", () => {
    heartContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");

    createMaiRain();

    if (!foodIntervalStarted) {
        foodIntervalStarted = true;
        setInterval(spawnFood, 4000);
    }

    if (backgroundMusic.paused) {
        backgroundMusic.volume = 0;
        backgroundMusic.loop = true;
        backgroundMusic.play();

        let fadeIn = setInterval(() => {
            if (backgroundMusic.volume < 0.3) {
                backgroundMusic.volume += 0.01;
            } else {
                clearInterval(fadeIn);
            }
        }, 100);
    }
});

// -------------------- Click mở phong bao --------------------
document.getElementById("envelope").addEventListener("click", () => {
    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden");

    if (!popPlayed) {
        popSound.volume = 0.8;
        popSound.play();
        popPlayed = true;
    }

    let fade = setInterval(() => {
        if (backgroundMusic.volume > 0.15) {
            backgroundMusic.volume -= 0.01;
        } else {
            clearInterval(fade);
        }
    }, 100);

    launchFireworks();
});

// -------------------- Hoa mai rơi --------------------
function createMaiRain() {
    setInterval(() => {
        const flower = document.createElement("img");
        flower.src = "images/mai.png";
        flower.classList.add("mayflower");
        flower.style.left = Math.random() * 100 + "vw";
        flower.style.animationDuration = 4 + Math.random() * 4 + "s";
        document.body.appendChild(flower);
        setTimeout(() => flower.remove(), 8000);
    }, 250);
}

// -------------------- Canvas pháo hoa --------------------
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

/* ============================
   ⭐ TEXT FIREWORK STATE
============================ */
let textParticles = [];
let textPoints = [];
let textPhase = "idle"; // idle | rain | gather | hold
let textHoldStarted = false;

// -------------------- Pháo hoa thường --------------------
function launchFireworks() {
    setInterval(() => {
        fireworks.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            targetY: Math.random() * canvas.height * 0.4,
            exploded: false,
            particles: []
        });

        const fwSound = document.getElementById("fireworksSound");
        fwSound.volume = 0.5;
        fwSound.currentTime = 0;
        fwSound.play();
    }, 700);

    animateFireworks();
}

function animateFireworks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* ========= TEXT FIREWORK ========= */
    if (textPhase !== "idle") {
        textParticles.forEach((p, i) => {
            if (textPhase === "rain") {
                p.y += p.vy;
            }

            if (textPhase === "gather" && p.target) {
                p.x += (p.target.x - p.x) * 0.08;
                p.y += (p.target.y - p.y) * 0.08;
            }

            drawDot(p.x, p.y, p.color);
        });

        // giữ chữ đủ lâu để đọc
        if (textPhase === "gather" && !textHoldStarted) {
            textHoldStarted = true;
            textPhase = "hold";

            setTimeout(() => {
                textPhase = "idle";
                textParticles = [];
                showMessageBack();
                textHoldStarted = false;
            }, 5000); // ⏱ 5 GIÂY
        }
    }

    /* ========= FIREWORK BÌNH THƯỜNG ========= */
    fireworks.forEach((fw, i) => {
        if (!fw.exploded) {
            fw.y -= 5;
            drawDot(fw.x, fw.y, "white");

            if (fw.y <= fw.targetY) {
                fw.exploded = true;
                for (let p = 0; p < 25; p++) {
                    fw.particles.push({
                        x: fw.x,
                        y: fw.y,
                        angle: Math.random() * Math.PI * 2,
                        speed: 2 + Math.random() * 3,
                        life: 40 + Math.random() * 20
                    });
                }
            }
        } else {
            fw.particles.forEach(pt => {
                pt.x += Math.cos(pt.angle) * pt.speed;
                pt.y += Math.sin(pt.angle) * pt.speed;
                pt.life--;
                drawDot(pt.x, pt.y, randomColor());
            });
            fw.particles = fw.particles.filter(p => p.life > 0);
        }

        if (fw.exploded && fw.particles.length === 0) {
            fireworks.splice(i, 1);
        }
    });

    requestAnimationFrame(animateFireworks);
}

// -------------------- Vẽ chấm --------------------
function drawDot(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;

    ctx.shadowBlur = 10;      // ✨ glow
    ctx.shadowColor = color;

    ctx.fill();

    ctx.shadowBlur = 0;       // reset để không ảnh hưởng chỗ khác
}


function randomColor() {
    return ["#ff4d4d", "#ffd700", "#ff66cc", "#00ccff", "#ffffff"]
        [Math.floor(Math.random() * 5)];
}

// -------------------- Rơi đồ ăn --------------------
function spawnFood() {
    const items = ["thit_kho.png", "banh_tet.png"];
    const img = document.createElement("img");
    img.src = "images/" + items[Math.floor(Math.random() * items.length)];
    img.className = "food-floating";
    img.style.left = Math.random() * 100 + "vw";
    img.style.animationDuration = 8 + Math.random() * 5 + "s";
    document.body.appendChild(img);
    setTimeout(() => img.remove(), 15000);
}

/* ============================
   ⭐ TEXT FIREWORK FUNCTIONS
============================ */

// tạo điểm chữ
function generateTextPoints(text) {
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d");
    off.width = canvas.width;
    off.height = canvas.height;

    offCtx.font = "bold 72px Segoe UI";
    offCtx.fillStyle = "white";
    offCtx.textAlign = "center";
    offCtx.fillText(text, off.width / 2, off.height / 2);

    const data = offCtx.getImageData(0, 0, off.width, off.height).data;
    textPoints = [];

    for (let y = 0; y < off.height; y += 6) {
        for (let x = 0; x < off.width; x += 6) {
            if (data[(y * off.width + x) * 4 + 3] > 150) {
                textPoints.push({ x, y });
            }
        }
    }
}

// kích hoạt chữ pháo hoa
function startTextFirework() {
    if (textPhase !== "idle") return;

    hideMessageTemporarily();

    generateTextPoints("Ich vermisse dich");
    textParticles = [];
    textPhase = "rain";

    for (let i = 0; i < 220; i++) {
        textParticles.push({
            x: Math.random() * canvas.width,
            y: -Math.random() * canvas.height,
            vy: 3 + Math.random() * 3,
            color: randomColor(),
            target: null
        });
    }

    setTimeout(() => {
        textPhase = "gather";
        textParticles.forEach((p, i) => {
            p.target = textPoints[i % textPoints.length];
        });
    }, 1500);
}

// -------------------- Ẩn / hiện lời chúc --------------------
function hideMessageTemporarily() {
    messageContainer.classList.add("hidden-soft");
}

function showMessageBack() {
    messageContainer.classList.remove("hidden-soft");
}

// -------------------- Khi quay lại tab --------------------
document.addEventListener("visibilitychange", () => {
    if (!document.hidden && !messageContainer.classList.contains("hidden")) {
        startTextFirework();
    }
});
