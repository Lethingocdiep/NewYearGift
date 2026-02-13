const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");
const heartContainer = document.getElementById("heart-container");
const envelopeContainer = document.getElementById("envelope-container");
const messageContainer = document.getElementById("message-container");
const bgMusic = document.getElementById("backgroundMusic");
const fireworkSound = document.getElementById("fireworksSound");
const popSound = document.getElementById("popSound");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = [];
let isTabActive = true;
let currentState = "START"; 
let isEasterEggRunning = false;
const colors = ["#ff4d4d", "#ffd700", "#4dff4d", "#4dffff", "#ff4dff", "#ffffff", "#ff85a2"];

// HÀM PHÁT TIẾNG PHÁO (Đồng bộ hóa)
function playFireworkSFX(volume = 0.5) {
    if (fireworkSound) {
        const sound = fireworkSound.cloneNode(); // Tạo bản sao để nổ nhiều tiếng cùng lúc
        sound.volume = volume;
        sound.play().catch(() => {}); // Tránh lỗi trình duyệt chặn
    }
}

// 1. Click Tim -> Mồi âm thanh
heartContainer.addEventListener("click", () => {
    heartContainer.classList.add("hidden");
    envelopeContainer.classList.remove("hidden");
    
    // Phát nhạc nền và mồi file pháo hoa để trình duyệt cấp quyền
    bgMusic.play().catch(() => {});
    fireworkSound.play().then(() => {
        fireworkSound.pause();
        fireworkSound.currentTime = 0;
    }).catch(() => {});

    startRain(); 
});

// 2. Click Phong bì
document.getElementById("envelope").addEventListener("click", () => {
    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden");
    if(popSound) popSound.play();
    currentState = "WISHES";
});

// 3. Tab Visibility
document.addEventListener("visibilitychange", () => {
    isTabActive = !document.hidden;
    if (isTabActive && currentState === "WISHES" && !isEasterEggRunning) {
        runEasterEggFlow();
    }
});

// 4. Easter Egg
function runEasterEggFlow() {
    isEasterEggRunning = true;
    const innerMsg = document.getElementById("inner-message");
    const eggContainer = document.getElementById("easter-egg-container");
    
    if(innerMsg) innerMsg.style.opacity = "0.05";
    eggContainer.innerHTML = `<p class="easter-text">Ich vermisse dich</p>`;
    
    setTimeout(() => {
        let count = 0;
        const interval = setInterval(() => {
            spawnHeartFirework();
            count++;
            if (count >= 14) {
                clearInterval(interval);
                eggContainer.innerHTML = `<p class="easter-text" style="color:#ff4d6d">Happy valentine anh iu 💘</p>`;
                setTimeout(() => {
                    eggContainer.innerHTML = "";
                    if(innerMsg) innerMsg.style.opacity = "1";
                    isEasterEggRunning = false;
                }, 3500);
            }
        }, 700);
    }, 2000);
}

// 5. Engine Pháo hoa
class Particle {
    constructor(x, y, color, vx, vy) {
        this.x = x; this.y = y;
        this.color = color;
        this.vx = vx; this.vy = vy;
        this.alpha = 1;
    }
    update() {
        if (!isTabActive) {
            this.vx += (canvas.width/2 - this.x) * 0.02;
            this.vy += (canvas.height/2 - this.y) * 0.02;
        } else {
            this.vx *= 0.97; this.vy *= 0.97;
            this.vy += 0.06;
        }
        this.x += this.vx; this.y += this.vy;
        this.alpha -= 0.012;
    }
    draw() {
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Pháo hoa hình tim (Valentine)
function spawnHeartFirework() {
    const cx = canvas.width / 2;
    const cy = canvas.height * 0.45;
    
    // ĐỒNG BỘ: Phát tiếng nổ ngay khi các hạt bắt đầu được tạo
    playFireworkSFX(0.6);

    for (let i = 0; i < 70; i++) {
        const angle = (i / 70) * Math.PI * 2;
        const vx = 16 * Math.pow(Math.sin(angle), 3) * 0.38;
        const vy = -(13 * Math.cos(angle) - 5 * Math.cos(2*angle) - 2 * Math.cos(3*angle) - Math.cos(4*angle)) * 0.38;
        particles.push(new Particle(cx, cy, "#ff69b4", vx, vy));
    }
}

function animate() {
    ctx.fillStyle = "rgba(139, 0, 0, 0.2)"; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Pháo hoa ngẫu nhiên (Tết)
    if (isTabActive && currentState === "WISHES" && Math.random() < 0.06 && !isEasterEggRunning) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * (canvas.height * 0.4);
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // ĐỒNG BỘ: Phát tiếng nổ nhẹ hơn cho pháo hoa nền
        playFireworkSFX(0.3);

        for(let i=0; i<35; i++) {
            particles.push(new Particle(x, y, color, (Math.random()-0.5)*11, (Math.random()-0.5)*11));
        }
    }

    particles.forEach((p, i) => {
        p.update(); p.draw();
        if (p.alpha <= 0) particles.splice(i, 1);
    });
    requestAnimationFrame(animate);
}
animate();

// 6. Hiệu ứng rơi (Vừa phải)
function startRain() {
    setInterval(() => {
        const img = document.createElement("img");
        const type = Math.random();
        if (type < 0.7) { 
            img.src = "images/mai.png"; img.className = "mayflower"; img.style.width = "20px";
        } else {
            img.src = type < 0.85 ? "images/thit_kho.png" : "images/banh_tet.png";
            img.className = "food-floating"; img.style.width = "38px";
        }
        img.style.left = Math.random() * 100 + "vw";
        img.style.animationDuration = (Math.random() * 3 + 4) + "s";
        document.body.appendChild(img);
        setTimeout(() => img.remove(), 6500);
    }, 380); 
}
