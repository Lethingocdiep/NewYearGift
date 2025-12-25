/* =====================
   DOM
===================== */
const heart = document.getElementById("heart");
const heartContainer = document.getElementById("heart-container");
const envelopeContainer = document.getElementById("envelope-container");
const messageContainer = document.getElementById("message-container");

const thumpSound = new Audio("audio/thump.mp3");
const popSound = document.getElementById("popSound");
const backgroundMusic = document.getElementById("backgroundMusic");
const fireworkSound = document.getElementById("fireworksSound");

/* =====================
   ❤️ HEART BEAT (BPM REAL)
===================== */
let heartBPM = 92;
let heartInterval = null;
let heartClicked = false;

thumpSound.volume = 0.8;
thumpSound.playbackRate = 0.95;

function startHeartBeat() {
    if (heartInterval || heartClicked) return;

    const interval = 60000 / heartBPM;
    heartInterval = setInterval(() => {
        thumpSound.currentTime = 0;
        thumpSound.play().catch(()=>{});
    }, interval);
}

function stopHeartBeat() {
    if (heartInterval) {
        clearInterval(heartInterval);
        heartInterval = null;
    }
}

window.addEventListener("load", startHeartBeat);

/* =====================
   STATE
===================== */
fireworkSound.volume = 0.6;
let popPlayed = false;
let foodStarted = false;
let tabActive = true;

/* =====================
   CLICK TRÁI TIM
===================== */
heart.addEventListener("click", () => {
    heartClicked = true;
    stopHeartBeat();

    heartContainer.classList.add("fade-out");

    setTimeout(() => {
        heartContainer.classList.add("hidden");
        envelopeContainer.classList.remove("hidden");
    }, 600);

    createMaiRain();

    if (!foodStarted) {
        foodStarted = true;
        setInterval(spawnFood, 4000);
    }

    backgroundMusic.volume = 0;
    backgroundMusic.loop = true;
    backgroundMusic.play();

    let fade = setInterval(() => {
        if (backgroundMusic.volume < 0.3) {
            backgroundMusic.volume += 0.01;
        } else clearInterval(fade);
    }, 100);
});

/* =====================
   CLICK PHONG BAO
===================== */
document.getElementById("envelope").addEventListener("click", () => {
    envelopeContainer.classList.add("hidden");
    messageContainer.classList.remove("hidden");

    if (!popPlayed) {
        popSound.volume = 0.8;
        popSound.play();
        popPlayed = true;
    }

    launchFireworks();
});

