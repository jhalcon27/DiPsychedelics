var offset;
var angle;
var scale;
var X;
var Y;
var side;
var grey;
let graphics;
let ellipseOrigin;
let ellipseRadius;
let allPetals = [];


function setup() {
  createCanvas(windowWidth, windowHeight);
  //configuartion for the endless flower
  background = createGraphics(windowWidth,windowHeight);
  background.background(220);
  colorMode(HSB);//, height, height, height);
  rectMode(CENTER);
  offset_x = width/2;
  offset_y = height/2;
  grey = 256;
  //configuration for the flower of life
  ellipseOrigin = {x: windowWidth/2, y: windowHeight/2};
  ellipseRadius = 100;
}

function draw() {
  //flower();
  //sri_yantra();
  flower_of_life();
}

function flower(){
  //pattern 1
    X = offset_x + sin(angle)*scale;
    Y = offset_y + cos(angle)*scale;
    background.fill(grey);
    background.stroke(grey);
    background.ellipse(X, Y, side, side);
    angle += 1;
    scale += 1/2;
    side += 0.05;
    grey -= 0.5;
    if(grey<=0 || grey >=255){
       X = 0
       Y = 0
       angle = 1;
       scale = 5;
       side = 20;
       grey = 255;
    }
    image(background, 0, 0);
}

function sri_yantra(){
  triangle(10,10,30,10,30,30);
}

function flower_of_life(){
  angleMode(DEGREES);
  // Original circle
  ellipse(ellipseOrigin.x ,ellipseOrigin.y, ellipseRadius*2);
  fill(200,30,30,0.01);
  // Circle 1>6
  for (let circleCount = 0; circleCount < 6; circleCount++){
    ellipse(ellipseOrigin.x + ellipseRadius * cos(60*circleCount), ellipseOrigin.y + ellipseRadius * sin(60*circleCount), ellipseRadius * 2);
  }
  angleMode(RADIANS);
}

function getIntersection(originator, intersected, radius) {
  var a, dx, dy, d, h, rx, ry;
  var x2, y2;

  /* dx and dy are the vertical and horizontal distances between
  * the circle centers.
  */
  dx = intersected.x - originator.x;
  dy = intersected.y - originator.y;

  /* Determine the straight-line distance between the centers. */
  d = Math.hypot(dx, dy);

  /* Check for solvability. */
  if (d > (radius + radius)) {
    /* no solution. circles do not intersect. */
    return false;
  }

  if (d < Math.abs(radius - radius)) {
    /* no solution. one circle is contained in the other */
    return false;
  }

  /* 'point 2' is the point where the line through the circle
   * intersection points crosses the line between the circle
   * centers.
   */

  /* Determine the distance from point 0 to point 2. */
  a = ((radius*radius) - (radius*radius) + (d*d)) / (2.0 * d);

  /* Determine the coordinates of point 2. */
  x2 = originator.x + (dx * a/d);
  y2 = originator.y + (dy * a/d);

  /* Determine the distance from point 2 to either of the
  * intersection points.
  */
  h = Math.sqrt((radius*radius) - (a*a));

  /* Now determine the offsets of the intersection points from
  * point 2.
  */
  rx = -dy * (h/d);
  ry = dx * (h/d);
  /* Determine the absolute intersection points. */
  var intersection = {
    x: x2 - rx,
    y: y2 - ry
    }
    return intersection;
}

class Petal {
  constructor(index,x,y,diameter){
    this.index = index;
    this.x = x;
    this.y = y;
    this.diameter = diameter;
  }
}
