// Execute when the DOM is fully loaded
/*global Block*/
let canvas;
let context;
let blocks = [];
let arrows = [];
let draggingBlock = false;
let draggingArrow = false;
let drawingarrow = false;
let blockSelection = null;
let frontAdjacentArrows = [];
let backAdjacentArrows = [];
let arrowSelection = null;
let dragoffsetx = 0;
let dragoffsety = 0;
let snapDistance = 25;
let gridSize = 50;
/*
    moustype is the type of button that the mouse last pressed on
    1 = box
    2 = arrow1
    7 = move
    8 = delete
*/
let mousetype = 7; //initialize to 'move'

$(document).ready(function() {
    // sets up buttons
    canvas = document.getElementById("myCanvas");
    canvasOutput = document.getElementById("myCanvasOutput");
    var button1 = document.getElementById("b1");
    var button2 = document.getElementById("b2");
    var button7 = document.getElementById("b7");
    var button8 = document.getElementById("b8");
    var buttonE = document.getElementById("export");

    button2.style.backgroundColor = "#505050";
    button1.style.backgroundColor = "#505050";
    button7.style.backgroundColor = "#505050";
    button8.style.backgroundColor = "#505050";
    buttonE.style.backgroundColor = "#505050";

    context = canvas.getContext("2d");
    draw();
    //mouse down current functionality:
    // SELECT MODE: if we click on a shape, it selects it. selected shapes can be dragged around. otherwise, it clears whatever selection we currently have. if selected box, can type into it to edit text
    // BOX MODE: creates a block, snapping to grid lines
    // ARROW MODE: click on a box to start arrow. every click thereafter not on a box defines a new control point for bezier curve, clicking on box finishes the arrow
    // DELETE MODE: if click on box or control points, deletes everything associated with it
    canvas.addEventListener('mousedown', function(e){
        if(mousetype == 7){
            // if select mode and we click a block
            var mouse = getMousePos(canvas, e);
            for(var i=0; i< blocks.length; i++){
                // find the block
                if(blocks[i].contains(mouse.x,mouse.y)){
                    blockSelection = blocks[i];
                    // identify arrows associated with the block
                    for(var j = 0; j < arrows.length; j++){
                        if(arrows[j].startID == i){
                            frontAdjacentArrows.push(arrows[j]);
                        }
                        if(arrows[j].endID == i){
                            backAdjacentArrows.push(arrows[j]);
                        }
                    }
                    // this is just to make dragging look pretty
                    dragoffsetx = mouse.x - blockSelection.posx;
                    dragoffsety = mouse.y - blockSelection.posy;
                    draggingBlock = true;
                    return;
                }
            }
            // if select mode and we click an arrow
            for(var i = 0; i < arrows.length; i++){
                // searches control points of every arrow
                var index = arrows[i].contains(mouse.x,mouse.y);
                if(index > 0){
                    // if we find a control point, define arrow Selection as (arrow, control point) and handle all the dragging booleans
                    arrowSelection = [arrows[i], index];
                    dragoffsetx = mouse.x - arrows[i].xhinges[index];
                    dragoffsety = mouse.y - arrows[i].yhinges[index];
                    draggingArrow = true;
                    return;
                }
            }
            // if we clicked on blank space, clear everything
            if(blockSelection){
                // deselect block
                blockSelection = null;
                frontAdjacentArrows = [];
                backAdjacentArrows = [];

            }
            if(arrowSelection){
                // deselect arrow
                arrowSelection = null;

            }
        }


        if(mousetype == 8){
            var mouse = getMousePos(canvas, e);
            for(var i=0; i< blocks.length; i++){
                // if clicked on block, delete it
                if(blocks[i].contains(mouse.x,mouse.y)){
                    blocks.splice(i,1);

                    frontAdjacentArrows = [];
                    backAdjacentArrows = [];
                    // get all the associated arrows and delete them as well
                    for(var j = 0; j < arrows.length; j++){
                        if(arrows[j].startID == i){
                            frontAdjacentArrows.push(j);
                        }
                    }

                    for(var j = frontAdjacentArrows.length-1; j >=0; j--){
                        arrows.splice(frontAdjacentArrows[j], 1);
                    }

                    for(var j = 0; j < arrows.length; j++){
                        if(arrows[j].endID == i){
                            backAdjacentArrows.push(arrows[j]);
                        }
                    }

                    for(var j = backAdjacentArrows.length-1; j >=0; j--){
                        arrows.splice(backAdjacentArrows[j], 1);
                    }

                    draw();

                    frontAdjacentArrows = [];
                    backAdjacentArrows = [];
                    return;
                }
            }
            // if clicked on arrow, delete it
            for (var i = 0; i<arrows.length; i++){
                if(arrows[i].contains(mouse.x, mouse.y)>0){
                    // if control point is selected, delete
                    arrows.splice(i, 1);
                    draw();
                    return;
                }
            }
        }

        if(mousetype == 1){
            // if block mode, create new block
            var mouse = getMousePos(canvas, e);
            var newBlock = new Block(mouse.x, mouse.y);
            snapToNode(newBlock, e);
            blocks.push(newBlock);
            draw();

        }

        if(mousetype == 2){
            // if arrow mode, create new arrow
            var mouse = getMousePos(canvas, e);
            if(drawingarrow == false){
                // if not currently drawing arrow
                for (var i = 0; i < blocks.length; i++){
                    // check to see we are starting at block
                    if(blocks[i].contains(mouse.x, mouse.y)){
                        //startingarrow = true;
                        drawingarrow = true;
                        // define new arrow with hinges = block locations
                        var newArrow = new Arrow(i, blocks[i].posx, blocks[i].posy);
                        arrows.push(newArrow);
                        arrows[arrows.length-1].xhinges.push(blocks[i].posx);
                        arrows[arrows.length-1].yhinges.push(blocks[i].posy);
                        break;
                    }
                }
            }
            else{
                // if we click while drawing an arrow, add the point as a new control point
                var loc = arrows.length-1;
                arrows[loc].xhinges.push(mouse.x);
                arrows[loc].yhinges.push(mouse.y);
                for(var i =0; i < blocks.length; i++){
                    // if we click on a block, finish arrow drawing
                    if(blocks[i].contains(mouse.x, mouse.y)){
                        arrows[loc].xhinges.pop();
                        arrows[loc].yhinges.pop();
                        arrows[loc].xhinges.push(blocks[i].posx);
                        arrows[loc].yhinges.push(blocks[i].posy);
                        arrows[loc].endID = i;
                        arrows[loc].endx = blocks[i].posx;
                        arrows[loc].endy = blocks[i].posy;
                        drawingarrow = false;
                        draw();
                    }
                }
            }
        }
    }, true);

    canvas.addEventListener('mousemove', function(e) {
        if(mousetype == 7){
            if (draggingBlock){
                // if we are dragging block, dynamically update block position
                var mouse = getMousePos(canvas, e);
                blockSelection.posx = mouse.x - dragoffsetx;
                blockSelection.posy = mouse.y - dragoffsety;
                snapToNode(blockSelection, e);
                for(var i = 0; i < frontAdjacentArrows.length; i++){
                    // also update arrows which start at that block
                    frontAdjacentArrows[i].startx = blockSelection.posx;
                    frontAdjacentArrows[i].starty = blockSelection.posy;
                    frontAdjacentArrows[i].xhinges[0] = blockSelection.posx;
                    frontAdjacentArrows[i].yhinges[0] = blockSelection.posy;
                }
                for(var i = 0; i < backAdjacentArrows.length; i++){
                    // and arrows which end at that block
                    backAdjacentArrows[i].endx = blockSelection.posx;
                    backAdjacentArrows[i].endy = blockSelection.posy;
                    backAdjacentArrows[i].xhinges[backAdjacentArrows[i].xhinges.length-1] = blockSelection.posx;
                    backAdjacentArrows[i].yhinges[backAdjacentArrows[i].yhinges.length-1] = blockSelection.posy;
                }

                draw();
            }
            if (draggingArrow){
                // if dragging an arrow, edit the relevant hinge
                var mouse = getMousePos(canvas, e);
                arrowSelection[0].xhinges[arrowSelection[1]] = mouse.x - dragoffsetx;
                arrowSelection[0].yhinges[arrowSelection[1]] = mouse.y - dragoffsety;

                draw();
            }
        }
        if(mousetype == 2){
            if(drawingarrow){
                // treat mouse location as another control point
                var mouse = getMousePos(canvas, e);
                arrows[arrows.length-1].xhinges.push(mouse.x);
                arrows[arrows.length-1].yhinges.push(mouse.y);
                draw();
                arrows[arrows.length-1].xhinges.pop();
                arrows[arrows.length-1].yhinges.pop();
            }
        }
    }, true);

    canvas.addEventListener('mouseup', function(e) {

        let found = false;
        frontAdjacentArrows = [];
        backAdjacentArrows = [];
        draggingBlock = false;
        draggingArrow = false;
    }, true);


    button1.addEventListener('click', function(e){
        mousetype = 1;
        button1.style.backgroundColor = "#A9A9A9";
        button2.style.backgroundColor = "#505050";
        button7.style.backgroundColor = "#505050";
        button8.style.backgroundColor = "#505050";

        blockSelection = null;
        frontAdjacentArrows = [];
        backAdjacentArrows = [];
        draggingBlock = false;
        draggingArrow = false;
    }, true);

    button2.addEventListener('click', function(e){
        mousetype = 2;
        button2.style.backgroundColor = "#A9A9A9";
        button1.style.backgroundColor = "#505050";
        button7.style.backgroundColor = "#505050";
        button8.style.backgroundColor = "#505050";

        blockSelection = null;
        frontAdjacentArrows = [];
        backAdjacentArrows = [];
        draggingBlock = false;
        draggingArrow = false;

    }, true);

    button7.addEventListener('click', function(e){

        mousetype = 7;
        button7.style.backgroundColor = "#A9A9A9";
        button1.style.backgroundColor = "#505050";
        button2.style.backgroundColor = "#505050";
        button8.style.backgroundColor = "#505050";

        blockSelection = null;
        frontAdjacentArrows = [];
        backAdjacentArrows = [];
        draggingBlock = false;
        draggingArrow = false;

    }, true);

    button8.addEventListener('click', function(e){
        mousetype = 8;
        button8.style.backgroundColor = "#A9A9A9";
        button1.style.backgroundColor = "#505050";
        button2.style.backgroundColor = "#505050";
        button7.style.backgroundColor = "#505050";

        blockSelection = null;
        frontAdjacentArrows = [];
        backAdjacentArrows = [];
        draggingBlock = false;
        draggingArrow = false;

    }, true)

    buttonE.addEventListener('click', function(e){
        mousetype = 8;
        button8.style.backgroundColor = "#505050";
        button1.style.backgroundColor = "#505050";
        button2.style.backgroundColor = "#505050";
        button7.style.backgroundColor = "#505050";
        var nestedDiv = document.getElementById("nested");
        nestedDiv.textContent = writeTex(blocks,arrows);
        //alert(writeTex(blocks,arrows));
    }, true)

});

