
class Point {
    
    // constructors

    // Postcondition:  new Point instance is created
    // Parameters:     x - x value for point
    //                 y - y value for point
    constructor(x, y) {
        this.x = x;
        this.y = y;
    } 

    // instance methods
    // Precondition:    otherPoint is a valid point instance or null
    // Parameters:      otherPoint - point to be compared
    // Returns:         true if points share same x and y
    equals(otherPoint) {
        return  otherPoint !== null &&
                this.x === otherPoint.x &&
                this.y === otherPoint.y;
    }
}


class OctLine {
    
    // constructors

    // Precondition:    both arguments are valid point instances
    // Postcondition:   new OctLine instance is created
    // Parameters:      startPoint - starting point for the line
    //                  endPoint - ending point for the line
    constructor(startPoint, endPoint) {
        
        this.startPoint = new Point(startPoint.x, startPoint.y)
        this.endPoint = new Point(endPoint.x, endPoint.y);
    }

    // Returns:         slope of OctLine instance function was called from.
    getSlope() {

        if (this.endPoint.x - this.startPoint.x === 0) {/* line is vertical */
            return null;

        } else {
            return  (this.endPoint.y - this.startPoint.y) /
                    (this.endPoint.x - this.startPoint.x);

        }
    }

    // Precondition:    otherLine is a valid OctLine instance
    // Parameters:      otherLine - line to calculate determinant with
    // Returns:         determinant of two lines 
    getDeterminant(otherLine) {

        // reassign x value of each point for readability
        let x1 = this.startPoint.x, x2 = this.endPoint.x, 
            x3 = otherLine.startPoint.x, x4 = otherLine.endPoint.x;

        // reassign y value of each point for readability
        let y1 = this.startPoint.y, y2 = this.endPoint.y, 
            y3 = otherLine.startPoint.y, y4 = otherLine.endPoint.y;

        // formula for calculating determinant of two lines
        return (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);       
    }

    // Precondition:    otherLine is a valid OctLine instance
    // Parameters:      otherLine - line to check for intersection
    // Returns:         true if the two lines intersect AND are not parallel
    //                  false otherwise 
    checkBasicInt(otherLine) {
        
        // reassign x value of each point for readability
        let x1 = this.startPoint.x, x2 = this.endPoint.x, 
            x3 = otherLine.startPoint.x, x4 = otherLine.endPoint.x;
        
        // reassign y value of each point for readability
        let y1 = this.startPoint.y, y2 = this.endPoint.y, 
            y3 = otherLine.startPoint.y, y4 = otherLine.endPoint.y;

        // checks if det of two lines is non zero (to avoid division by 0)
        let det = this.getDeterminant(otherLine);
        if (det !== 0) { // lines intersect somewhere

            // determines point on line where x values intersect
            let Px = ((x1 - x3)*(y3 - y4) - (y1 - y3)*(x3 - x4)) / det;

            // determines point on line where y values intersect
            let Py = -((x1 - x2)*(y1 - y3) - (y1 - y2)*(x1 - x3)) / det;

            // returns true if intersection occurs within given points
            return (0 <= Px && Px <= 1) && (0 <= Py && Py <= 1);
        
        } else { // intersection is outside of given points
            return false;
        }
    } 

    // Precondition:    otherLine is a valid OctLine instance
    // Parameters:      otherLine - line to be checked for intersection
    // Returns:         true if lines are colinear and intersect
    //                  false otherwise  
    checkColinearInt(otherLine) {

            // if determinant is nonzero then lines aren't colinear
            if (this.getDeterminant(otherLine) !== 0)
                return false;

            // reassign x value of each point for readability
            let x1 = this.startPoint.x, x2 = this.endPoint.x, 
                x3 = otherLine.startPoint.x, x4 = otherLine.endPoint.x;
            
            // reassign y value of each point for readability
            let y1 = this.startPoint.y, y2 = this.endPoint.y, 
                y3 = otherLine.startPoint.y, y4 = otherLine.endPoint.y;

            // checks that first line is colinear with BOTH points of otherLine
            if ((x1*y2 + x2*y3 + x3*y1 - x1*y3 - x2*y1 - x3*y2) === 0 &&
                (x1*y2 + x2*y4 + x4*y1 - x1*y4 - x2*y1 - x4*y2) === 0) {
                
                // now that we know lines are colinear
                // otherLine will be rotated 45 degrees from each endpoint
                // then the rotated lines will each be checked for intersection

                // shifts end point of line to origin so it can be rotated
                let shiftEndPoint = new Point(x4 - x3, y4 - y3);
                
                // rotates point 45 degrees clockwise, shifts back from origin
                let rotatedPoint1 = new Point(shiftEndPoint.y + x3, 
                                            -(shiftEndPoint.x) + y3);

                // uses rotated point to declare first rotated line
                let rotation1 = new OctLine(otherLine.startPoint, 
                                            rotatedPoint1);

                // now start point is shifted to origin
                let shiftStartPoint = new Point(x3 - x4, y3 - y4);
                
                // rotates point 45 degrees aroung origin and shifts it back
                let rotatedPoint2 = new Point(shiftStartPoint.y + x4,
                                            -(shiftStartPoint.x) + y4);

                // declares second rotated line to be tested
                let rotation2 = new OctLine(otherLine.endPoint,
                                            rotatedPoint2);

                // if either rotated line intersects with current line,
                // then the lines are colinear and intersect
                return this.checkBasicInt(rotation1) || 
                        this.checkBasicInt(rotation2);

            } else { // lines are parallel but not colinear        
                return false;
            }
    }