/* =====================
   🌼 HOA MAI
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

/* =====================
   🎆 CANVAS
===================== */
const canvas = document.getElementById("fireworks-canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let fireworks = [];
let textParticles = [];
let textPoints = [];
let textPhase = "idle";
let heartBursted = false;

/* =====================
   PHÁO HOA
===================== */
function launchFireworks() {
    setInterval(() => {
        if (!tabActive || textPhase !== "idle") return;

        fireworks.push({
            x: Math.random() * canvas.width,
            y: canvas.height,
            targetY: Math.random() * canvas.height * 0.4,
            exploded: false,
            particles: []
        });
    }, 700);

    animate();
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (textPhase !== "idle") handleTextFirework();

    fireworks.forEach((fw, i) => {
        if (!fw.exploded) {
            fw.y -= 5;
            drawDot(fw.x, fw.y, "#fff");

            if (fw.y <= fw.targetY) {
                fw.exploded = true;
                if (tabActive) {
                    fireworkSound.currentTime = 0;
                    fireworkSound.play();
                }

                for (let p = 0; p < 30; p++) {
                    fw.particles.push({
                        x: fw.x,
                        y: fw.y,
                        a: Math.random() * Math.PI * 2,
                        s: 2 + Math.random() * 3,
                        l: 40
                    });
                }
            }
        } else {
            fw.particles.forEach(pt => {
                pt.x += Math.cos(pt.a) * pt.s;
                pt.y += Math.sin(pt.a) * pt.s;
                pt.l--;
                drawDot(pt.x, pt.y, randomColor());
            });
            fw.particles = fw.particles.filter(p => p.l > 0);
        }

        if (fw.exploded && fw.particles.length === 0) fireworks.splice(i, 1);
    });

    requestAnimationFrame(animate);
}

/* =====================
   TEXT FIREWORK
===================== */
function generateTextPoints(text) {
    const off = document.createElement("canvas");
    off.width = canvas.width;
    off.height = canvas.height;
    const c = off.getContext("2d");

    c.font = "bold 120px Segoe UI";
    c.textAlign = "center";
    c.textBaseline = "middle";
    c.fillText(text, off.width / 2, off.height * 0.45);

    const d = c.getImageData(0,0,off.width,off.height).data;
    textPoints = [];

    for (let y=0;y<off.height;y+=4){
        for (let x=0;x<off.width;x+=4){
            if (d[(y*off.width+x)*4+3]>150) textPoints.push({x,y});
        }
    }
}

function startTextFirework() {
    if (textPhase !== "idle") return;

    messageContainer.classList.add("hidden-soft");
    generateTextPoints("Ich vermisse dich");

    textParticles = [];
    heartBursted = false;
    textPhase = "rain";

    for (let i=0;i<800;i++){
        textParticles.push({
            x: Math.random()*canvas.width,
            y: -Math.random()*canvas.height,
            vy: 3+Math.random()*3,
            target: textPoints[i % textPoints.length],
            vx: 0,
            life: 60,
            color: randomColor()
        });
    }

    setTimeout(()=> textPhase="gather",1500);
}

function handleTextFirework(){
    textParticles.forEach(p=>{
        if (textPhase==="rain") p.y+=p.vy;
        if (textPhase==="gather"||textPhase==="hold"){
            p.x+=(p.target.x-p.x)*0.08;
            p.y+=(p.target.y-p.y)*0.08;
        }
        if (textPhase==="explode"){
            p.x+=p.vx;
            p.y+=p.vy;
            p.life--;
        }
        drawDot(p.x,p.y,p.color);
    });

    if (textPhase==="gather"&&!heartBursted){
        heartBursted=true;
        burstHeartFireworks();
        setTimeout(()=>textPhase="hold",800);
    }

    if (textPhase==="hold"){
        setTimeout(()=>{
            textPhase="explode";
            textParticles.forEach(p=>{
                p.vx=Math.cos(Math.random()*Math.PI*2)*4;
                p.vy=Math.sin(Math.random()*Math.PI*2)*4;
            });
        },3500);
    }

    if (textPhase==="explode"){
        textParticles=textParticles.filter(p=>p.life>0);
        if (!textParticles.length){
            textPhase="idle";
            messageContainer.classList.remove("hidden-soft");
        }
    }
}

/* 💗 PHÁO HOA TRÁI TIM */
function burstHeartFireworks(){
    const cx = canvas.width/2;
    const cy = canvas.height*0.45;

    for(let i=0;i<120;i++){
        const t = i/120*Math.PI*2;
        fireworks.push({
            exploded:true,
            particles:[{
                x:cx,
                y:cy,
                a:t,
                s:2.5,
                l:40,
                color: i%2?"#ff66cc":"#ffffff"
            }]
        });
    }
}

/* =====================
   DRAW DOT
===================== */
function drawDot(x,y,color){
    ctx.beginPath();
    ctx.arc(x,y,4,0,Math.PI*2);
    ctx.fillStyle=color;
    ctx.shadowBlur=14;
    ctx.shadowColor=color;
    ctx.fill();
    ctx.shadowBlur=0;
}

function randomColor(){
    return ["#ff4d4d","#ffd700","#ff66cc","#ffffff"]
        [Math.floor(Math.random()*4)];
}

/* =====================
   ĐỒ ĂN
===================== */
function spawnFood(){
    const items=["thit_kho.png","banh_tet.png"];
    const img=document.createElement("img");
    img.src="images/"+items[Math.floor(Math.random()*items.length)];
    img.className="food-floating";
    img.style.left=Math.random()*100+"vw";
    img.style.animationDuration=8+Math.random()*5+"s";
    document.body.appendChild(img);
    setTimeout(()=>img.remove(),15000);
}

/* =====================
   TAB VISIBILITY
===================== */
document.addEventListener("visibilitychange",()=>{
    tabActive=!document.hidden;
    if (tabActive && !messageContainer.classList.contains("hidden")) {
        startTextFirework();
    }
});
