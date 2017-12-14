/*global context*/
/*global selectedObject*/
/*global drawText*/
/*global blockSelection*/

// Define a Block by position and fill
function Block(posx, posy, fill){
     this.posx = posx || 0;
     this.posy = posy || 0;
     this.fill = '#C8C8C8';
     this.text = "";
     this.width = 7;
     this.height = 20;
}

Block.prototype.draw = function(context) {
	// Draw the Block
	context.fillStyle = this.fill;
	// Create new image based on mimetex to render LaTeX as as png
    var image = new Image();
    var x = this.posx;
    var y = this.posy;
    var text = this.text;
    // Draw either empty box or render LaTeX depending on whether or not text is ""
    if (text.length > 0) {
        image.src = "http://www.forkosh.com/mimetex.cgi?" + text;
        image.onload = this.onload(image);
    }
    else {
        // Draw rectangle
        context.fillRect(x - 3, y - 10, 7, 20)
    }
}

Block.prototype.onload = function(image) {
    context.fillStyle = this.fill;
	// Create new image based on mimetex to render LaTeX as as png
	var width = image.naturalWidth;
	var height = image.naturalHeight;
    var x = this.posx;
    var y = this.posy;
    var text = this.text;
    // Make sure selected block is close enough
    if (blockSelection == null || (blockSelection.posx - x) * (blockSelection.posx - x) +  (blockSelection.posy - y)
        * (blockSelection.posy - y) > 25) {
        context.fillRect(x - width/2, y - height/2 - 5, width + 1, height + 10);
        // Draw image (render LaTeX) if block selected
        context.drawImage(image, x - width/2, y - height/2 + 2);
    }
    else {
        var diffWidth = Math.round(context.measureText(text).width);
        var diffHeight = 10;
        context.fillRect(x - diffWidth/2, y - diffHeight/2 - 5, diffWidth + 1, diffHeight + 10);
        context.font = '20px "Times New Roman", serif'
        context.strokeStyle = '#000000';
        // Draw text if block not selected
        context.strokeText(text, x - diffWidth/2, y - diffHeight/2 + 13);
    }
    this.width = width + 1;
    this.height = height + 10;
};

Block.prototype.contains = function(xLoc, yLoc) {
    // Check if block contains a point
    if(Math.abs(xLoc-this.posx) <= Math.max(10, this.width / 2) && Math.abs(yLoc-this.posy) <= Math.min(10, this.height / 2)){
        return true;
    }
    return false;
}
