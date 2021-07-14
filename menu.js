//arrays

// all state names
const stateNames = ["Wire", "Link", "Delete", "Resistor", "Voltage", "Current"]

//constants

//grid size for the delta between grid points
const gridSize = 40
//height of menu boxes
const boxHeight = 50
//width of menu boxes
const boxWidth = 50
//start height of drawMenu
const menuY = 20
//selected state box height
const selectedBoxHeight = 100
//selected box width
const selectedBoxWidth = 100

var lineColour = "rgba(75,75,75,1)"
var textColour = "rgba(30,30,30,1)"
function drawMenu(){
  var currentY = menuY
  for(var i = 0; i < totalStates; i++){
    if(i == clickState){
      ctx.strokeStyle = lineColour
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)"
      rectangleFill(width-selectedBoxWidth, currentY, selectedBoxWidth, selectedBoxHeight)
      rectangle(width-selectedBoxWidth, currentY, selectedBoxWidth, selectedBoxHeight)
      ctx.font = "20px sans-serif"
      // console.log(ctx.font)
      ctx.fillStyle = textColour
      ctx.strokeStyle = textColour
      ctx.fillText(stateNames[i], width - selectedBoxWidth + 10, currentY + selectedBoxHeight/2 + 5)

      currentY += selectedBoxHeight
    }
    else{
      ctx.fillStyle = "rgba(255, 0, 0, 0.1)"
      rectangleFill(width-boxWidth, currentY, boxWidth, boxHeight)
      rectangle(width-boxWidth, currentY, boxWidth, boxHeight)

      ctx.font = "10px sans-serif"
      ctx.fillStyle = textColour
      ctx.strokeStyle = textColour
      ctx.fillText(stateNames[i], width - boxWidth + 5, currentY + boxHeight/2)

      currentY += boxHeight
    }
  }
}

function drawGrid(){
  ctx.strokeStyle = "rgba(0,0,0,0.1)"
  for(var i = 0; i < height; i+=gridSize){
    line(0, i, width, i)
  }

  for(var i = 0; i < width; i+=gridSize){
    line(i, 0, i, height)
  }
}
