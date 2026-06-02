/* =========================================
   DETECÇÃO DE DISPOSITIVO
========================================= */

const deviceInfo =
document.getElementById("deviceInfo");

function detectDevice(){

  if(!deviceInfo) return;

  const width = window.innerWidth;

  if(width <= 600){
    deviceInfo.textContent =
    "📱 Dispositivo: Celular";
  }
  else if(width <= 1024){
    deviceInfo.textContent =
    "📟 Dispositivo: Tablet";
  }
  else{
    deviceInfo.textContent =
    "🖥️ Dispositivo: PC";
  }

}

detectDevice();

window.addEventListener(
  "resize",
  detectDevice
);

/* =========================================
   LOADING SCREEN
========================================= */

const loadingScreen =
document.getElementById("loadingScreen");

const barFill =
document.getElementById("barFill");

const loadingPercent =
document.getElementById("loadingPercent");

const loadingStatus =
document.getElementById("loadingStatus");

const messages = [

  "Inicializando motor...",
  "Carregando física...",
  "Montando pista...",
  "Preparando veículos...",
  "Ativando efeitos neon...",
  "Sincronizando sistema...",
  "Quase pronto..."

];

/* duração total */

const TOTAL_TIME = 7000; // 7 segundos

let progress = 0;

const loadingInterval =
setInterval(()=>{

  progress++;

  barFill.style.width =
  progress + "%";

  loadingPercent.textContent =
  progress + "%";

  const msgIndex =
  Math.min(
    Math.floor(progress / 15),
    messages.length - 1
  );

  loadingStatus.textContent =
  messages[msgIndex];

  if(progress >= 100){

    clearInterval(
      loadingInterval
    );

    loadingStatus.textContent =
    "Concluído ✓";

    setTimeout(()=>{

      loadingScreen.style.transition =
      "opacity .8s ease";

      loadingScreen.style.opacity =
      "0";

      setTimeout(()=>{
      showScreen(subwayStart);

      },800);

    },500);

  }

}, TOTAL_TIME / 100);

const canvas = document.getElementById("game");
console.log("Script carregado");

window.onerror = function(msg, url, line){
  console.error("ERRO:", msg);
  console.error("LINHA:", line);
  alert("ERRO: " + msg + "\nLINHA: " + line);
};
canvas.style.touchAction = "none";

if(!canvas){
  throw new Error("Canvas #game não encontrado");
}

const ctx = canvas.getContext("2d");

if(!ctx){
  throw new Error("Contexto 2D não suportado");
}

window.addEventListener("focus", () => {
  if(gameRunning){
    paused = false;
  }
});

window.addEventListener("blur", () => {

  if(gameRunning){
    paused = true;
  }

});


/* =========================================
   TAMANHO
========================================= */

const W = 360;
const H = 640;

canvas.width = W;
canvas.height = H;
ctx.imageSmoothingEnabled = false;

/* =========================================
   ELEMENTOS
========================================= */

const scoreEl = document.getElementById("score");
const speedEl = document.getElementById("speed");
const moneyEl = document.getElementById("money");
const weatherEl = document.getElementById("weather");

const shieldTimeEl = document.getElementById("shield-time");
const nitroTimeEl = document.getElementById("nitro-time");
const tapPlay = document.getElementById("tap-play");
const subwayStart = document.getElementById("subway-start");
const gameOverScreen = document.getElementById("gameover-overlay");
const finalScore = document.getElementById("final-score");
const againBtn = document.getElementById("again");
const backMenuBtn = document.getElementById("back-menu");
const btnLeft = document.getElementById("btn-left");
const btnRight = document.getElementById("btn-right");
const btnNitro = document.getElementById("btn-nitro");
const menuBtn = document.getElementById("menu-btn");
const menuOptions = document.getElementById("menu-options");
const btnRestart = document.getElementById("btn-restart");
const btnHome = document.getElementById("btn-home");
const openGarage = document.getElementById("open-garage");
const garageScreen = document.getElementById("garage-screen");
const garageBack = document.getElementById("garage-back");
const paletteToggle = document.getElementById("palette-toggle");
const garagePalettes = document.getElementById("garage-palettes");
const colorButtons = document.querySelectorAll(".garage-color");