    // Precondition:    reduced point is either startPoint or endPoint of line
    // Parameters:      reducedPoint - point to be removed from line
    // Returns:         line that has reducedPoint removed  
    reduceLine(reducedPoint) {
        
        let reducedLine = null;
        if (reducedPoint.equals(this.startPoint)) {// startPoint to be removed
            /* new start point after shifting to origin, removing startPoint,
                and shifting back                                           */
            let newStartPoint = new Point((this.startPoint.x-this.endPoint.x) * 
                                            .9 + this.endPoint.x,
                                        
                                        (this.startPoint.y - this.endPoint.y) * 
                                        .9 + this.endPoint.y);
                    
                // declares reduced line using startPoint
                reducedLine = new OctLine(newStartPoint, this.endPoint);

        } else if (reducedPoint.equals(this.endPoint)) {// endPoint removed
            /* new end point after shifting to origin, removing endPoint,
                and shifting back                                           */
            let newEndPoint = new Point((this.endPoint.x - this.startPoint.x) * 
                                        .9 + this.startPoint.x,
                                        
                                        (this.endPoint.y - this.startPoint.y) * 
                                        .9 + this.startPoint.y);

            // declares reduced line using new endPoint
            reducedLine = new OctLine(this.startPoint, newEndPoint);

        }

        return reducedLine;
    }
}


class LineGrid {

    // constructors

    // Postcondition:   new LineGrid instance is created
    constructor(width, height) {
        this.width = height;
        this.height = width;
        // starting point for game in progress
        this.startingPoint = null;
        // ending point for game in progress
        this.endingPoint = null;
        // array used to store lines as they are drawn
        this.lines = [];
    }

    // instance methods

    // Precondition:    startPoint, endPoint are valid point instances,
    //                  points are already checked with isValidOctLine()
    // Postcondition:   new line is stored within this.lines[],
    //                  starting and ending points are shifted if necessary
    // Parameters:      startPoint - start of line to be drawn
    //                  endPoint - end of line to be drawn
    drawLine(startPoint, endPoint) {
        
        // declares new OctLine to be drawn
        let validLine = new OctLine(startPoint, endPoint);
        
        if (this.startingPoint === null) {// this is first line drawn
            /* assigns starting and ending point of current game as
               starting and ending point of current line */
            this.startingPoint = new Point(startPoint.x, startPoint.y);
            this.endingPoint = new Point(endPoint.x, endPoint.y);

        } else if (startPoint.equals(this.startingPoint)) { /* line drawn from
                                                               startingPoint */
            this.startingPoint = new Point(endPoint.x, endPoint.y);

        } else { // line drawn from endingPoint
            this.endingPoint = new Point(endPoint.x, endPoint.y);
        }

        // stores new line
        this.lines.push(new OctLine(startPoint, endPoint));

    }

    // Precondition:    startPoint is valid point instance
    // Parameters:      startPoint - point to be tested 
    // Returns:         true is point is first overall point
    //                  or point is equal to startingPoint or endingPoint
    isValidStart(startPoint) {

        return (startPoint.equals(this.startingPoint) ||
                startPoint.equals(this.endingPoint) ||
                this.startingPoint === null);
    }

