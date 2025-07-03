const BTN_DIAMETER = 120;   // Ø przycisku "DALEJ" (px)
const BTN_OFFSET = 100;     // odstęp od inputu (px)
const HOVER_SCALE = 1.05;   // powiększenie przy hoverze

let ageInput;
let ageValue = '';
let futuraFont;
let backgroundImage;
let customCursor;
let glitterParticles = [];
let soundBrokat, soundBoo;
let booPlayed = false;

let btnX, btnY, btnR;
let dalejVisible = false;
let scene = 1;

let rawDalejImg, dalejImg;

function preload() {
  futuraFont = loadFont('futura.ttf');
  backgroundImage = loadImage('t.wiek.png');
  customCursor = loadImage('flowerMouse.png');
  soundBrokat = loadSound('brokat.wav');
  soundBoo = loadSound('boo.wav');
  
  rawDalejImg = loadImage('PrzyciskDALEJ.png'); // dodaj swój obrazek przycisku "DALEJ"
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textAlign(CENTER, CENTER);

  // maska okrągłego przycisku DALEJ
  const s = min(rawDalejImg.width, rawDalejImg.height);
  dalejImg = createImage(s, s);
  rawDalejImg.loadPixels();
  dalejImg.copy(
    rawDalejImg,
    (rawDalejImg.width  - s) / 2,
    (rawDalejImg.height - s) / 2,
    s, s,
    0, 0, s, s
  );
  const maskG = createGraphics(s, s);
  maskG.noStroke(); maskG.fill(255);
  maskG.circle(s / 2, s / 2, s);
  dalejImg.mask(maskG);

  ageInput = createInput('');
  ageInput.attribute('type', 'number');
  ageInput.size(200, 36);
  ageInput.style('font-size', '20px');
  ageInput.style('border-radius', '18px');
  ageInput.style('border', '2px solid #e1a4e9');
  ageInput.style('padding', '6px 12px');
  ageInput.style('text-align', 'center');
  ageInput.input(handleAgeInput);

  centerInput();

  noCursor();
}

function draw() {
  background(255);
  image(backgroundImage, 0, 0, width, height);

  fill(0);
  textFont(futuraFont);

  if (ageValue !== '') {
    textSize(32);
    if (ageValue < 30) {
      text(`Zostało Ci ${30 - ageValue} lat`, width / 2, height / 2 - 80);
      text("lat/lata, żeby móc mieć dziecko!", width / 2, height / 2 - 40);
    } else {
      text('Upss, za późno - już nigdy nie będziesz mieć dzieci', width / 2, height / 2 - 60);
    }
  }

  // Rysowanie przycisku DALEJ, jeśli jest widoczny
  if (dalejVisible) {
    btnX = windowWidth / 2;
    btnY = windowHeight / 2 + 36 + BTN_OFFSET;
    btnR = BTN_DIAMETER / 2;

    const over = dist(mouseX, mouseY, btnX, btnY) < btnR;
    const d = over ? BTN_DIAMETER * HOVER_SCALE : BTN_DIAMETER;

    imageMode(CENTER);
    image(dalejImg, btnX, btnY, d, d);
    imageMode(CORNER);
  }

  // Glitter efekt
  for (let i = glitterParticles.length - 1; i >= 0; i--) {
    glitterParticles[i].update();
    glitterParticles[i].show();
    if (glitterParticles[i].finished()) {
      glitterParticles.splice(i, 1);
    }
  }

  image(customCursor, mouseX, mouseY, 32, 32);
}

function handleAgeInput() {
  let val = ageInput.value();

  // blokada wpisywania wartości mniejszych niż zero
  if (val === '') {
    ageValue = '';
    dalejVisible = false;
    return;
  }

  let numVal = Number(val);

  if (isNaN(numVal) || numVal < 0) {
    // jeśli wartość ujemna lub nie liczba — ustaw na 0 i input też popraw
    numVal = 0;
    ageInput.value('0');
  }

  ageValue = numVal;
  dalejVisible = ageValue >= 0;  // przycisk widoczny od 0 wzwyż

  // odtwarzaj brokat za każdym razem przy wpisie poprawnej wartości
  if (soundBrokat.isLoaded()) soundBrokat.play();

  // odtwarzaj boo tylko raz, gdy przekroczysz 30
  if (ageValue >= 30 && !booPlayed) {
    if (soundBoo.isLoaded()) soundBoo.play();
    booPlayed = true;
  }
}

function centerInput() {
  if (ageInput) {
    ageInput.position(windowWidth / 2 - ageInput.width / 2, windowHeight / 2);
  }
}

function mousePressed() {
  // kliknięcie w przycisk DALEJ
  if (dalejVisible && dist(mouseX, mouseY, btnX, btnY) < btnR) {
    window.location.href = "https://mp123-dot.github.io/scena4/";
    return;
  }

  // dodanie brokatu
  for (let i = 0; i < 18; i++) {
    glitterParticles.push(new Glitter(mouseX, mouseY));
  }
}

// Klasa Glitter - nie zmieniana
class Glitter {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = random(TWO_PI);
    this.radius = random(8, 32);
    this.life = 0;
    this.maxLife = random(20, 40);
    this.size = random(3, 7);
    this.color = color(random(180,255), random(120,200), random(200,255), 200);
  }

  update() {
    this.life++;
    this.x += cos(this.angle) * 1.5;
    this.y += sin(this.angle) * 1.5;
  }

  finished() {
    return this.life > this.maxLife;
  }

  show() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.size);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  centerInput();
}