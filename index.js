// Author: Karl Winkler
// Version 2.0 (idk how to count this shit)
// As of: 2021-07-14

// general information

// List of types:
// - Wire
// - Resistor
// - Voltage src
// - Current src

// constants

//number of implemented states
const totalStates = 6
// margin for the canvase (to determine 0,0)
const margin = 8
//size of different nodes
const wireRadius = 5
const resistorRadius = 10
const voltageRadius = 10 // replace resistorRadius later where appropriate
const currentRadius = 10 // same as above


//arrays

// array of graph objects
var graphArr = []
//array of selected nodes
var selectedNodes = []

// state variables

//current action that the click will perform
//0 = new node
//1 = select node (when two nodes are selected they will be connected/dissconected)
//2 = delete node
//3 = new resistor
var clickState = 0;

//toggle snap to grid
var snapToGrid = true;
//toggle snapLink feature
var snapLink = true;

//x and y of mouse on the page
var pageX = 0;
var pageY = 0;

// onClick event listeners
$("#canvas").click(leftClick) // left Click
// $(document).keydown(event, keyPressHandler) (somewhere arround line 250-300 )

// setting up the canvase and defining things
var canvas = $("#canvas").get(0) //get the canvase object
var width = canvas.width
var height = canvas.height
var ctx = canvas.getContext("2d") // create the canvase

// clears the canvas then draws the circuit and prints the current state for debug
// calls itself after a delay with window.requestAnimationFrame()
function draw() {
  ctx.clearRect(0, 0, width, height)
  drawGrid();
  drawSnapCircle();
  drawCirtcuit();
  drawMenu();
  // console.log(clickState)
  window.requestAnimationFrame(draw);
}

// defines the point 0,0 of the canvase on the web page (deprecated?)
var canvasLeft = canvas.offsetLeft
var canvasTop = canvas.offsetTop
var elements = [];

// node, used in graph of circuit
// type : type of circuit element
// x,y : coordinates on the canvas
// connections[] : other connected nodes
function Node(type, x, y, radius, connections){
  this.type = type;
  this.x = x;
  this.y = y;
  this.connections = connections;
  this.radius = radius;
  this.rotation = 0;
  this.colour = "black"
  graphArr.push(this);
}
// var Node = {
//   type: "",
//   x: 0,
//   y: 0,
//   connections: [4]
// };

//starting point of the graph
var n1 = new Node("wire", 50, 50, wireRadius, []);
var n2 = new Node("wire", 100, 100, wireRadius, []);
var n3 = new Node("wire", 100, 50, wireRadius, []);
toggleConnectNodes(n1, n2);
toggleConnectNodes(n2, n3);

//update cycle
function drawCirtcuit(){
  if(selectedNodes.length > 1){
    toggleConnectNodes(selectedNodes[0], selectedNodes[1])
    selectedNodes = []
  }
  drawNodes();
}

// draws all of the nodes thourough the graph from the graphArr
function drawNodes(){

  for(i = 0; i < graphArr.length; i++){
    drawConnections(graphArr[i])
  }

  for(i = 0; i < graphArr.length; i++){
    switch(graphArr[i].type){
      case "wire":
        drawWire(graphArr[i]);
        break;
      case "resistor":
        drawResistor(graphArr[i]);
        break;
      case "voltageSrc":
        drawVoltageSrc(graphArr[i]);
        break;
      case "currentSrc":
        drawCurrentSrc(graphArr[i]);
        break;
    }
  }
}

// draws a wire node
function drawWire(node){
  ctx.strokeStyle = node.colour
  if(node.connections.length == 0){
    circle(node.x, node.y, node.radius)
  }
  else if(isSelected(node) || node.connections.length == 1){
      circle(node.x, node.y, node.radius)
  }
  else {
    ctx.strokeStyle = "rgba(0,0,0,0.3)"
    circle(node.x, node.y, node.radius)
  }


}

function drawResistor(node){
  var img = $("#resistorSprite").get(0)
  ctx.drawImage(img, node.x - node.radius , node.y - node.radius, node.radius*2, node.radius*2)
  if(isSelected(node)){
    ctx.strokeStyle = "orange"
  }
  else{
    ctx.strokeStyle = node.colour
  }
  circle(node.x, node.y, node.radius)
}

function drawVoltageSrc(node){
  var img = $("#voltageSprite").get(0)
  ctx.drawImage(img, node.x - node.radius , node.y - node.radius, node.radius*2, node.radius*2)
  if(isSelected(node)){
    ctx.strokeStyle = "orange"
    circle(node.x, node.y, node.radius)
  }
  else{
    ctx.strokeStyle = node.colour
  }
}

function drawCurrentSrc(node){
  var img = $("#currentSprite").get(0)
  ctx.drawImage(img, node.x - node.radius , node.y - node.radius, node.radius*2, node.radius*2)
  if(isSelected(node)){
    ctx.strokeStyle = "orange"
  }
  else{
    ctx.strokeStyle = node.colour
  }
  circle(node.x, node.y, node.radius)
}

// returns true if twu nodes are equal (same x and y)
function equateNodes(nodeA, nodeB){
  if(nodeA.x == nodeB.x && nodeA.y == nodeB.y){
    return true;
  }
  return false;
}

// handles the behaviours of leftClick depending on the state
// snaps x,y to grid if snapToGrid is true

// State 0: add wire, creates a node at the x,y values if there is not a node already there

