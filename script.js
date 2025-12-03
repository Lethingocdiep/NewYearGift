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

let foodIntervalStarted = false;  // ⬅ kiểm soát việc bắt đầu rơi món ăn

// -------------------- Click trái tim --------------------
heart.addEventListener("click", () => {
    heartContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");

    createMaiRain();

    // 🔥 chỉ bắt đầu rơi đồ ăn tại đây
    if (!foodIntervalStarted) {
        foodIntervalStarted = true;
        setInterval(spawnFood, 4000);
    }

    // Nhạc nền fade-in
    if (backgroundMusic.paused) {
        backgroundMusic.volume = 0;
        backgroundMusic.loop = true;
        backgroundMusic.play();

        let targetVolume = 0.3;
        let fadeIn = setInterval(() => {
            if (backgroundMusic.volume < targetVolume) {
                backgroundMusic.volume += 0.01;
            } else {
                backgroundMusic.volume = targetVolume;
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

    // Giảm nhạc nền khi pháo hoa
    let targetVolume = 0.15;
    let fade = setInterval(() => {
        if (backgroundMusic.volume > targetVolume) {
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

// -------------------- Pháo hoa --------------------
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function launchFireworks() {
    setInterval(() => {
        fireworks.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            targetY: Math.random() * canvas.height * 0.4,
            size: 2,
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
            fw.particles.forEach((pt) => {
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

function drawDot(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function randomColor() {
    const colors = ["#ff4d4d", "#ffd700", "#ff66cc", "#00ccff", "#ffffff"];
    return colors[Math.floor(Math.random() * colors.length)];
}

// -------------------- Rơi thịt kho & bánh tét --------------------
function spawnFood() {
    const items = ["thit_kho.png", "banh_tet.png"];
    const img = document.createElement("img");

    img.src = "images/" + items[Math.floor(Math.random() * items.length)];
    img.className = "food-floating";

    img.style.left = Math.random() * 100 + "vw";
    img.style.animationDuration = (8 + Math.random() * 5) + "s";

    document.body.appendChild(img);
    setTimeout(() => img.remove(), 15000);
}