const toggleHUD =
document.getElementById("toggle-hud");

const toggleWeather =
document.getElementById("toggle-weather");

const toggleParticles =
document.getElementById("toggle-particles");

const togglePowerups =
document.getElementById("toggle-powerups");

const toggleNitroFX =
document.getElementById("toggle-nitrofx");

const toggleShadows =
document.getElementById("toggle-shadows");

const toggleArrows =
document.getElementById("toggle-arrows");

const openSettings = document.getElementById("open-settings");
const settingsScreen = document.getElementById("settings-screen");
const settingsBack = document.getElementById("settings-back");

/* =========================================
   ESTADO
========================================= */

let gameRunning = false;
let paused = true;
let score = 0;
let coins = 0;
let speed = 6;
let roadOffset = 0;
let weather = "LIMPO";
let weatherTimer = 0;
let shield = true;
let shieldTimer = 600;
let nitro = false;
let nitroTimer = 0;
let spawnTimer = 0;

/* =========================================
   PISTA
========================================= */

const roadX = 55;
const roadW = 250;
const laneW = roadW / 3;

/* =========================================
   PLAYER
========================================= */

const player = {
  lane:1,
  x:0,
  y:H - 110,
  w:36,
  h:78,
  color:"#00d0ff",
  targetX:0,
  tilt:0
};

player.x =
roadX + laneW * player.lane + laneW / 2;
player.targetX = player.x;

/* =========================================
   LISTAS
========================================= */

const obstacles = [];
const coinsList = [];
const particles = [];

/* =========================================
   HUD
========================================= */

function updateHUD(){

  if(scoreEl){
    scoreEl.textContent =
    Math.floor(score);
  }

  if(speedEl){
    speedEl.textContent =
    Math.floor(speed * 12);
  }
  
  if(moneyEl){
    moneyEl.textContent =
    coins;
  }
  
  if(weatherEl){
    weatherEl.textContent =
    weather;
  };

  shieldTimeEl.textContent =
  shield
  ? Math.floor(shieldTimer / 60)
  : "0";

  nitroTimeEl.textContent =
  nitro
  ? Math.floor(nitroTimer / 60)
  : "0";

}

/* =========================================
   RESET
========================================= */

function resetGame(){

  score = 0;
  coins = 0;
  speed = 6;
  roadOffset = 0;
  obstacles.length = 0;
  coinsList.length = 0;
  particles.length = 0;
  shield = true;
  shieldTimer = 600;
  nitro = false;
  nitroTimer = 0;
  player.lane = 1;
  player.x =
  roadX + laneW * player.lane + laneW / 2;
  player.targetX = player.x;
  player.wheelSpin = 0;

}

/* =========================================
   SPAWN INTELIGENTE
========================================= */

function laneBusy(lane){

  for(const o of obstacles){

    if(
      o.lane === lane &&
      o.y < 180
    ){
      return true;
    }

  }

  return false;

} 

function spawnObstacle(){
  const freeLanes = [];
  for(let i = 0; i < 3; i++){
    if(!laneBusy(i)){
      freeLanes.push(i);

    }

  }

  if(freeLanes.length <= 1){
    return;

  }

  const lane =
  freeLanes[
    Math.floor(Math.random() * freeLanes.length)
  ];

  const npcColors = [
    "#ff3355",
    "#ffd54a",
    "#00ff88",
    "#b26cff",
    "#ffffff"
  ];

  obstacles.push({
    lane,
    x:
    roadX +
    laneW * lane +
    laneW / 2,
    y:-120,
    speed:
    speed * (.82 + Math.random() * .18),
    color:
    npcColors[
      Math.floor(Math.random() * npcColors.length)
    ],

  });

}

