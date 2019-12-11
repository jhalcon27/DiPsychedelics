
 // NOTE: This was slapped together for a limited purpose and I'm doing a bunch of stuff you're not "supposed" to do. Maybe don't try to learn too much for it. Or do. You'll be fine either way :D

class Petal {
 constructor(index, x, y, diameter, round, fillColor, strokeColor, strokeWeight) {
   this.index = index
   this.x = x
   this.y = y
   this.diameter = diameter
   this.angle = getPetalAngle(x, y)
   this.round = round
   this.fillColor = fillColor
   this.strokeColor = strokeColor
   this.strokeWeight = strokeWeight
 }

  drawPetal(sketch) {
   sketch.strokeWeight(this.strokeWeight)
   sketch.stroke(this.strokeColor)
   sketch.fill(this.fillColor)
   sketch.ellipse(this.x, this.y, this.diameter)
  }

}

function getPetalAngle(petalX, petalY){
  // use atan2 to find the angle [theta - in radians] from the origin of the shape to the new petal's center
  let theta = Math.atan2(petalY - 500, petalX - 500)
  // Convert radians to degrees [-180 > 180]
  theta *= 180 / Math.PI
  // convert degrees [-180 to 180] to [0 to 360] for convenience
  if (theta < 0) theta = 360 + theta

  theta = Math.round(theta)

  // return angle data to the method that called it
  return theta
}


var app = new Vue({
  el: '#app',
  data() {
    return {
      p5Ref: {},
      ellipseOrigin: {
        x: 500,
        y: 500
      },
      ellipseRadius: 40,
      numRounds: 8,
      allPetals: [],
      highlightColor: [20, 60, 90, 0.3],
      fillColorArray: [
        [50, 60, 50, 0.1],
        [100, 60, 50, 0.1],
        [150, 60, 50, 0.1],
        [200, 60, 50, 0.1],
        [250, 60, 50, 0.1],
        [300, 60, 50, 0.1]
      ],
      strokeColorArray: [
        [100, 0, 0, 1],
        [0, 0, 0, 1]
      ],
      textColorArray: [
        [100, 0, 100, 1]
      ],
      strokeWeight: 1,
      rowIterator: 1,
      radiusIterator: 2,
      colorIterator: 0.02,
      diameterIterator: 0.2
    }
  },
  watch: {
    ellipseRadius: function (newVal) {
      this.allPetals = []
      this.getPetalPositions(this.p5Ref)
    },
    strokeWeight: function (newVal) {
      this.allPetals = []
      this.getPetalPositions(this.p5Ref)
    },
    numRounds: function (newVal) {
      this.allPetals = []
      this.getPetalPositions(this.p5Ref)
    }
  },
  methods: {
    getPetalPositions(sketch) {
      var firstIntersection = 0
      var petalCount = 0
      var offset, petal

      for (let roundCount = 0; roundCount < this.numRounds; roundCount++){
        offset = 360 / (roundCount * 6)

        if (roundCount === 0) {
          petal = new Petal(petalCount, this.ellipseOrigin.x, this.ellipseOrigin.y, this.ellipseRadius * 2, roundCount, this.fillColorArray[(roundCount + this.fillColorArray.length - 1) % this.fillColorArray.length], this.strokeColorArray[0], this.strokeWeight)
          this.allPetals.push(petal)
          petalCount++
        }

        for (let i = 0; i < roundCount * 6; i++) {
          var offset, petal

          if (roundCount === 1 && i === 0) {
            petal = new Petal(petalCount,
                              this.ellipseOrigin.x + this.ellipseRadius * sketch.cos(0),
                              this.ellipseOrigin.y + this.ellipseRadius * sketch.sin(0),
                              this.ellipseRadius * 2,
                              roundCount,
                              this.fillColorArray[(roundCount + this.fillColorArray.length - 1) % this.fillColorArray.length],
                              this.strokeColorArray[0],
                              this.strokeWeight)
          } else {
            let intersectionCoordinates = this.getIntersection(this.allPetals[petalCount - 1], this.allPetals[firstIntersection], this.ellipseRadius)
            petal = new Petal(petalCount, intersectionCoordinates.x, intersectionCoordinates.y, this.ellipseRadius * 2, roundCount, this.fillColorArray[(roundCount + this.fillColorArray.length - 1) % this.fillColorArray.length], this.strokeColorArray[0], this.strokeWeight)
          }

          this.allPetals.push(petal)
          petalCount++

          let vertexCalc = (petal.angle + offset) % 60 > 1

          if (i === roundCount * 6 - 1) {
            firstIntersection++
          } else if(vertexCalc){
            firstIntersection++
          }
        }
      }
    },
    getIntersection(originator, intersected, radius) {
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
      a = ((radius*radius) - (radius*radius) + (d*d)) / (2.0 * d) ;
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
    },
    addRows(sketch) {
      if(this.numRounds > 15) {
        this.rowIterator = -1
      } else if (this.numRounds === 2) {
        this.rowIterator = 1
      }

      if(sketch.frameCount % 30 === 0) {
        this.numRounds += this.rowIterator
      }

      this.allPetals.forEach(position => position.drawPetal(sketch))
    },
    diameterChange(sketch) {
      if(this.ellipseRadius > 75) {
        this.radiusIterator = -0.5
      } else if (this.ellipseRadius < 20) {
        this.radiusIterator = 0.5
      }

      this.ellipseRadius += this.radiusIterator

      this.allPetals.forEach(position => position.drawPetal(sketch))
    },
    hueSpin(sketch){
      this.allPetals.forEach(position => {

        if(position.diameter > this.ellipseRadius * 3) this.diameterIterator = -0.2
        if(position.diameter < this.ellipseRadius) this.diameterIterator = 0.2

        position.diameter += this.diameterIterator
        position.fillColor[0] = (position.fillColor[0] + 0.05) % 360
        // position.fillColor[1] = (position.fillColor[1] + 0.002) % 100
        // position.fillColor[2] = (position.fillColor[1] + 0.002) % 100
        position.drawPetal(sketch)
      })
    },
    vertexHighlight(){
      this.allPetals.forEach(position => {
        if(position.angle % 60 === 0){
          position.fillColor = this.highlightColor
        }
      })
    }
  },
  mounted() {
    var viz = new p5(sketch => {
      this.p5Ref = sketch
      sketch.setup = () => {
        var canvas = sketch.createCanvas(1000, 1000)
        canvas.parent('sketch-holder')
        sketch.pixelDensity(1)
        sketch.frameRate(30)
        sketch.colorMode(sketch.HSB)
        this.getPetalPositions(sketch)
      }

      sketch.draw = () => {
        sketch.background(65)
        // if(sketch.frameCount < 600) {
        //   this.diameterChange(sketch)
        // } else if (sketch.frameCount < 1200) {
        //   this.addRows(sketch)
        // }
        this.hueSpin(sketch)
      }
    })
   }
})








