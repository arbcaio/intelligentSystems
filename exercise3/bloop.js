// The Nature of Code
// Daniel Shiffman
// http://natureofcode.com

// Evolution EcoSystem

// Creature class

// Create a "bloop" creature
class Bloop {
  constructor(l, dna_) {
    this.position = l.copy(); // Location
    this.health = 200; // Life timer
    this.xoff = random(1000); // For perlin noise
    this.yoff = random(1000);
    this.dna = dna_; // DNA
    // DNA will determine size and maxspeed
    // The bigger the bloop, the slower it is
    this.maxspeed = map(this.dna.genes[0], 0, 1, 2, 0);
    this.r = map(this.dna.genes[0], 0, 1, 0, 50);
    this.changePositionTimer = 0; // Contador para o tempo de mudança de posição
    this.positionChangeInterval = 40;
    this.fov = PI / 3;
    this.angle = random(TWO_PI);
  }

  run(f) {
    let food = f.getFood();
    this.update(food);
    this.borders();
    this.display();
    this.drawCone();
  }

  // A bloop can find food and eat it
  eat(f) {
    let food = f.getFood();
    // Are we touching any food objects?
    for (let i = food.length - 1; i >= 0; i--) {
      let foodLocation = food[i];
      let d = p5.Vector.dist(this.position, foodLocation);
      // If we are, juice up our strength!
      if (d < this.r / 2) {
        this.health += 100;
        food.splice(i, 1);
      }
    }
  }

  // At any moment there is a teeny, tiny chance a bloop will reproduce
  reproduce() {
    // asexual reproduction
    if (random(1) < 0.0005) {
      // Child is exact copy of single parent
      let childDNA = this.dna.copy();
      // Child DNA can mutate
      childDNA.mutate(0.01);
      return new Bloop(this.position, childDNA);
    } else {
      return null;
    }
  }

  detectedFood(food){
    // detecta comida 
    let visibleFood = food.filter(f => {
      let d = p5.Vector.dist(this.position, f);
      let diff = p5.Vector.sub(f, this.position);
      let angleBetween = diff.angleBetween(p5.Vector.fromAngle(this.angle));
      return d < (10 + this.dna.genes[1] * 60) && abs(angleBetween) < this.fov/2;
    })
    // retorna a comida mais proxima
    if (visibleFood.length > 0) {
      visibleFood.sort((a, b) => p5.Vector.dist(this.position, a) - p5.Vector.dist(this.position, b));
      return visibleFood[0];
    } else {
      return null;
    }
  }

  // Method to update position
  update(food) {
    this.changePositionTimer++;

    let target;

    if (this.changePositionTimer >= this.positionChangeInterval || this.targetPosition == null) {
      this.changePositionTimer = 0;
      let detectedFood = this.detectedFood(food);
      this.targetPosition = detectedFood ? detectedFood : createVector(random(width), random(height));
    }
    
    let force = p5.Vector.sub(this.targetPosition, this.position);
    force.setMag(this.maxspeed);
    this.position.add(force);
    this.angle = atan2(force.y, force.x);

    // Death always looming
    this.health -= 0.2;
  }

drawCone() {
  
  if(this.dna.genes[1] < 0.2){
    fill(0, 0, 0, 100)
  } else if(this.dna.genes[1] < 0.4){
    fill(0, 0, 70, 100)
  } else if(this.dna.genes[1] < 0.6){
    fill(0, 0, 139, 100)
  } else if (this.dna.genes[1] < 0.8){
    fill(87, 108, 185, 100)
  } else {
    fill(173, 216, 230, 100)    
  }
  
  noStroke();

  const halfFov = this.fov / 2;
  const direction = p5.Vector.fromAngle(this.angle);

  beginShape();
  vertex(this.position.x, this.position.y);
  for (let a = -halfFov; a <= halfFov; a += 0.1) {
    const offset = p5.Vector.fromAngle(this.angle + a);
    offset.mult(10 + this.dna.genes[1] * 60); // Comprimento do cone de visão
    const conePoint = p5.Vector.add(this.position, offset);
    vertex(conePoint.x, conePoint.y);
  }
  endShape(CLOSE);
}

  // Wraparound
  borders() {
    if (this.position.x < -this.r/2) this.position.x = width+this.r/2;
    if (this.position.y < this.r/2) this.position.y = height+this.r/2;
    if (this.position.x > width+this.r/2) this.position.x = -this.r/2;
    if (this.position.y > height+this.r/2) this.position.y = -this.r/2;
  }

  // Method to display
  display() {
    ellipseMode(CENTER);
    stroke(0, this.health);
    fill(0, this.health);
    ellipse(this.position.x, this.position.y, this.r, this.r);
  }

  // Death
  dead() {
    if (this.health < 0.0) {
      return true;
    } else {
      return false;
    }
  }
}
