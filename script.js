const heart = document.getElementById("heart");
const heartContainer = document.getElementById("heart-container");
const envelopeContainer = document.getElementById("envelope-container");
const messageContainer = document.getElementById("message-container");
const greeting = document.getElementById("greeting");

const thumpSound = new Audio("audio/thump.mp3");
const popSound = document.getElementById("popSound");

let backgroundMusic = document.getElementById("backgroundMusic");
let popPlayed = false;
let foodIntervalStarted = false;

// ------------------------------------
// TEXT GÕ TỪ TỪ
// ------------------------------------
const greetingText = `
Anh ở nơi xa, còn em gom cả mùa Tết quê mình để gửi sang cho anh từng chút một:
mùi mai vàng, tiếng pháo giao thừa,
đến cả nồi thịt kho hột vịt thơm ấm và đòn bánh tét xanh mềm quen thuộc… 💛✨

Nghĩ đến cảnh anh đón Tết một mình,
tim em lại mềm ra như miếng thịt kho sau mấy tiếng rim lửa nhỏ 🥘💛
chỉ muốn ôm anh một cái thật chặt cho anh bớt cô đơn 🤍🌿

Năm sau mình đoàn tụ,
đến cả pháo hoa cũng không sáng bằng nụ cười hai đứa khi đứng cạnh nhau 🎆💫

Em yêu anh… đến mức Tết cũng hóa thành nỗi nhớ mang tên anh 💛
Hy vọng món quà nhỏ này giúp anh ấm lòng hơn một chút 🍲💛
`;

function startTyping() {
    greeting.textContent = "";
    let i = 0;

    function type() {
        if (i < greetingText.length) {
            greeting.textContent += greetingText[i];
            i++;
            setTimeout(type, 28);
        }
    }
    type();
}

// ------------------------------------
// Nhịp tim ban đầu
// ------------------------------------
thumpSound.volume = 0.5;
thumpSound.play();

// ------------------------------------
// CLICK TRÁI TIM
// ------------------------------------
heart.addEventListener("click", () => {
    heartContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");

    createMaiRain();

    if (!foodIntervalStarted) {
        foodIntervalStarted = true;
        setInterval(spawnFood, 4000);
    }

    // Nhạc nền fade in
    if (backgroundMusic.paused) {
        backgroundMusic.volume = 0;
        backgroundMusic.loop = true;
        backgroundMusic.play();

        let vol = setInterval(() => {
            if (backgroundMusic.volume < 0.3) {
                backgroundMusic.volume += 0.01;
            } else clearInterval(vol);
        }, 100);
    }
});

// ------------------------------------
// MỞ PHONG BAO
// ------------------------------------
document.getElementById("envelope").addEventListener("click", () => {
    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden");

    if (!popPlayed) {
        popSound.volume = 0.8;
        popSound.play();
        popPlayed = true;
    }

    // giảm nhạc nền
    let fade = setInterval(() => {
        if (backgroundMusic.volume > 0.15) {
            backgroundMusic.volume -= 0.01;
        } else clearInterval(fade);
    }, 100);

    launchFireworks();
    startTyping();
});

// ------------------------------------
// HOA MAI RƠI
// ------------------------------------
function createMaiRain() {
    setInterval(() => {
        const f = document.createElement("img");
        f.src = "images/mai.png";
        f.classList.add("mayflower");

        f.style.left = Math.random() * 100 + "vw";
        f.style.animationDuration = 4 + Math.random() * 4 + "s";

        document.body.appendChild(f);
        setTimeout(() => f.remove(), 8000);
    }, 250);
}

// ------------------------------------
// FIREWORKS
// ------------------------------------
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let fireworks = [];

function launchFireworks() {
    setInterval(() => {
        fireworks.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            targetY: canvas.height * 0.4 * Math.random(),
            exploded: false,
            particles: []
        });

        const sound = document.getElementById("fireworksSound");
        sound.volume = 0.5;
        sound.currentTime = 0;
        sound.play();
    }, 700);

    animate();
}

function animate() {
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

    requestAnimationFrame(animate);
}

function drawDot(x, y, color) {
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
}

function randomColor() {
    const c = ["#ff4d4d", "#ffd700", "#ff66cc", "#00ccff", "#ffffff"];
    return c[Math.floor(Math.random() * c.length)];
}

// ------------------------------------
// FOOD FLOATING
// ------------------------------------
function spawnFood() {
    const items = ["thit_kho.png", "banh_tet.png"];

    const img = document.createElement("img");
    img.src = "images/" + items[Math.floor(Math.random() * items.length)];
    img.classList = "food-floating";

    img.style.left = Math.random() * 100 + "vw";
    img.style.animationDuration = (8 + Math.random() * 5) + "s";

    document.body.appendChild(img);

    setTimeout(() => img.remove(), 15000);
}

// ------------------------------------
// PHÁO HOA ĐỒNG LOẠT KHI QUAY LẠI
// ------------------------------------
function burstFireworks() {
    for (let i = 0; i < 15; i++) {
        fireworks.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height * 0.6 + canvas.height * 0.2,
            exploded: true,
            particles: Array.from({length: 35}, () => ({
                x: canvas.width * Math.random(),
                y: canvas.height * 0.2 + Math.random() * canvas.height * 0.6,
                angle: Math.random() * Math.PI * 2,
                speed: 2 + Math.random() * 3,
                life: 40 + Math.random() * 20
            }))
        });
    }

    const sound = document.getElementById("fireworksSound");
    sound.volume = 1;
    sound.currentTime = 0;
    sound.play();
}

document.addEventListener("visibilitychange", () => {
    if (!document.hidden) {
        if (!messageContainer.classList.contains("hidden")) {
            burstFireworks();
        }
    }
});
