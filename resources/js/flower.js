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

class Petal {
  constructor(index,x,y,diameter){
    this.index = index;
    this.x = x;
    this.y = y;
    this.diameter = diameter;
  }

  drawPetal(){
    // "this" is litterally this class
    ellipse(this.x,this.y,this.diameter)
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  //configuartion for the endless flower
  background = createGraphics(windowWidth,windowHeight);
  background.background(220);
  colorMode(HSB);//, height, height, height);
  rectMode(CENTER);
  angleMode(DEGREES)
  offset_x = width/2;
  offset_y = height/2;
  grey = 256;
  //configuration for the flower of life
  ellipseOrigin = {x: windowWidth/2, y: windowHeight/2};
  ellipseRadius = 100;
  getPetalPositions()
}

function draw() {
  fill(200,30,30,0.01);
  allPetals.forEach(petal => petal.drawPetal())
}

function getPetalPositions(){
  for (let petalCount = 0; petalCount < 7; petalCount++){
    let petal
    // origin petal at the center of the canvas
    if(petalCount === 0){
      petal = new Petal(petalCount, ellipseOrigin.x, ellipseOrigin.y, ellipseRadius *2)
      // if it's the first petal move it one readius away
    } else if (petalCount === 1){
      petal = new Petal (petalCount, ellipseOrigin.x + ellipseRadius * cos(0), ellipseOrigin.y + ellipseRadius * sin(0), ellipseRadius *2)
      // otherwise use our get intersection method
    } else {
      let intersectionCoordinates = getIntersection(allPetals[petalCount - 1], allPetals[0], ellipseRadius)
      petal = new Petal(petalCount, intersectionCoordinates.x, intersectionCoordinates.y, ellipseRadius * 2)
    }
    allPetals.push(petal)
  }
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