function spawnCoin(){
  const lane =
  Math.floor(Math.random() * 3);
  coinsList.push({
    lane,
    x:
    roadX +
    laneW * lane +
    laneW / 2,
    y:-40,
    spin:0

  });

}

if(obstacles.length < 6){
  spawnObstacle();
}

/* =========================================
   PISTA
========================================= */

function drawRoad(){

  const bg =
  ctx.createLinearGradient(0,0,0,H);
  if(weather === "NOITE"){
    bg.addColorStop(0,"#02040a");
    bg.addColorStop(1,"#000");

  }else{

    bg.addColorStop(0,"#13233f");
    bg.addColorStop(1,"#020308");

  }

  ctx.fillStyle = bg;
  ctx.fillRect(0,0,W,H);

  ctx.fillStyle = "rgba(255,255,255,0.03)";
  ctx.fillRect(0,0,W,H);

  /* LATERAIS TRANSPARENTES */

const sideGrad =
ctx.createLinearGradient(0,0,0,H);

sideGrad.addColorStop(0,"rgba(0,0,0,.10)");
sideGrad.addColorStop(1,"rgba(0,0,0,.35)");

ctx.fillStyle = sideGrad;
ctx.fillRect(0,0,roadX,H);
ctx.fillRect( roadX + roadW, 0, roadX, H);

  /* ASFALTO */

  ctx.fillStyle = "#161b24";
  ctx.fillRect( roadX, 0, roadW, H);

  /* REFLEXO */

  ctx.globalAlpha = .05;
  ctx.fillStyle = "#00d0ff";
  for(let y = -120; y < H + 120; y += 120){
    ctx.fillRect(
      roadX,
      y + (roadOffset % 120),
      roadW,
      25
    );

  }

  ctx.globalAlpha = 1;

  /* BORDAS */

  ctx.shadowBlur = 15;
  ctx.shadowColor = "#00d0ff";
  ctx.fillStyle = "#00d0ff";
  ctx.fillRect(roadX - 2, 0, 2, H);

  ctx.fillRect( roadX + roadW, 0, 2, H);
  ctx.shadowBlur = 0;

  /* LINHAS */

  for(let i = 1; i < 3; i++){
    const x =
    roadX + laneW * i;
    for(let y = -80; y < H + 80; y += 80){
      ctx.fillStyle = "#fff";
      ctx.fillRect( x - 2, y + (roadOffset % 80), 4, 40);

    }

  }

}

/* =========================================
   RODA ULTRA REALISTA
========================================= */

function drawWheel(x, y){
  ctx.save();
  ctx.translate(x, y);

  /* =========================================
     SOMBRA
  ========================================= */

  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(0,0,0,.6)";

  /* =========================================
     PNEU
  ========================================= */

  const tireGrad =
  ctx.createLinearGradient( 0, -12, 0, 12);
  tireGrad.addColorStop(0, "#2b2b2b");
  tireGrad.addColorStop(.5, "#050505");
  tireGrad.addColorStop(1, "#1a1a1a");
  ctx.fillStyle = tireGrad;
  ctx.beginPath();
  ctx.rect( -7, -13, 14, 26);
  ctx.fill();


  /* =========================================
     BORDA DO PNEU
  ========================================= */

  ctx.strokeStyle = "#555";
  ctx.lineWidth = 1;
  ctx.stroke();


  /* =========================================
   REFLEXO REALISTA
========================================= */

const glow =
ctx.createLinearGradient( -4, -10, 2, 8);
glow.addColorStop( 0, "rgba(255,255,255,.16)");
glow.addColorStop( .4, "rgba(255,255,255,.05)");
glow.addColorStop( 1, "rgba(255,255,255,0)");
ctx.fillStyle = glow;
ctx.beginPath();
ctx.rect( -4, -9, 3, 16);
ctx.fill();

  /* =========================================
     MOTION BLUR
  ========================================= */

  if(speed > 8){
    ctx.globalAlpha = .10;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(-2, -18, 4, 36);
    ctx.globalAlpha = 1;

  }

  ctx.restore();

}

