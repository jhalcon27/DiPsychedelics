var m, n;
var spiral;
var usingColor = true;

function setup()
{
  createCanvas(800, 800);
  smooth();
  colorMode(HSB);
  restart();
}

function restart()
{
  // try to number of elements (m*n) reasonable
  m = 10;
  n = 10;
  while (m*n > 99 || m*n < 16) {
    m = floor(random(2, 10));
    n = floor(random(2, 10));
  }
  spiral = new Spiral();
}

function draw()
{
  fill(255);
  noStroke();
  text("new one", 5, 16);
  text("toggle color", 5, 38);

  var t1x = map(noise(0.01*frameCount,20), 0, 1, -300, 300);
  var t1y = map(noise(0.01*frameCount,30), 0, 1, -300, 300);
  var t2x = map(noise(0.01*frameCount,40), 0, 1, -300, 300);
  var t2y = map(noise(0.01*frameCount,50), 0, 1, -300, 300);

  push();
  fill(0, 125);
  rect(0, 0, width, height);
  pop();

  translate(width/2, height/2);
  for (var i = 0; i < m; i++)
  {
    push();
    rotate(map(i, 0, m, 0, TWO_PI));
    translate(t1x, t1y);
    for (var j = 0; j < n; j++)
    {
      push();
      rotate(map(j, 0, n, 0, TWO_PI));
      translate(t2x, t2y);
      spiral.draw();
      pop();
    }
    pop();
  }
}

function keyPressed() {
  if (key==' ') restart();
  if (key=='c') usingColor = !usingColor;
}

function mousePressed() {
  if (mouseX < 50 && mouseY < 20) restart();
  if (mouseX < 75 && mouseY > 20 && mouseY < 40) usingColor = !usingColor;
}


// Draws a spiral around a single point
function Spiral()
{
  this.h = random(255);
  this.angleNoiseFactor = random(0.005);
  this.n = floor(random(6, 12));
  this.angleBoundary1 = 0;
  this.angleBoundary2 = 0;
  while (abs(this.angleBoundary1-this.angleBoundary2) < 12*PI) {
    this.angleBoundary1 = random(-24*PI, 24*PI);
    this.angleBoundary2 = random(-24*PI, 24*PI);
  }

  this.draw = function()
  {
    strokeWeight(3);
    if (usingColor) {
      fill(this.h, 255, 255, 25);
      stroke((this.h + 127) % 255, 255, 255, 60);
    } else {
      fill(255, 15);
      stroke(120, 50);
    }

    var marginX = map(noise(0.01*frameCount,70), 0, 1, -350, 350);
    var marginY = map(noise(0.01*frameCount,80), 0, 1, -350, 350);
    var maxAngle = lerp(this.angleBoundary1, this.angleBoundary2, noise(frameCount * this.angleNoiseFactor));

    push();
    beginShape();
    for (var i = 0; i < n; i++) {
      var ang = map(i, 0, n, 0, maxAngle);
      var mx = map(i, 0, n, 0, marginX);
      var my = map(i, 0, n, 0, marginY);

      var x = mx * cos(ang);
      var y = my * sin(ang);
      curveVertex(x, y);
    }
    endShape();
    pop();
  }
}
