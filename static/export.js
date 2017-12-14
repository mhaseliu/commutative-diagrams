
function getBounds(blocks){
    // returns an array consisting of coordinates of leftmost block, rightmostblock, etc.
    var leftBound = blocks[0].posx;
    var rightBound= blocks[0].posx;
    var topBound= blocks[0].posy;
    var botBound= blocks[0].posy;
    for(var i =0; i < blocks.length; i++){
        if(blocks[i].posx > rightBound){
            rightBound = blocks[i].posx;
        }
        if(blocks[i].posx < leftBound){
            leftBound = blocks[i].posx;
        }
        if(blocks[i].posy > botBound){
            botBound = blocks[i].posy;
        }
        if(blocks[i].posy < topBound){
            topBound = blocks[i].posy;
        }
    }
    return [rightBound,leftBound, botBound,topBound];
}

function writeTex(blocks, arrows) {
    // generates final TeX output
    var tikzOutput = "\\begin{tikzpicture}[>=triangle 60] \n";
    tikzOutput += (writeBlock(blocks, getBounds(blocks)));
    tikzOutput += (writeArrow(arrows, getBounds(blocks), blocks));
    tikzOutput += "\\end{tikzpicture}"
    return tikzOutput;
}

function normalizeBlock(block, bounds){
    // converts block coordinates into TeX coordinates
    var posx = (block.posx - bounds[1])/50;
    var posy = (block.posy - bounds[3])/50;
    return [posx, posy];
}

function writeBlock(blocks, bounds){
    // creates the LaTeX block information
    // 28.5 PT column sep is a scaling constant to convert between canvasGrid and TeXgrid- if we want to change this
    // we will need to change the constant we are dividing by in writeArrow()
    var tikzOutput = "\\matrix[matrix of math nodes,column sep={28.5pt,between origins},row sep={28.5pt,between origins},nodes={asymmetrical rectangle}] \n"
    tikzOutput += "\{ \n";
    // loop through the matrix we plan to write
    for(var i = 0; i <= (bounds[2] - bounds[3])/50; i++){
        for(var j = 0; j <= (bounds[0] - bounds[1])/50; j++){
            var index = -1;
            // if there is a block at the current location, find the blockID
            for(var k = 0; k < blocks.length; k++){
                if(normalizeBlock(blocks[k], bounds)[0] == j && normalizeBlock(blocks[k], bounds)[1] ==i){
                    index = k;
                    break;
                }
            }
            // if there is a block, write relevant block information
            if(index >= 0){
                tikzOutput += "|[name ="
                tikzOutput += (index).toString();
                tikzOutput += "]| ";
                tikzOutput += blocks[index].text;
                if(j != (bounds[0] - bounds[1])/50){
                    tikzOutput += " & ";
                }
            }
            // otherwise, write a blank cell
            else{
                if(j != (bounds[0] - bounds[1])/50){
                    tikzOutput += " & ";
                }
            }

        }
        // new line
        tikzOutput += "\\\\ \n % \n";
    }
    tikzOutput += "}; \n";
    return tikzOutput;
}

function writeArrow(arrows, bounds, blocks){
    // creates the LaTeX arrow information
    var tikzOutput = "";
    // normalization constants for arrows
    var matrixCenter = [(bounds[0]+bounds[1])/2, (bounds[2]+bounds[3])/2];
    for(var i =0; i < arrows.length; i++){
        if(arrows[i].straight){
            // if its straight line, we don't need to do goofy bezier stuff which introduces inaccuracies
            tikzOutput += "\\draw[->] (";
            tikzOutput += arrows[i].startID;
            tikzOutput += ") edge (";
            tikzOutput += arrows[i].endID;
            tikzOutput += "); \n";
        }
        else{
            tikzOutput += "\\draw[->] (";
            tikzOutput += arrows[i].startID;
            tikzOutput += ") .. controls";
            // otherwise, repeat our averaging trick to draw the bezier curve.
            for(var j = 1; j < arrows[i].xhinges.length - 2; j++){
                tikzOutput += " (";
                tikzOutput += ((arrows[i].xhinges[j]- matrixCenter[0])/50);
                tikzOutput += ",";
                // tex grid and canvas grid point in opposite directions, hence the change of signs
                tikzOutput += ((-arrows[i].yhinges[j] + matrixCenter[1])/50);
                tikzOutput += ")";

                tikzOutput += ".. (";
                tikzOutput += ((((arrows[i].xhinges[j] + arrows[i].xhinges[j + 1]) / 2)-matrixCenter[0])/50);
                tikzOutput +=",";
                tikzOutput += ((-((arrows[i].yhinges[j] + arrows[i].yhinges[j + 1]) / 2)+matrixCenter[1])/50);
                tikzOutput +=")";
                tikzOutput += " .. controls";

            }
            // finally, directly curveTo the last two nodes, as we did in arrow.js
            tikzOutput += "(";
            tikzOutput += ((arrows[i].xhinges[arrows[i].xhinges.length-2]-matrixCenter[0])/50);
            tikzOutput += ",";
            tikzOutput += ((-arrows[i].yhinges[arrows[i].yhinges.length-2]+matrixCenter[1])/50);
            tikzOutput += ")"

            tikzOutput += " .. (";
            tikzOutput += arrows[i].endID;
            tikzOutput += "); \n";
        }
    }
    return tikzOutput;
}