// function getActivePetals(activeRounds, minAngle, maxAngle){
//   var activeArray = []
//   activeRounds.forEach(round => {
//     var activeGroup = []
//     allPositions.forEach(position => {
//       if(position.round === round && maxAngle >= position.angle && minAngle <= position.angle) {
//         activeGroup.push(position)
//       }
//     })
//     activeArray.push(activeGroup)
//   })
//   return activeArray
// }
// // ALTERNATE ANIMATIONS
// function diameterChange() {
//   allPositions.forEach(position => {
//     console.log(position.x)
//     position.x += 1
//   })
// }
// function colorReset() {
//   allPositions.forEach(position => {
//     position.fillColor = fillColorArray[(position.round + fillColorArray.length - 1) % fillColorArray.length]
//     position.textColor = textColorArray[0]
//     position.strokeColor = strokeColorArray[0]
//   })
// }
// function randomChange(starter){
//   let newFill = [10, 10, 10, 1]
//   let seed = allPositions[starter]
//   seed.fillColor = [10, 10, 10, 1]
//   allPositions.forEach(position => {
//     let originatorActive = _.isEqual(_.sortBy(allPositions[position.originator].fillColor), _.sortBy(newFill))
//     let progenyActive = _.isEqual(_.sortBy(allPositions[position.firstIntersection].fillColor), _.sortBy(newFill))
//     if(originatorActive || progenyActive){
//       position.fillColor = newFill
//       position.drawPetal()
//     }
//   })

// }
// function roundSweep(frame) {
//   let color = [120, 30, 30, .8]
//   allPositions.forEach(position => {
//     position.fillColor = colorReset(position.round)
//     position.textColor = textColorArray[0]
//     if(position.round === frame / 2 % numRounds) {
//        position.fillColor = [100, 0, 0, 1]
//       position.textColor = 'green'
//     }
//     position.drawPetal()
//   })
// }
// function angleSweep(frame, span) {
//   let color = [120, 30, 30, .8]
//   let middlePoint = frameCount % 360
//   allPositions.forEach(position => {
//     position.fillColor = colorReset(position.round)
//     if(position.angle > middlePoint - span / 2 && position.angle < middlePoint + span / 2) {
//       position.fillColor = color
//     }
//   })
// }
// function sixthClick(frame) {
//   let color = [120, 30, 30, .8]
//   allPositions.forEach(position => {
//     let foo = position.angle1
//     if(position.angle === 30){
//       position.fillColor = color
//     }
//   })
// }
// function vertexHighlight(){
//   allPositions.forEach(position => {
//     if(position.isVertex){
//       position.fillColor = [20, 60, 90, 0.3]
//     }
//   })
// }
// function diameterChange(frameCount){
//   allPositions.forEach(position => {
//     position.diamter += 0.3
//   })
// }
