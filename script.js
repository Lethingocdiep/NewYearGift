const heart = document.getElementById("heart");
const heartContainer = document.getElementById("heart-container");

const envelopeContainer = document.getElementById("envelope-container");
const messageContainer = document.getElementById("message-container");

const thumpSound = new Audio("audio/thump.mp3");
const popSound = new Audio("audio/pop.mp3");
const fireworksFile = "audio/fireworks.mp3"; // tiếng pháo hoa thật

let backgroundMusic; // nhạc nền toàn cục
let popPlayed = false; // kiểm tra pop đã phát chưa

/* 🎵 nhịp tim */
thumpSound.volume = 0.5;
thumpSound.play();

/* ❤️ click để hiện phong bao */
heart.addEventListener("click", () => {
    heartContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");

    createMaiRain();

    /* 🎶 nhạc nền bắt đầu khi phong bao hiện ra + fade in */
    if (!backgroundMusic) {
        backgroundMusic = new Audio("audio/Một_Năm_Mới_Bình_An.mp3");
        backgroundMusic.volume = 0; // bắt đầu từ 0
        backgroundMusic.loop = true;
        backgroundMusic.play();

        // fade in âm lượng đến 0.3 (tăng so với trước)
        let targetVolume = 0.3;
        let fadeInInterval = setInterval(() => {
            if (backgroundMusic.volume < targetVolume) {
                backgroundMusic.volume += 0.01;
            } else {
                backgroundMusic.volume = targetVolume;
                clearInterval(fadeInInterval);
            }
        }, 100);
    }
});

/* 🎁 mở phong bao */
document.getElementById("envelope").addEventListener("click", () => {
    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden");

    // pop chỉ phát 1 lần và ngay lập tức
    if (!popPlayed) {
        popSound.volume = 0.8;
        popSound.play();
        popPlayed = true;
    }

    // giảm âm lượng nhạc nền nhẹ khi pháo hoa xuất hiện
    if (backgroundMusic) {
        let targetVolume = 0.15; // giảm nhẹ để nhạc vẫn rõ
        let fadeInterval = setInterval(() => {
            if (backgroundMusic.volume > targetVolume) {
                backgroundMusic.volume -= 0.01;
            } else {
                clearInterval(fadeInterval);
            }
        }, 100);
    }

    launchFireworks(); // bắt đầu hiệu ứng pháo hoa
});

/* 🌸 hoa mai rơi */
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

/* 🎆 Pháo hoa (canvas) */
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let fireworks = [];

function launchFireworks() {
    setInterval(() => {
        // tạo đợt pháo hoa mới
        fireworks.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            targetY: Math.random() * canvas.height * 0.4,
            size: 2,
            exploded: false,
            particles: []
        });

        // phát tiếng pháo hoa cho mỗi đợt
        const fwSound = new Audio(fireworksFile);
        fwSound.volume = 0.5; // giữ vừa phải để nhạc nền vẫn nổi bật
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

                for (let p = 0; p < 30; p++) {
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
