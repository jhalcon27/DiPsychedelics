var cluster = new Cluster();
var numSlices = 6;
var radius = 180;
var gridWidth;
var gridHeight;
var isPaused = false;
var showTexture = false;
var showLines = false;
var axisMode = 1;
var speedMod = 1;
var darkStroke = true;
var texWidth;
var texHeight;
var uv0, uv1;

var satMod = 0;

function setup()
{
  createCanvas(940, 540, WEBGL);
  colorMode(HSB);
  background(0);
  textureMode(NORMALIZED);

  angleStep = radians(360/numSlices);
  calculateGrid();
  cluster = new Cluster();
}

function draw()
{
  background(0);
  if (showLines) stroke(0);
  else noStroke();

  cluster.update();

  if (showTexture) image(cluster.tex, width/2-cluster.pg.width/2, height/2-cluster.pg.height/2);
  else drawHexGrid();
}

function randomize()
{
  axisMode = floor(random(0, 3));

  var r = floor(random(0, 3));
  switch (r)
  {
  case 0:
  radius = 90;
  break;

  case 1:
  radius = 120;
  break;

  case 2:
  radius = 180;
  break;

    default:
      break;
  }

  calculateGrid();
  cluster.createParts();
}

function drawHexGrid()
{
  var xCount = width/gridWidth + 1;
  var yCount = height/gridHeight + 1;
  var xOffset;

  for (var x=0; x<xCount; x++)
  {
    for (var y=0; y<yCount; y++)
    {
      if (y%2 == 0) xOffset = 0;
      else xOffset = gridWidth/2;

      push();
      translate(x*gridWidth+xOffset, y*gridHeight, 0);
      rotateZ(angleStep/2);

      switch (axisMode)
      {
      case 0:
        drawHex1();
        break;

      case 1:
        drawHex2();
        break;

      case 2:
        drawHex3();
        break;

      default:
        break;
      }

      pop();
    }
  }
}

function drawHex1()
{
  beginShape(TRIANGLE_FAN);
  texture(cluster.tex);
  vertex(0, 0, 0, 0.5, 1);

  for (var i=0; i<6; i++)
  {
    var x1 = cos(angleStep*i) * radius;
    var y1 = sin(angleStep*i) * radius;
    var x2 = cos(angleStep*(i+1)) * radius;
    var y2 = sin(angleStep*(i+1)) * radius;

    if (i%2 == 0)
    {
      vertex(x1, y1, 0, uv0, 0);
      vertex(x2, y2, 0, uv1, 0);
    } else
    {
      vertex(x1, y1, 0, uv1, 0);
      vertex(x2, y2, 0, uv0, 0);
    }
  }

  endShape();
}

function drawHex2()
{
  beginShape(TRIANGLE_FAN);
  texture(cluster.tex);
  vertex(0, 0, 0, 0.5, 1);

  for (var i=0; i<numSlices; i++)
  {
    var x1 = cos(angleStep*i) * radius;
    var y1 = sin(angleStep*i) * radius;
    var x3 = cos(angleStep*(i+1)) * radius;
    var y3 = sin(angleStep*(i+1)) * radius;
    var x2 = (x1 + x3) / 2;
    var y2 = (y1 + y3) / 2;

    vertex(x1, y1, 0, uv0, 0);
    vertex(x2, y2, 0, uv1, 0);
    vertex(x3, y3, 0, uv0, 0);
  }

  endShape();
}

function drawHex3()
{
  beginShape(TRIANGLE_FAN);
  texture(cluster.tex);
  vertex(0, 0, 0, 0.5, 1);

  for (var i=0; i<numSlices; i++)
  {
    var x1 = cos(angleStep*i) * radius;
    var y1 = sin(angleStep*i) * radius;
    var x5 = cos(angleStep*(i+1)) * radius;
    var y5 = sin(angleStep*(i+1)) * radius;
    var x3 = (x1 + x5) / 2;
    var y3 = (y1 + y5) / 2;
    var x2 = (x1 + x3) / 2;
    var y2 = (y1 + y3) / 2;
    var x4 = (x3 + x5) / 2;
    var y4 = (y3 + y5) / 2;

    vertex(x1, y1, 0, uv0, 0);
    vertex(x2, y2, 0, uv1, 0);
    vertex(x3, y3, 0, uv0, 0);
    vertex(x4, y4, 0, uv1, 0);
    vertex(x5, y5, 0, uv0, 0);
  }

  endShape();
}

function calculateGrid()
{
  var angle = radians(360/numSlices/2);
  var b = radius * cos(angle);
  gridWidth = b * 2;
  var a = sqrt(radius*radius - b*b);
  gridHeight = radius + a;

  texHeight = b;
  texWidth = a*2;

  switch (axisMode)
  {
  case 0:
    uv0 = 0;
    uv1 = 1;
    break;

  case 1:
    uv0 = 0.25;
    uv1 = 0.75;
    break;

  case 2:
    uv0 = 0.375;
    uv1 = 0.625;
    break;

  default:
    break;
  }
}