    // Precondition: assumes at least one line has been drawn already
    // Returns: true if no more lines can be drawn from startingPoint 
    //                                             and endingPoint
    arePointsIsolated() {

        // tests startingPoint first
        let testPoint = this.startingPoint;
        
        // loop for each of startingPoint and endingPoint
        for (let i = 0; i < 2; i++) {

            // loop for y values 1 away from startingPoint
            for (let j = 1; j >= -1; j--) {
                
                // loop for x values 1 away from startingPoint
                for (let k = 1; k >= -1; k--) {
                    // creates temporary point used in intersection test
                    let tempPoint = new Point(testPoint.x - k, testPoint.y - j);
                    
                    // if tempPoint sits outside of grid's bounds it is ignored
                    if ((tempPoint.x >= 0 && tempPoint.x < this.width) &&
                        (tempPoint.y >= 0 && tempPoint.y < this.height)) {
                                                   /* point is within bounds */

                        /* checks to see if creating a line with new point 
                           would intersect with another line              */                       
                        if (this.isValidOctLine(testPoint, tempPoint))
                            return false;
                    }

                } 
            }
            // startingPoint is isolated so endingPoint is tested next
            testPoint = this.endingPoint;
        }

        // both points are isolated (game is over)
        return true;
    }

    // Precondition:    startPoint and endPoint are valid point instances
    // Parameters:      startPoint - start point of possible line
    //                  endPoint - end point of possible line
    // Returns:         true if points result in valid line
    isValidOctLine(startPoint, endPoint) {
        
        // occurs when node has been clicked twice
        // or line is ended at starting node/ ending node
        if (startPoint.equals(endPoint) ||
            (endPoint.equals(this.startingPoint) ||
            endPoint.equals(this.endingPoint)))
            return false;

        // creates line to be tested for intersection/slope
        let testLine = new OctLine(startPoint, endPoint);
        let testLineSlope = testLine.getSlope();
        
        // tests that line has valid slope for OctLine
        if (testLineSlope !== 0 &&
            testLineSlope !== null &&
            testLineSlope !== -1 &&
            testLineSlope !== 1)
            return false;

        // loop to check testLine against each line for intersection
        for (let i = 0; i < this.lines.length; i++) {
            
            let tempLine = this.lines[i];
            /* true when intersecting line is a previous line that
                this new line is drawn from (new line will always 
                intersect with line it was drawn from)             */
            if ((this.lines[i].endPoint.equals(this.endingPoint) && 
                testLine.startPoint.equals(this.endingPoint)) ||
                (this.lines[i].endPoint.equals(this.startingPoint) &&
                testLine.startPoint.equals(this.startingPoint))) {

                tempLine = tempLine.reduceLine(tempLine.endPoint);

            /* same as previous case, but only occurs when new line is drawn
                from the starting point of the FIRST overall line             */
            } else if (this.lines[i].startPoint.equals(this.startingPoint) &&
                        testLine.startPoint.equals(this.startingPoint)) {

                tempLine = tempLine.reduceLine(tempLine.startPoint);
            }

            // lines are parallel so use checkColinearInt()
            if (testLine.getDeterminant(tempLine) === 0) {
                
                // lines intersect and are colinear so line is invalid
                if (testLine.checkColinearInt(tempLine))
                    return false;

            // lines aren't parallel so they intersect somewhere
            } else if (testLine.checkBasicInt(tempLine) === true) {
                
                return false;
            }
        }
        
        // no intersections, so line is valid
        return true;

    }
}


class GameInstance {

    // constructors

    // Postcondition: new GameInstance is created
    constructor() {
        this.lineGrid = new LineGrid(4,4);
        this.playerTurn = 1;
    }

    // Precondition:    startPoint is a valid point instance
    // Parameter:       startPoint - point to be tested
    // Returns:         true if startPoint is valid starting point
    //                  false otherwise
    isValidStartPoint(startPoint) {

        return (this.lineGrid.isValidStart(startPoint));         
    }

    // Precondition:    startPoint and endPoint are valid point instances
    // Parameter:       startPoint - start of possible line to be tested
    //                  endPoint - end of possible line to be tested
    // Returns:         true if endPoint is a valid endPoint for a line
    //                  false otherwise
    isValidEndPoint(startPoint, endPoint) {

        return this.lineGrid.isValidOctLine(startPoint, endPoint, false);
    }

    // Precondition:    assumes isValidStartPoint and isValidEndPoint were
    //                  already called to test validity of line
    // Postcondition:   new line is drawn and stored in this.lineGrid
    //                  turn is changed to other player
    // Parameters:      startPoint - start of line to be drawn
    //                  endPoint - end of line to be drawn
    drawNewLine(startPoint, endPoint) {
        
        this.lineGrid.drawLine(startPoint, endPoint);
        this.changeTurn();
    }

    // Postcondition: turn is changed from player 1 to player 2 and vice versa
    changeTurn() {

        if (this.playerTurn === 1)
            this.playerTurn = 2;
        else 
            this.playerTurn = 1;
    }

    // Returns: true if no more lines can be drawn
    //          false otherwise
    isGameOver() {
        return (this.lineGrid.arePointsIsolated());
                
    }
}
