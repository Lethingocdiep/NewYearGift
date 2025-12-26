/* ================= CANVAS ================= */
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

/* ================= ELEMENTS ================= */
const messageBox = document.getElementById("message-container");

const missText = document.createElement("div");
missText.id = "miss-text";
missText.innerText = "ICH VERMISSE DICH";
document.body.appendChild(missText);

/* ================= STATE ================= */
let fireworks = [];
let fireworkTimer = null;
let isPaused = false;

/* ================= FIREWORK ================= */
class Firework {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = Math.random() * 4 - 2;
        this.vy = Math.random() * -5 - 2;
        this.life = 90;
        this.color = color;
        this.size = Math.random() * 2 + 1.5;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.05;
        this.life--;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ================= SPAWN ================= */
function spawnFirework(isHeart = false) {
    const x = Math.random() * canvas.width;
    const y = canvas.height * 0.65;
    const colors = isHeart
        ? ["#ffb6c1", "#ffffff"]
        : ["#ffd700", "#ff6666", "#ffffff"];

    for (let i = 0; i < 80; i++) {
        fireworks.push(
            new Firework(
                x,
                y,
                colors[Math.floor(Math.random() * colors.length)]
            )
        );
    }
}

/* ================= LOOP ================= */
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworks.forEach((fw, i) => {
        fw.update();
        fw.draw();
        if (fw.life <= 0) fireworks.splice(i, 1);
    });
    requestAnimationFrame(animate);
}
animate();

/* ================= FIREWORK MODE ================= */
function startFireworks() {
    if (fireworkTimer) return;
    fireworkTimer = setInterval(() => {
        if (!isPaused) spawnFirework(false);
    }, 900);
}

function stopFireworks() {
    clearInterval(fireworkTimer);
    fireworkTimer = null;
}

/* ================= TAB EVENT ================= */
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        isPaused = true;
        stopFireworks();
    } else {
        isPaused = false;
        playReturnSequence();
    }
});

/* ================= RETURN SEQUENCE ================= */
function playReturnSequence() {
    messageBox.classList.add("hidden-soft");

    // rơi pháo hoa
    for (let i = 0; i < 120; i++) {
        fireworks.push(
            new Firework(
                Math.random() * canvas.width,
                -20,
                "#ffffff"
            )
        );
    }

    setTimeout(() => {
        missText.style.opacity = "1";
    }, 600);

    setTimeout(() => {
        spawnFirework(true);
        spawnFirework(true);
    }, 1200);

    setTimeout(() => {
        missText.style.opacity = "0";
        messageBox.classList.remove("hidden-soft");
        startFireworks();
    }, 4500);
}

/* ================= INIT ================= */
startFireworks();