/* =========================================
   CARRO F1
========================================= */

function drawF1(car,isEnemy = false){
  ctx.save();
  ctx.translate(car.x,car.y);
  ctx.rotate(car.tilt || 0);

  /* =========================================
     NITRO
  ========================================= */

  if(!isEnemy){
    const nitroGrad =
    ctx.createLinearGradient(0,30,0,120);
    nitroGrad.addColorStop(0,
    nitro ? "#ff6600" : car.color);
    nitroGrad.addColorStop(1, "transparent");
    ctx.globalAlpha = .9;
    ctx.fillStyle = nitroGrad;
    ctx.beginPath();
    ctx.moveTo(-12,34);
    ctx.lineTo(12,34);
    ctx.lineTo(28,120);
    ctx.lineTo(-28,120);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 1;

  }

  /* =========================================
     SOMBRA NEON
  ========================================= */

  ctx.shadowBlur = 25;
  ctx.shadowColor = car.color;

  /* =========================================
     ASA FRENTE
  ========================================= */

  ctx.fillStyle =
  isEnemy ? "#111" : "#050505";
  ctx.beginPath();
  ctx.rect( -32, -42, 64, 10);
  ctx.fill();

  /* =========================================
     PONTA F1
  ========================================= */

  ctx.fillStyle = car.color;

  ctx.beginPath();
  ctx.moveTo(0,-64);
  ctx.lineTo(10,-42);
  ctx.lineTo(-10,-42);
  ctx.closePath();
  ctx.fill();

  /* =========================================
     NARIZ
  ========================================= */

  ctx.beginPath();
  ctx.rect( -7, -48, 14, 28);
  ctx.fill();

  /* =========================================
     CORPO PRINCIPAL
  ========================================= */

  const bodyGrad =
  ctx.createLinearGradient( 0,-35, 0, 45);

  bodyGrad.addColorStop(
    0,
    "#ffffff22"
  );

  bodyGrad.addColorStop(
    .15,
    car.color
  );

  bodyGrad.addColorStop(
    1,
    "#111"
  );

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.rect( -18, -34, 36, 84);
  ctx.fill();

  /* =========================================
     LINHA CENTRAL
  ========================================= */

  ctx.fillStyle =
  "rgba(255,255,255,.35)";
  ctx.beginPath();
  ctx.rect( -3, -24, 6, 58);
  ctx.fill();

  /* =========================================
     COCKPIT
  ========================================= */

  ctx.fillStyle =
  isEnemy
  ? "#222"
  : "#050505";
  ctx.beginPath();
  ctx.rect( -10, -4, 20, 30);
  ctx.fill();

  /* VIDRO */

  ctx.fillStyle =
  "rgba(120,220,255,.35)";
  ctx.beginPath();
  ctx.rect( -6, 1, 12, 14);
  ctx.fill();

  /* =========================================
     ENTRADAS LATERAIS
  ========================================= */

  ctx.fillStyle =
  "rgba(0,0,0,.45)";

  ctx.beginPath();
  ctx.rect(-24,-2,8,20);
  ctx.fill();

  ctx.beginPath();
  ctx.rect(16,-2,8,20);
  ctx.fill();

  /* =========================================
     ASA TRASEIRA
  ========================================= */

  ctx.fillStyle =
  isEnemy ? "#111" : "#000";
  ctx.beginPath();
  ctx.rect( -28, 42, 56, 10);
  ctx.fill();

  /* SUPORTE ASA */

  ctx.fillStyle =
  "rgba(255,255,255,.2)";
  ctx.fillRect(-3,32,6,12);

  /* =========================================
     RODAS
  ========================================= */

  drawWheel(-26,-18);
  drawWheel(26,-18);
  drawWheel(-26,24);
  drawWheel(26,24);

  /* =========================================
     DETALHE DAS RODAS
  ========================================= */

  ctx.fillStyle =
  "rgba(255,255,255,.12)";

  ctx.beginPath();
  ctx.arc(-26,-18,4,0,Math.PI*2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(26,-18,4,0,Math.PI*2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(-26,24,4,0,Math.PI*2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(26,24,4,0,Math.PI*2);
  ctx.fill();

  /* =========================================
     ESCUDO
  ========================================= */

  if(shield && !isEnemy){

    ctx.strokeStyle =
    "rgba(0,255,255,.8)";

    ctx.lineWidth = 4;

    ctx.shadowBlur = 20;

    ctx.shadowColor = "#00ffff";

    ctx.beginPath();

    ctx.arc(
      0,
      0,
      42 +
      Math.sin(performance.now() * .01) * 3,
      0,
      Math.PI * 2
    );

    ctx.stroke();

  }

  ctx.restore();

}

/* =========================================
   MOEDAS
========================================= */

function drawCoins(){

  for(const c of coinsList){
    c.spin += .08;
    ctx.save();
    ctx.translate(c.x,c.y);
    ctx.rotate(c.spin);
    ctx.shadowBlur = 20;
    ctx.shadowColor = "gold";
    ctx.fillStyle = "#ffd54a";
    ctx.beginPath();
    ctx.arc(0,0,12,0,Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.fillText("$",0,5);
    ctx.restore();

  }

}

/* =========================================
   PARTICULAS
========================================= */

function createNitroParticles(){

  if(!nitro) return;
  for(let i = 0; i < 2; i++){
    if(particles.length < 120){
      particles.push({
      x:
      player.x +
      (Math.random() - .5) * 16,
      y:
      player.y + 32,
      size:
      Math.random() * 5 + 2,
      speed:
      Math.random() * 6 + 2,
      color:"#ff6600",
      life:1
     });
   }
  }

}

function drawParticles(){

  for(
    let i = particles.length - 1;
    i >= 0;
    i--
  ){

    const p = particles[i];
    p.y += p.speed;
    p.life -= .03;
    ctx.globalAlpha = p.life;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(
      p.x,
      p.y,
      p.size,
      0,
      Math.PI * 2
    );

    ctx.fill();
    ctx.globalAlpha = 1;
    if(p.life <= 0){
      particles.splice(i,1);

    }

  }

}

/* =========================================
   CLIMA
========================================= */

function updateWeather(){

  weatherTimer++;
  if(weatherTimer > 800){
    weatherTimer = 0;
    const list = [
      "LIMPO",
      "CHUVA",
      "NEVE",
      "NOITE"
    ];

    weather =
    list[
      Math.floor(Math.random() * list.length)
    ];

  }

  if(weather === "CHUVA"){
    ctx.strokeStyle =
    "rgba(180,220,255,.4)";
    for(let i = 0; i < 25; i++){
      const x = Math.random() * W;
      const y = Math.random() * H;
      ctx.beginPath();
      ctx.moveTo(x,y);
      ctx.lineTo(x - 3,y + 12);
      ctx.stroke();

    }

  }

  if(weather === "NEVE"){
    ctx.fillStyle =
    "rgba(255,255,255,.8)";
    for(let i = 0; i < 18; i++){
      const x = Math.random() * W;
      const y = Math.random() * H;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();

    }

  }

}

/* =========================================
   GAME OVER
========================================= */

function gameOver(){

  if(shield){
    shield = false;
    return;
  }

  gameRunning = false;
  finalScore.textContent =
  Math.floor(score);
  gameOverScreen.style.display = "grid";

}

/* =========================================
   UPDATE
========================================= */

function updateGame(){
  roadOffset += speed;
  score += .12;
  if(speed < 14){
    speed += .0015;
  
  }

  if(roadOffset > 100000){
    roadOffset = 0;
   }



  /* MOVIMENTO SUAVE */

  player.x +=
  (player.targetX - player.x) * .18;
  player.tilt *= .84;




  /* NITRO */

  if(nitro){
    nitroTimer--;
    if(nitroTimer <= 0){
      nitro = false;
      speed = Math.max(6, speed - 4);

    }

  }

  /* ESCUDO */

  if(shield){
    shieldTimer--;
    if(shieldTimer <= 0){
      shield = false;

    }

  }

    /* SPAWN */

        spawnTimer++;
    if(spawnTimer > 45){
        spawnObstacle();
        spawnTimer = 0;

    }

    if(Math.random() < .01){
        spawnCoin();
    }

    /* OBSTACULOS */

    for(
        let i = obstacles.length - 1;
        i >= 0;
        i--
    ){

        const o = obstacles[i];
        o.y += o.speed;


    /* IA MELHORADA */

    if(
        Math.abs(o.y - player.y) < 180 &&
        o.lane === player.lane
    ){

    /* movimento suave */

    o.x += Math.sin(performance.now() * 0.002 + o.y) * 0.15;

    /* limite da pista */

        const minX =
        roadX +
        laneW * o.lane +
        20;

        const maxX =
        roadX +
        laneW * o.lane +
        laneW - 20;

    if(o.x < minX){
        o.x = minX;

    }

    if(o.x > maxX){
        o.x = maxX;

    }

    }

    if(
      Math.abs(player.x - o.x) < 22 &&
      Math.abs(player.y - o.y) < 42
    ){

      gameOver();

    }

    if(o.y > H + 120){
      obstacles.splice(i,1);

    }

  }

  /* MOEDAS */

  for(
    let i = coinsList.length - 1;
    i >= 0;
    i--
  ){

    const c = coinsList[i];
    c.y += speed;

    if(

      Math.abs(player.x - c.x) < 28 &&
      Math.abs(player.y - c.y) < 50

    ){

      coins += 10;
      coinsList.splice(i,1);

    }

    if(c.y > H + 50){
      coinsList.splice(i,1);

    }

  }

}

/* =========================================
   RENDER
========================================= */


function renderGame(){

  ctx.setTransform(1,0,0,1,0,0);

  if(speed > 11 && nitro){
    const camShake =
    (Math.random() - .5) * .8;
    ctx.translate(camShake,0);

  }

  drawRoad();
  if(
    toggleParticles &&
    toggleParticles.checked
  ){
    createNitroParticles();
  }
  if(
    toggleParticles &&
    toggleParticles.checked
  ){
    drawParticles();
  }
  drawCoins();
  for(const o of obstacles){
    drawF1(o,true);

  }

  drawF1(player,false);
  if(
    toggleWeather &&
    toggleWeather.checked
  ){
    updateWeather();
  }
  updateHUD();

}

/* REMOVER / MOSTRAR SETAS */

const removeArrowsBtn =
document.getElementById(
  "remove-arrows-btn"
);

let arrowsVisible = true;

if(removeArrowsBtn){

  removeArrowsBtn.addEventListener(
    "click",
    () => {

      arrowsVisible = !arrowsVisible;

      if(btnLeft){
        btnLeft.style.display =
        arrowsVisible ? "flex" : "none";
      }

      if(btnRight){
        btnRight.style.display =
        arrowsVisible ? "flex" : "none";
      }

      removeArrowsBtn.textContent =
      arrowsVisible
      ? "🎮 Remover Setas"
      : "🎮 Mostrar Setas";

    }
  );

}

/* =========================================
   HUD VISIBILITY
========================================= */

function updateHUDVisibility(){

  const hud =
  document.querySelector(".hud");

  if(!hud) return;

  hud.style.display =
  toggleHUD && toggleHUD.checked
  ? "flex"
  : "none";

}

updateHUDVisibility();

if(toggleHUD){

  toggleHUD.addEventListener(
    "change",
    updateHUDVisibility
  );

}

let animationId = null;

/* =========================================
   LOOP
========================================= */

function loop(){
  if(!gameRunning){
    cancelAnimationFrame(animationId);
    return;
  }

  if(!paused){
    ctx.setTransform(1,0,0,1,0,0);
    updateGame();
    renderGame();

  }

  animationId =
  requestAnimationFrame(loop);

}

/* =========================================
   START
========================================= */

function startGame(){
  cancelAnimationFrame(animationId);
  resetGame();
  subwayStart.style.display = "none";
  gameOverScreen.style.display = "none";
  menuOpen = false;

  if(menuOptions){
    menuOptions.style.display = "none";
}
gameRunning = true;
paused = false;

loop();

}

/* =========================================
   MOVIMENTO
========================================= */

function moveLeft(){
  if(player.lane > 0){
    player.lane--;
    player.targetX =
    roadX +
    laneW * player.lane +
    laneW / 2;
    player.tilt = -.18;

  }

}

function moveRight(){
  if(player.lane < 2){
    player.lane++;
    player.targetX =
    roadX +
    laneW * player.lane +
    laneW / 2;
    player.tilt = .18;

  }

}

/* =========================================
   NITRO
========================================= */

function activateNitro(){

  if(nitro || speed > 14){
    return;
  }

  nitro = true;
  nitroTimer = 240;
  speed += 4;

}

/* =========================================
   EVENTOS + TECLADO + CONFIG
========================================= */

/* PLAY */

if(tapPlay){
  tapPlay.addEventListener(
    "click",
    startGame
  );
}

/* AGAIN */

if(againBtn){
  againBtn.addEventListener(
    "click",
    startGame
  );
}

/* RESTART */

if(btnRestart){
  btnRestart.addEventListener(
    "click",
    startGame
  );
}

/* BACK MENU */

if(backMenuBtn){
  backMenuBtn.addEventListener("click", () => {
      gameRunning = false;

      cancelAnimationFrame(animationId);

      if(gameOverScreen){
        gameOverScreen.style.display = "none";
      }

      if(subwayStart){
        subwayStart.style.display = "flex";
      }

    }
  );
}

/* HOME */

if(btnHome){
  btnHome.addEventListener("click", () => {
      gameRunning = false;

      cancelAnimationFrame(animationId);

      paused = false;

      menuOpen = false;

      if(menuOptions){
        menuOptions.style.display =
        menuOpen ? "flex" : "none";
      };

      if(garageScreen){
        garageScreen.style.display = "none";
      }

      if(settingsScreen){
        settingsScreen.style.display = "none";
      }

      if(subwayStart){
        subwayStart.style.display = "flex";
      }

    }
  );
}

/* BOTÕES MOBILE */

if(btnLeft){
  btnLeft.addEventListener(
    "click",
    moveLeft
  );
}

if(btnRight){
  btnRight.addEventListener(
    "click",
    moveRight
  );
}

if(btnNitro){
  btnNitro.addEventListener(
    "click",
    activateNitro
  );
}

/* =========================================
   MENU PAUSE
========================================= */

let menuOpen = false;

function togglePauseMenu(){

  if(!gameRunning){
    return;
  }

  menuOpen = !menuOpen;
  paused = menuOpen;

  if(menuOptions){

    if(menuOpen){

      menuOptions.style.display = "flex";

      setTimeout(() => {
        menuOptions.classList.add("active");
      },10);

    }else{

      menuOptions.classList.remove("active");

      setTimeout(() => {
        menuOptions.style.display = "none";
      },250);

    }

  }

}

/* BOTÃO MENU */

if(menuBtn){

  menuBtn.addEventListener(
    "click",
    togglePauseMenu
  );

}

/* =========================================
   GARAGEM
========================================= */

if(openGarage){

  openGarage.addEventListener(
    "click",
    () => {

      showScreen(garageScreen);

    }
  );

}

/* VOLTAR GARAGEM */

if(garageBack){

  garageBack.addEventListener(
    "click",
    () => {

      showScreen(subwayStart);

    }
  );

}

/* =========================================
   CONFIGURAÇÕES
========================================= */

function closeAllScreens(){

  if(subwayStart){
    subwayStart.style.display = "none";
  }

  if(garageScreen){
    garageScreen.style.display = "none";
  }

  if(settingsScreen){
    settingsScreen.style.display = "none";
  }

  if(menuOptions){
    menuOptions.style.display = "none";
  }

}

function showScreen(screen){

  if(subwayStart){
    subwayStart.style.display = "none";
  }

  if(garageScreen){
    garageScreen.style.display = "none";
  }

  if(settingsScreen){
    settingsScreen.style.display = "none";
  }

  if(loadingScreen){
    loadingScreen.style.display = "none";
  }

  screen.style.display = "flex";
}

/* ABRIR CONFIG */

if(openSettings){

  openSettings.addEventListener(
    "click",
    () => {

      showScreen(settingsScreen);

    }
  );

}

/* FECHAR CONFIG */

if(settingsBack){

  settingsBack.addEventListener(
    "click",
    () => {

      showScreen(subwayStart);

    }
  );

}

/* =========================================
   PALETA DE CORES
========================================= */

if(paletteToggle){

  paletteToggle.addEventListener(
    "click",
    () => {

      if(!garagePalettes){
        return;
      }

      const isOpen =
      garagePalettes.classList.contains("active");

      if(isOpen){

        garagePalettes.classList.remove("active");

        garagePalettes.style.display = "none";

      }else{

        garagePalettes.classList.add("active");

        garagePalettes.style.display = "grid";

      }

    }
  );

}

/* =========================================
   TECLADO PC
========================================= */

document.addEventListener(
  "keydown",
  e => {

    const key =
    e.key.toLowerCase();

    /* ESQUERDA */

    if(
      key === "arrowleft" ||
      key === "a"
    ){
      moveLeft();
    }

    /* DIREITA */

    if(
      key === "arrowright" ||
      key === "d"
    ){
      moveRight();
    }

    /* NITRO */

    if(
      key === "shift" ||
      key === "w"
    ){
      activateNitro();
    }

    /* MENU */

    if(
      key === "escape" &&
      gameRunning
    ){
      togglePauseMenu();
    }
    }
);

/* =========================================
   MUDAR COR DO CARRO
========================================= */

colorButtons.forEach(btn => {

  btn.addEventListener(
    "click",
    () => {

      /* remove seleção antiga */

      colorButtons.forEach(b => {
        b.classList.remove("active");
      });

      /* adiciona seleção atual */

      btn.classList.add("active");

      /* pega cor */

      const color =
      btn.dataset.color;

      /* muda cor do player */

      player.color = color;

      /* muda brilho da garagem */

      document.documentElement.style.setProperty(
        "--garage-color",
        color
      );

      /* muda glow */

      const glow =
      document.querySelector(".garage-car-glow");

      if(glow){
      glow.style.background =
      `radial-gradient(circle, ${color}, transparent 70%)`;
      }

      /* muda corpo do carro da garagem */

      document.querySelectorAll(
        ".f1-body, .f1-nose"
      ).forEach(part => {

        part.style.background = color;
        part.style.boxShadow =
        `0 0 35px ${color}`;

      });

    }
  );

});

/* =========================================
   PRIMEIRO DRAW
========================================= */

drawRoad();

if(speed > 10){
  ctx.globalAlpha = .08;
  ctx.fillStyle = "#00d0ff";
  for(let i = 0; i < 15; i++){
    ctx.fillRect(
      Math.random() * W,
      Math.random() * H, 2, 30 );

  }

  ctx.globalAlpha = 1;

}

drawF1(player,false);

/* =========================================
   TOUCH POR TOQUE (SEM ARRASTAR)
========================================= */

canvas.addEventListener(
  "touchstart",
  e => {

    e.preventDefault();

    const touch = e.touches[0];

    const rect = canvas.getBoundingClientRect();

    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    /* NITRO = PARTE DE BAIXO */

    if(y > H * 0.75){

      activateNitro();
      return;

    }

    /* ESQUERDA */

    if(x < W / 2){

      moveLeft();

    }

    /* DIREITA */

    else{

      moveRight();

    }

  },
  { passive:false }
);
