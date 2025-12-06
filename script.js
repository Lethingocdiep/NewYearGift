// ---------------------------
// VARIABLES
// ---------------------------
const envelope = document.getElementById("envelope");
const messageBox = document.getElementById("message-container");
const greeting = document.getElementById("greeting");

const fireworksCanvas = document.getElementById("fireworks-canvas");
const ctx = fireworksCanvas.getContext("2d");

let fireworks = [];
let pendingFireworks = [];
let hasOpened = false;
let typingIndex = 0;
let typingTimer = null;

const MESSAGE_TEXT = 
`Chúc anh yêu một năm mới bình an, may mắn và lúc nào cũng ấm áp nha ❤️  

Anh ở nơi xa, còn em gom cả mùa Tết quê mình để gửi sang cho anh từng chút một:

🥮 Một khoanh bánh tét ngũ sắc thật dẻo,
🍖 Một miếng thịt kho hột vịt thơm đúng vị nhà,
✨ Và một phong bao lì xì chứa đầy điều may mắn dành riêng cho anh.

Chúc anh luôn khỏe mạnh, vui vẻ và sớm về lại bên em nhen ❤️`;

// ---------------------------
// WRITE TEXT LETTER BY LETTER
// ---------------------------
function typeText() {
    if (typingIndex === 0) {
        greeting.classList.add("typing-cursor");
        greeting.textContent = "";
    }

    if (typingIndex < MESSAGE_TEXT.length) {
        greeting.textContent += MESSAGE_TEXT[typingIndex];
        typingIndex++;
        typingTimer = setTimeout(typeText, 35);
    } else {
        greeting.classList.remove("typing-cursor");
    }
}

// ---------------------------
// ENVELOPE CLICK → SHOW MESSAGE
// ---------------------------
envelope.addEventListener("click", () => {
    if (hasOpened) return;
    hasOpened = true;

    envelope.style.display = "none";
    messageBox.classList.remove("hidden");

    typeText();
});

// ---------------------------
// FIREWORKS SYSTEM
// ---------------------------
function resizeCanvas() {
    fireworksCanvas.width = window.innerWidth;
    fireworksCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Add firework object
function spawnFirework(isBurst = false) {
    pendingFireworks.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        radius: isBurst ? 2 + Math.random() * 3 : 2,
        life: 40 + Math.random() * 40,
        speedX: (Math.random() - 0.5) * 4,
        speedY: (Math.random() - 0.5) * 4
    });
}

// Main loop
function loop() {
    ctx.clearRect(0, 0, fireworksCanvas.width, fireworksCanvas.height);

    fireworks.push(...pendingFireworks);
    pendingFireworks = [];

    fireworks.forEach((fw, index) => {
        ctx.beginPath();
        ctx.arc(fw.x, fw.y, fw.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(255,255,150,0.8)";
        ctx.fill();

        fw.x += fw.speedX;
        fw.y += fw.speedY;
        fw.life--;

        if (fw.life <= 0) fireworks.splice(index, 1);
    });

    requestAnimationFrame(loop);
}
loop();

// ---------------------------
// PAGE VISIBILITY = FIREWORK BURST MODE
// ---------------------------
document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") {
        // User leaves → queue MANY fireworks
        for (let i = 0; i < 200; i++) spawnFirework(true);
    } else {
        // User returns → IMMEDIATE BURST
        pendingFireworks.push(...pendingFireworks);
    }
});

// ---------------------------
// Background random fireworks every 1.5s
// ---------------------------
setInterval(() => {
    spawnFirework();
}, 1500);
