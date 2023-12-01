let carro;
let comida;
let maxSpeedSlider;
let maxForceSlider;
let comidasCapturadas = 0;
let comidasPorSegundo = 0;
let tempoInicial;
let lastUpdateTime;


function setup() {
  createCanvas(500, 500);
  maxSpeedSlider = createSlider(0.1, 50, 2, 0.1);
  maxSpeedSlider.position(20, height + 10);
  createSpan('Max Speed:').position(20, height - 5);
  
  maxForceSlider = createSlider(0.01, 0.7, 0.1, 0.01);
  maxForceSlider.position(20, height + 30);
  createSpan('Max Force:').position(20, height + 15);
  
  carro = new Carro(100, 100);
  spawnComida();
  
  tempoInicial = millis();
  
  infoParagrafo = createP();
  infoParagrafo.position(20, height + 60);
}

class Carro {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.maxSpeed = 5;
    this.maxForce = 0.2;
    this.r = 16;
  }

  seek(target) {
    let force = p5.Vector.sub(target, this.pos);
    force.setMag(this.maxSpeed);
    force.sub(this.vel);
    force.limit(this.maxForce);
    this.applyForce(force);
  }

  applyForce(force) {
    this.acc.add(force);
  }

  update() {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);
  }

  show() {
    stroke(255);
    strokeWeight(2);
    fill(255, 255, 0);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    triangle(-this.r, -this.r / 2, -this.r, this.r / 2, this.r, 0);
    pop();
  }

  eat(comida) {
    let d = dist(this.pos.x, this.pos.y, comida.pos.x, comida.pos.y);
    return d < this.r + comida.r;
  }
}

class Comida {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.r = 8;
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
  }
}

function spawnComida() {
  comida = new Comida();
}

function draw() {
  background(0, 0, 200);

  carro.maxSpeed = maxSpeedSlider.value();
  carro.maxForce = maxForceSlider.value();

  let tempoAtual = millis();
  let decorridoSegundos = (tempoAtual - tempoInicial) / 1000.0;

  comidasPorSegundo = comidasCapturadas / decorridoSegundos;
  
  infoParagrafo.html("Comidas por segundo: " + comidasPorSegundo.toFixed(2) + "<br>Total de comidas capturadas: " + comidasCapturadas);


  if (carro.eat(comida)) {
    console.log("Comida comida!");
    comidasCapturadas++;
    spawnComida();
    tempoInicial = millis();
  }

  comida.show();
  carro.seek(comida.pos);
  carro.update();
  carro.show();

  fill(255);
  textSize(12);
  text("Max Speed: " + carro.maxSpeed, maxSpeedSlider.x * 2 + maxSpeedSlider.width, height + 20);
  text("Max Force: " + carro.maxForce, maxForceSlider.x * 2 + maxForceSlider.width, height + 40);
}