function changeToGrey(){

}


function createImageOnCanvas(imageId) {
    canvas.style.display = "block";
    document.getElementById("images").style.overflowY = "hidden";
    var img = new Image(600, 600);
    img.src = document.getElementById(imageId).src;
    context.drawImage(img, (0), (0)); //onload....
}

function draw(e) {

    context.clearRect(0, 0, canvas.width, canvas.height);

    var oldstrokeStyle = context.strokeStyle;
    context.beginPath();
    context.strokeStyle = "#d3d3d3";
    for(var i = 0; i < canvas.width; i+=gridSize){
        context.moveTo(i,0);
        context.lineTo(i,canvas.height);
        context.stroke();
    }
    for(var i = 0; i < canvas.height; i+=gridSize){
        context.moveTo(0,i);
        context.lineTo(canvas.width,i);
        context.stroke();
    }
    context.strokeStyle = oldstrokeStyle;

    for(var i = 0; i < arrows.length; i++){
        arrows[i].draw(context);
    }

    for(var i = 0; i<blocks.length; i++){
        blocks[i].draw(context);
    }

}

function getMousePos(canvas, evt) {
    // gets mouse position
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

function snapToNode(block, evt) {
    // moves block to closest grid coordinate
    var mouse = getMousePos(canvas, evt);
    if( Math.floor((block.posx+snapDistance)/gridSize) > Math.floor((block.posx-snapDistance)/gridSize)){
        block.posx = gridSize * (Math.floor((block.posx+snapDistance)/gridSize));
    }
    if( Math.floor((block.posy+snapDistance)/gridSize) > Math.floor((block.posy-snapDistance)/gridSize)){
        block.posy = gridSize * (Math.floor((block.posy+snapDistance)/gridSize));
    }
}



function isFocused(){
    // gets active element
	return (document.body || document.activeElement) == document.body;
}


document.onkeydown = function(e){
    // when we type, scan to see if it is backspace. if so, delete it\
	var key = crossBrowserKey(e);
    if(!isFocused()){
        return true;
    }
    else if(key ==8){
        if(blockSelection != null && 'text' in blockSelection){
            blockSelection.text = blockSelection.text.substr(0, blockSelection.text.length -1);
            draw();
        }
    }
}

document.onkeypress = function(e){
    // if key is a normal character key, begin typing
    var key = crossBrowserKey(e);
    if(!isFocused()){
        return true;
    }
    else if (key ==8){
        return false;
    }
    else if (key >= 0x20 && key <= 0x7e && !e.metaKey && !e.altKey && !e.ctrlKey && blockSelection != null && 'text' in blockSelection){
        blockSelection.text += String.fromCharCode(key);
        draw();
        return false;
    }
}

function crossBrowserKey(e) {
    // returns which key was pressed, independent of browser used
	e = e || window.event;
	return e.which || e.keyCode;
}