function cycleAxisMode()
{
  axisMode++;
  if (axisMode > 2) axisMode = 0;
  calculateGrid();
}

function cycleZoom()
{
  switch (radius)
  {
  case 90:
    radius = 180;
    break;

  case 120:
    radius = 90;
    break;

  case 180:
    radius = 120;
    break;

  default:
    radius = 120;
    break;
  }
  calculateGrid();
}

function mouseIsPressed()
{
  randomize();
}

function keyPressed()
{
  if (key == ' ') isPaused = !isPaused;
  if (key == 's') save();
  if (key == 't') showTexture = !showTexture;
  if (key == 'g') showLines = !showLines;
  if (key == 'c') cluster.randomizeColor();
  if (key == 'a') cycleAxisMode();
  if (key == 'z') cycleZoom();
  if (key == 'r') cluster.createParts();
  if (key == '=') speedMod *= 1.2;
  if (key == '-') speedMod *= 0.8;
  if (key == 'l') darkStroke = !darkStroke;
}

class Cluster
{
  var pg;
  var tex;
  var numParts = 40;
  var allParts = new Array(20);

  Cluster()
  {
    pg = createGraphics(texWidth, texHeight);
    pg.colorMode(HSB);
    pg.noSmooth();

    createParts();
    update();
  }

  function update()
  {
    pg.beginDraw();
    updateParts();
    pg.endDraw();
    image(pg);
  }

  function createParts()
  {
    allParts = new Part[numParts];

    for (var i=0; i<numParts; i++)
    {
      allParts[i] = new Part(pg);
    }
  }

  function updateParts()
  {
    pg.ellipseMode(CORNER);
    pg.background(0);
    pg.strokeWeight(0.5);

    for (var i=0; i<numParts; i++)
    {
      allParts[i].update();
    }
  }

  function randomizeColor()
  {
    for (var i=0; i<numParts; i++)
    {
      allParts[i].randomizeColor();
    }
  }
}

class Part
{
  let pg;
  var age;
  var numVectors = 10;
  PVector[] v;
  var x, y;
  var rot, rotSpeed;
  var scale, scaleOsc, scaleOscSpeed;
  var hue, sat, bright;
  var hueSpeed;
  var satOsc, satOscSpeed;
  var brightOsc, brightOscSpeed;

  Part(PGraphics _pg)
  {
    pg = _pg;
    v = new PVector[numVectors];
    init();
    scaleOsc = random(100);
    move();
  }

  function init()
  {
    age = 0;
    x = random(0, pg.width);
    y = random(0, pg.height);
    rot = random(radians(360));
    rotSpeed = random(0.002, 0.005);
    if (random() > 0.5) rotSpeed *= -1;
    scale = 0;
    scaleOsc = 0;
    scaleOscSpeed = random(0.002, 0.004);
    randomizeColor();

    for (var i=0; i<numVectors; i++) {
      v[i] = new PVector(random(-pg.width, pg.width), random(-pg.height, pg.height));
    }
  }

  function randomizeColor()
  {
    hue = random(255);
    hueSpeed = random(0.01, 0.2);

    satOsc = random(100);
    satOscSpeed = random(0.001, 0.003);
    sat = sin(satOsc);
    sat = map(sat, -1, 1, 0, 255);

    brightOsc = random(100);
    brightOscSpeed = random(0.001, 0.003);
    bright = sin(brightOsc);
    bright = map(bright, -1, 1, 0, 255);
  }

  function update()
  {
    if (!isPaused) move();
    render();
  }

  function move()
  {
    age++;

    rot += rotSpeed * speedMod;
    scaleOsc += scaleOscSpeed * speedMod;
    scale = sin(scaleOsc);
    if (age > 100 && abs(scale) < 0.01) init();

    hue += hueSpeed;
    satOsc += satOscSpeed;
    brightOsc += brightOscSpeed;
    sat = sin(satOsc);
    sat = map(sat, -1, 1, 0, 255);
    bright = sin(brightOsc);
    bright = map(bright, -1, 1, 0, 255);
  }

  function render()
  {
    if (darkStroke) pg.stroke(0);
    else pg.stroke(255);

    pg.push();
    pg.fill(hue%255, sat, bright, 255);
    pg.translate(x, y);
    pg.rotate(rot);
    pg.scale(scale, scale);
    pg.beginShape();
    pg.vertex(v[0].x, v[0].y);
    pg.bezierVertex(v[1].x, v[1].y, v[2].x, v[2].y, v[3].x, v[3].y);
    pg.bezierVertex(v[4].x, v[4].y, v[5].x, v[5].y, v[6].x, v[6].y);
    pg.bezierVertex(v[7].x, v[7].y, v[8].x, v[8].y, v[9].x, v[9].y);
    pg.vertex(v[0].x, v[0].y);
    pg.endShape();
    pg.pop();
  }
}