// State 1: select a node if there is a node where x,y is
// deselects nodes if there is no node or an already selected node

// State 2: deletes a node at x,y

// State 3: add resistor, adds a resistor node with the same conditions as add wire

// State 4: add voltageSrc, adds a voltage source node with the same conditions as add wire

// State 5: add currentSrc, adds a current source node with the same conditions as add wire
function leftClick(){
  var x = event.pageX - margin
  var y = event.pageY - margin

  if(snapToGrid && clickState != 1 || snapToGrid && clickState == 1 && snapLink){
    x = Math.round(x/40)*40;
    y = Math.round(y/40)*40;
  }

  switch(clickState){
    case 0: // add Wire
      if(validLocation(x, y)){
        new Node("wire", x, y, wireRadius, []);
      }
      break;
    case 1: // Select
      if(!validLocation(x, y)){
        var node = getNodeClicked(x, y)
        if(!isSelected(node)){
          node.colour = "orange"
          selectedNodes.push(node)
        }
        else{
          for(var i = 0; i < selectedNodes.length; i++){
            if(equateNodes(node, selectedNodes[i])){
              selectedNodes.splice(i, 1);
            }
          }
          node.colour = "black"
        }
      }
      else{
        for(var i = 0; i < selectedNodes.length; i++){
          selectedNodes[i].colour = "black"
        }
        selectedNodes = []
      }
      break;
    case 2: // Delete
      if(!validLocation(x, y)){
        var node = getNodeClicked(x, y)
        deleteNode(node);
      }
      break;
    case 3: // add Resistor
      if(validLocation(x, y)){
        new Node("resistor", x, y, resistorRadius, []);
      }
      break;
    case 4: // add voltageSrc
      if(validLocation(x, y)){
        new Node("voltageSrc", x, y, resistorRadius, []);
      }
      break;
    case 5: // add currentSrc
      if(validLocation(x, y)){
        new Node("currentSrc", x, y, resistorRadius, []);
      }
      break;
  }
  console.log(x + " " + y);
}

// removes a node from the graphArr then removes it from all of its connections
function deleteNode(node){
  for(var i = 0; i < graphArr.length; i++){
    if(equateNodes(node, graphArr[i])){
      graphArr.splice(i, 1);
    }
  }
  for(var i = 0; i < node.connections.length; i++){
    for(var j = 0; j < node.connections[i].connections.length; j++){
      if(equateNodes(node, node.connections[i].connections[j])){
        node.connections[i].connections.splice(j, 1);
      }
    }
  }
  selectedNodes = [];
}

// draws the circle that indicates where the click will be snapped to
function drawSnapCircle(){
  ctx.strokeStyle = "rgba(0,0,0,0.2)"
  circle(pageX, pageY, 12)
}

//handles all keydown presses (any key is pressed down)
$(document).keydown(function keyPressHandler(event){
  switch(event.which){
    //state changes
    case 81: //q
      clickState = 0
      break;
    case 87: //w
      clickState = 1
      break;
    case 69: //e
      clickState = 2
      break;
    case 82: //r
      clickState = 3
      break;
    case 84: //t
      clickState = 4
      break;
    case 89: //y
      clickState = 5
      break;

    // toggles snap to grid
    case 83: //s
      snapToGrid = !snapToGrid
      break;
    // toggle snap link feature
    case 188: //,
      snapLink = !snapLink
      break;

  } // end of SWITCH statement

  //increment state (keep incase I want to implement later)
    // if(clickState < totalStates - 1){
    //   clickState++;
    // }
    // else{
    //   clickState = 0;
    // }

}); // end of KEYDOWN Listener


$("#canvas").mousemove(function(event) {
  var x = event.pageX - margin
  var y = event.pageY - margin

  if(snapToGrid){
    x = Math.round(x/40)*40;
    y = Math.round(y/40)*40;
  }
  pageX = x;
  pageY = y;
});

// returns true if the node is able to be placed
// a node cannot be on top of another node
// a node cannot be placed on the menu
function validLocation(x, y){
  // basic collision detection for all other nodes
  for(var i = 0; i < graphArr.length; i++){
    distance = getDistance(graphArr[i].x, graphArr[i].y, x, y)
    if(distance < graphArr[i].radius*2){
      return false;
    }
  }
  // finding the bottom of the menu.
  // multiply the number of states by the height of the menu boxes and add that
  // to the Y coord of the menu, then add the extra height of the selected box
  var bottomY = menuY + totalStates *  boxHeight + selectedBoxHeight - boxHeight

  // hit detection for menu (50 is just a buffer arround the box)
  if(x > width - (selectedBoxWidth + 50)){
    return false;
  }

  return true;
}

// returns true if a node is selected (in the selected nodes array)
function isSelected(node){
  for(var i = 0; i < selectedNodes.length; i++){
    if(node == selectedNodes[i]){
      return true;
    }
  }
  return false;
}

// returns the node that has been clicked
function getNodeClicked(x, y){
  for(var i = 0; i < graphArr.length; i++){
    distance = getDistance(graphArr[i].x, graphArr[i].y, x, y)
    if(distance < graphArr[i].radius*2){
      // console.log(graphArr[i].type)
      return graphArr[i];
    }
  }
}

//distance between 2 points d=√((x2-x1)²+(y2-y1)²)
function getDistance(x1, y1, x2, y2){
  return Math.sqrt(Math.abs(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)))
}

// runtime stuff (runs the show)
draw();
window.requestAnimationFrame(draw);
