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

// variables

// location of the nodes name in the stateNames array
var nodeNumInArray = 0;
// array for permitting changes to voltage/current/resistance
var nodeDataSettings = [];

// listeners
$("#canvas").click(menuClick) // Left click check for menus



// draws the sidebar menu
function drawMenu(){
  var currentY = menuY
  ctx.strokeStyle = lineColour
  for(var i = 0; i < totalStates; i++){
    if(i == clickState){
      ctx.fillStyle = mainColour
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
      ctx.fillStyle = secondaryColour
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
  ctx.strokeStyle = gridColour
  for(var i = 0; i < height; i+=gridSize){
    line(0, i, width, i)
  }

  for(var i = 0; i < width; i+=gridSize){
    line(i, 0, i, height)
  }
}

// draw menus for each state and some global info

// global: snap to grid

// State linkState: what link mode is active and state of snapLink (on/off)

// State voltageState and currentState: angle they are facing (maybe add direction arrow or something)

function drawSubMenu(){
  switch(clickState){
    case linkState:
      // look at changing order mayhaps?
      var arr = ["SnapLink", snapLink, "Default", linkMode == 0, "Continuous", linkMode == 1, "Multi", linkMode == 2]
      subMenu(arr, arr.length/2 + 1)
      break;
    case voltageState:
      var arr = [setRotation + "??", true]
      subMenu(arr, arr.length/2 + 1)
      break;
    case currentState:
      var arr = [setRotation + "??", true]
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
      ctx.fillStyle = mainColour
      rectangle(startX, height - labelHeight*2, labelWidth, labelHeight*2)
      rectangleFill(startX, height - labelHeight*2, labelWidth, labelHeight*2)
      ctx.font = "15px sans-serif"
      ctx.fillStyle = textColour
      ctx.strokeStyle = textColour
      ctx.fillText(labels[i*2], startX + 10, height - labelHeight)
    }
    else{
      ctx.strokeStyle = lineColour
      ctx.fillStyle = secondaryColour
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
function drawDataSheet(){

  node = selectedNode

  nodeEnum(node.type)

  ctx.fillStyle = secondaryColour
  ctx.strokeStyle = defaultColour
  rectangleFill(0, 0, dataSheetWidth, dataSheetHeight)
  rectangle(1, 1, dataSheetWidth, dataSheetHeight)

  ctx.fillStyle = textColour
  ctx.font = "30px sans-serif"
  //make the text starting y a variabole dependant on the node type when I make custom titles Switch
  ctx.fillText(stateNames[nodeNumInArray], dataSheetWidth/8, dataSheetHeight/5)
  ctx.font = "16px sans-serif"

  //fixing colour of text
  $(".data-label").css("color", textColour )

  // disabling text boxes that shouldnt be changed (they can sdtill be changed in debug)
  $("#voltage-input").prop('disabled', !nodeDataSettings[0])
  $("#current-input").prop('disabled', !nodeDataSettings[1])
  $("#resistance-input").prop('disabled', !nodeDataSettings[2])
}

// submits the data from the selected node
// called from the Change button or the enter key
function submitData(){
  selectedNode.voltage = $("#voltage-input").val()
  selectedNode.current = $("#current-input").val()
  selectedNode.resistance = $("#resistance-input").val()
}

// draws the small (quick reference)  data that goes beside each node
function drawSmallData(){
  for(var i = 0; i < graphArr.length; i++){
    node = graphArr[i]
    if(node.type != "wire"){
      ctx.fillStyle = defaultColourMedium
      ctx.font = "10px monospace"
      ctx.fillText("v: " + node.voltage, node.x + node.radius, node.y + 12.5)
      ctx.fillText("c: " + node.current, node.x + node.radius, node.y + 21)
      ctx.fillText("r: " + node.resistance, node.x + node.radius, node.y + 28.5)
    }
  }

}

// detects clicks on the side bar menu
function menuClick(){

  var x = event.pageX - margin
  var y = event.pageY - margin
  var currentY = menuY

  if(x > width - boxWidth && y < width - labelHeight*2){

    //reset data sheet
    setDataSheet = false

      for(var i = 0;  i < totalStates; i++){
        // console.log("current: " + currentY + " " + (currentY + boxHeight))
        if(i != clickState && y > currentY && y < currentY + boxHeight){
          // console.log(i)
          clickState = i;
          if(i == voltageState){
            $(document).trigger("keydown", voltageKey)
            console.log(voltageKey)
          }
          if(i == currentState){
            $(document).trigger("keydown", currentState)
          }
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

function themeSelect(theme){
  switch(theme){
    case 0: // lightMode
      updateTheme(["white", "black", "rgb(204,204,204)", "orange", "red", "black","rgb(75,75,75)",
                   "rgb(30,30,30)", "rgb(230,230,230)", "rgba(255, 0, 0, 0.5)",
                   "rgba(255, 0, 0, 0.1)", "rgb(77,77,77)"])
      break;
    case 1: // darkMode
      updateTheme(["rgb(77,77,77)", "white", "rgba(255,255,255,0.2)", "orange",
        "red", "rgba(255,255,255,0.7)", "rgba(150,150,150,1)", "rgba(200,200,200,1)", "rgba(255,255,255,0.1)",
        "rgba(50,50,50,0.5)", "rgba(50,50,50,0.1)", "rgba(255,255,255,0.7)"])
      break;
  }
}

function updateTheme(colours){
  backgroundColour = colours[0]
  defaultColour = colours[1]
  defaultColourLight = colours[2]
  linkColour = colours[3]
  selectColour = colours[4]
  wireColour = colours[5]
  lineColour = colours[6]
  textColour = colours[7]
  gridColour = colours[8]
  mainColour = colours[9]
  secondaryColour = colours[10]
  defaultColourMedium = colours[11]
  $('body').css("background-color", colours[0])
}

// useful information for each node type so that I dont have to type shit out all the timeout
// Just call once you have your node defined
function nodeEnum(name){
  switch(name){
    case "wire":
      nodeNumInArray = 0;
      nodeDataSettings = [false, false, false]
      break;
    case "resistor":
      nodeNumInArray = 4;
      nodeDataSettings = [false, false, true]
      break;
    case "voltageSrc":
      nodeNumInArray = 5;
      nodeDataSettings = [true, false, false]
      break;
    case "currentSrc":
      nodeNumInArray = 6;
      nodeDataSettings = [false, true, false]
      break;
    default:
      stateNames.push(name)
      nodeNumInArray = stateNames.length - 1
  }
}
