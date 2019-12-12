var offset;
var angle;
var scale;
var side;
let graphics;
let ellipseOrigin;
let ellipseRadius;
let allPetals = [];
let fillColorArray = [
[50, 60, 50, 0.1],
[100, 60, 50, 0.1],
[150, 60, 50, 0.1],
[200, 60, 50, 0.1],
[250, 60, 50, 0.1],
[300, 60, 50, 0.1]];
let strokeColor = [100, 0, 0, 1]

class Petal {
  constructor(index,x,y,diameter, round, fillColor, strokeColor){
    this.index = index;
    this.x = x;
    this.y = y;
    this.diameter = diameter;
    this.angle = getPetalAngle(x,y)
    this.round = round
    this.fillColor = fillColor
    this.strokeColor = strokeColor
  }

  drawPetal(){
    stroke(this.strokeColor)
    fill(this.fillColor)
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
  //configuration for the flower of life
  ellipseOrigin = {x: windowWidth/2, y: windowHeight/2};
  ellipseRadius = 100;
  getPetalPositions()
  noLoop()

}

function draw() {
  allPetals.forEach(petal => petal.drawPetal())
}

function getPetalPositions(){
  let firstIntersection = 0
  let petalCount = 0
  let offset, petal

  for (let roundCount = 0; roundCount < 7; roundCount++){
    offset = 360 / (roundCount * 6)

    // origin petal at the center of the canvas
    if(roundCount === 0){
      petal = new Petal(petalCount, ellipseOrigin.x, ellipseOrigin.y, ellipseRadius *2,
        roundCount, fillColorArray[(roundCount + fillColorArray.length - 1) % fillColorArray.length],
        strokeColor)
      allPetals.push(petal)
      petalCount++
    }

    for (let i = 0; i < roundCount * 6; i++){
      if (roundCount === 1 && i === 0){
        petal = new Petal(petalCount, ellipseOrigin.x + ellipseRadius * cos(0),
        ellipseOrigin.y + ellipseRadius * sin(0), ellipseRadius * 2, roundCount,
        fillColorArray[(roundCount + fillColorArray.length - 1) % fillColorArray.length], strokeColor)
      } else {
        let intersectionCoordinates = getIntersection(allPetals[petalCount - 1],
          allPetals[firstIntersection], ellipseRadius)
        petal = new Petal(petalCount, intersectionCoordinates.x, intersectionCoordinates.y,
          ellipseRadius * 2, roundCount, fillColorArray[(roundCount + fillColorArray.length - 1) % fillColorArray.length], strokeColor)
      }
      allPetals.push(petal)
      petalCount++

      // Check if our current petal's angle + our rounds offset is divisible by
      // 60° (the angle of our vertices)
      let vertexCalc = (petal.angle + offset) % 60 > 1

      // After 6 petals we are in our second round
      if (i === roundCount * 6 - 1){
        firstIntersection++
        // If we're intersection a vertex also increase the iterator
      } else if(vertexCalc){
        firstIntersection++
      }
    }
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

function getPetalAngle(petalX, petalY){
  // use atan2 to find angle in radians
  let theta = Math.atan2(petalY - ellipseOrigin.y, petalX - ellipseOrigin.x)
  // convert radians to degrees
  theta *= 180 / Math.PI
  // convert degrees to from +-180 to 0-360
  if (theta < 0) theta = 360 + theta

  theta = Math.round(theta)

  // return angle data to method that called it
  return theta
}
