
let headsize = 20;
let thickness = 5;
let squaredis = 20;

function Arrow(startID, startx, starty, fill){
    //let angle = Math.atan2(block2.posy - startID.posy, block2.posx - startID.posx);
    this.startID = startID;
    this.endID = -1;
    this.startx = startx;
    this.starty = starty;
    this.endx = -50;
    this.endy = -50;
    this.fill = fill || '#AAAAAA';
    this.xhinges = [];
    this.yhinges = [];
    this.straight = false;
}

Arrow.prototype.draw = function(context){

    //handles editing for simple arrows (eg: line), adds in a control point at the midpoint of the line between them
    if(this.xhinges.length == 2 && this.endID >= 0){
        this.xhinges.splice(1,0, (this.xhinges[1]+this.xhinges[0])/2);
        this.yhinges.splice(1,0, (this.yhinges[1]+this.yhinges[0])/2);
        this.straight = true;
    }
    context.fillStyle = this.fill;
    context.beginPath();

    context.moveTo(this.startx, this.starty);
    var len = this.xhinges.length;
    // draw bezier interpolates to halfway points, this makes the curve drawing action more smoother and ensures WYSIWYG//
    for (var i = 1; i < len - 2; i ++)
    {
       var xc = (this.xhinges[i] + this.xhinges[i + 1]) / 2;
       var yc = (this.yhinges[i] + this.yhinges[i+1]) / 2;
       context.quadraticCurveTo(this.xhinges[i], this.yhinges[i], xc, yc);
    }
    // curve through the last two points
    context.quadraticCurveTo(this.xhinges[len-2], this.yhinges[len-2], this.xhinges[len-1], this.yhinges[len-1]);
    context.stroke();


    var oldFillStyle = context.fillStyle;
    context.fillStyle = "#FF0000";
    // draws all the control points
    for (var i = 1; i< len -1; i++){
        if(!(Math.abs(this.xhinges[i]-this.xhinges[i-1])<3 && Math.abs(this.yhinges[i]-this.yhinges[i-1])<3)){
            context.fillRect(this.xhinges[i]-3, this.yhinges[i]-3, 6, 6);
        }
    }
    context.fillStyle = oldFillStyle;

    // Approximates arrow head direction with line between second-to-last control point and end
    let angle = Math.atan2(this.endy - this.yhinges[len-2], this.endx - this.xhinges[len-2]);
    context.beginPath();
    context.moveTo(this.endx, this.endy);
    context.lineTo(this.endx-headsize*Math.cos(angle-Math.PI/7), this.endy-headsize*Math.sin(angle-Math.PI/7));
    context.stroke();

    context.beginPath();
    context.moveTo(this.endx, this.endy);
    context.lineTo(this.endx-headsize*Math.cos(angle+Math.PI/7), this.endy-headsize*Math.sin(angle+Math.PI/7));
    context.stroke();

}

// searches control points and returns index of control point if found, -1 otherwise
Arrow.prototype.contains = function(xLoc, yLoc) {
    for(var i = 0; i <this.xhinges.length; i++){
        if(Math.abs(this.xhinges[i] - xLoc) < 5 && Math.abs(this.yhinges[i] - yLoc) < 5){
            return i;
        }
    }
    return -1;

}