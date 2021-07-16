//arrays

// all state names
const stateNames = ["Wire", "Link", "Select", "Delete", "Resistor", "Voltage", "Current"]

//constants

//grid size for the delta between grid points
const gridSize = 30
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
//sub label width
const labelWidth = 100
//sub label height
const labelHeight = 25
//datasheet width
const dataSheetWidth = 160
//datasheet height
const dataSheetHeight = 200

// nodeEnum variables
// location of the nodes name in the stateNames array
var nodeNum = 0;
// array for permitting changes to voltage/current/resistance
var nodeDataSettings = [];

// listeners
$("#canvas").click(menuClick) // Left click check for menus

//colour variables (should probably be constants)
var lineColour = "rgba(75,75,75,1)"
var textColour = "rgba(30,30,30,1)"

// draws the sidebar menu
function drawMenu(){
  var currentY = menuY
  ctx.strokeStyle = lineColour
  for(var i = 0; i < totalStates; i++){
    if(i == clickState){
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

//draws the background grid
function drawGrid(){
  ctx.strokeStyle = "rgba(0,0,0,0.1)"
  for(var i = 0; i < height; i+=gridSize){
    line(0, i, width, i)
  }

  for(var i = 0; i < width; i+=gridSize){
    line(i, 0, i, height)
  }
}

// draw menus for each state and some global info

// global: snap to grid

// State linkNum: what link mode is active and state of snapLink (on/off)

// State voltageNum and currentNum: angle they are facing (maybe add direction arrow or something)

function drawSubMenu(){
  switch(clickState){
    case linkNum:
      // look at changing order mayhaps?
      var arr = ["SnapLink", snapLink, "Default", linkMode == 0, "Continuous", linkMode == 1, "Multi", linkMode == 2]
      subMenu(arr, arr.length/2 + 1)
      break;
    case voltageNum:
      var arr = [setRotation + "°", true]
      subMenu(arr, arr.length/2 + 1)
      break;
    case currentNum:
      var arr = [setRotation + "°", true]
      subMenu(arr, arr.length/2 + 1)
      break;
  }

  var arr = ["Snap to grid", snapToGrid]
  subMenu(arr, arr.length/2)
}

// builds the sub menu for a given state (the menu for all state specific toggles and modes as well as global toggle states)
function subMenu(labels, index){
  var menues = labels.length/2
  var startX = width - (index) * labelWidth

  for(var i = 0; i < menues; i++){
    if(labels[i*2+1]){
      ctx.strokeStyle = lineColour
      ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
      rectangle(startX, height - labelHeight*2, labelWidth, labelHeight*2)
      rectangleFill(startX, height - labelHeight*2, labelWidth, labelHeight*2)
      ctx.font = "15px sans-serif"
      ctx.fillStyle = textColour
      ctx.strokeStyle = textColour
      ctx.fillText(labels[i*2], startX + 10, height - labelHeight)
    }
    else{
      ctx.strokeStyle = lineColour
      ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
      rectangle(startX, height - labelHeight, labelWidth, labelHeight)
      rectangleFill(startX, height - labelHeight, labelWidth, labelHeight)
      ctx.font = "10px sans-serif"
      ctx.fillStyle = textColour
      ctx.strokeStyle = textColour
      ctx.fillText(labels[i*2], startX + 10, height - labelHeight/2)
    }

    startX += labelWidth;
  }
}

// draws data sheet in the top left
function drawDataSheet(node){

  nodeEnum(node.type)

  ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
  rectangleFill(0, 0, dataSheetWidth, dataSheetHeight)
  rectangle(1, 1, dataSheetWidth, dataSheetHeight)

  ctx.fillStyle = textColour
  ctx.font = "30px sans-serif"
  //make the text starting y a variabole dependant on the node type when I make custom titles Switch
  ctx.fillText(stateNames[nodeNum], dataSheetWidth/8, dataSheetHeight/5)
  ctx.font = "16px sans-serif"

  // disabling text boxes that shouldnt be changed (they can sdtill be changed in debug)
  $("#voltage-input").prop('disabled', !nodeDataSettings[0])
  $("#current-input").prop('disabled', !nodeDataSettings[1])
  $("#resistance-input").prop('disabled', !nodeDataSettings[2])
}

// submits the data from the selected node
// called from the Change button or the enter key
function submitData(){
  selectedNode.voltage = $("#voltage-input").val()[0]
  selectedNode.current = $("#current-input").val()[0]
  selectedNode.resistance = $("#resistance-input").val()[0]
}

// draws the small (quick reference)  data that goes beside each node
function drawSmallData(node){
  ctx.fillStyle = "rgba(0,0,0,0.7)"
  ctx.font = "10px monospace"
  ctx.fillText("v: " + node.voltage, node.x + node.radius, node.y + 12.5)
  ctx.fillText("c: " + node.current, node.x + node.radius, node.y + 21)
  ctx.fillText("r: " + node.resistance, node.x + node.radius, node.y + 28.5)
}

// detects clicks on the side bar menu
function menuClick(){

  var x = event.pageX - margin
  var y = event.pageY - margin
  var currentY = menuY

  if(x > width - boxWidth && y < width - labelHeight*2){
      for(var i = 0;  i < totalStates; i++){
        // console.log("current: " + currentY + " " + (currentY + boxHeight))
        if(i != clickState && y > currentY && y < currentY + boxHeight){
          // console.log(i)
          clickState = i;
          break;
        }
        else if(i == clickState){
          currentY += selectedBoxHeight;
        }
        else{
          currentY += boxHeight;
        }
      }
  }
}

// useful information for each node type so that I dont have to type shit out all the timeout
// Just call once you have your node defined
function nodeEnum(name){
  switch(name){
    case "wire":
      nodeNum = 0;
      nodeDataSettings = [false, false, false]
      break;
    case "resistor":
      nodeNum = 4;
      nodeDataSettings = [false, false, true]
      break;
    case "voltageSrc":
      nodeNum = 5;
      nodeDataSettings = [true, false, false]
      break;
    case "currentSrc":
      nodeNum = 6;
      nodeDataSettings = [false, true, false]
  }
}
