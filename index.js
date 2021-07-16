// Author: Karl Winkler
// Version 3.0 (I think I'm doing this right)
// Last Updated: 2021-07-15

// general information

// List of types:
// - Wire
// - Resistor
// - Voltage src
// - Current src

// constants

//number of implemented states
const totalStates = 7
// margin for the canvase (to determine 0,0)
const margin = 8
//size of different nodes
const wireRadius = 5
const resistorRadius = 10
const voltageRadius = 10 // replace resistorRadius later where appropriate
const currentRadius = 10 // same as above
//different state numbers
const wireNum = 0, linkNum = 1, selectNum = 2, deleteNum = 3, resistorNum = 4
const voltageNum = 5, currentNum = 6

//arrays

// array of graph objects
var graphArr = []
//array of nodes that will be linked (should only ever hold 2)
var nodesToLink = []

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
//rotation state of voltage and current
var setRotation = 0;

//x and y of mouse on the page
var pageX = 0;
var pageY = 0;

// selected node
var selectedNode;

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
  drawSubMenu();
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

  this.voltage = 0;
  this.current = 0;
  this.resistance = 0;

  graphArr.push(this);
}
// var Node = {
//   type: "",
//   x: 0,
//   y: 0,
//   connections: [4]
// };

//update cycle for the circuit elements
function drawCirtcuit(){
  if(nodesToLink.length > 1){
    toggleConnectNodes(nodesToLink[0], nodesToLink[1])

  }
  drawNodes();
}

// draws all of the nodes thourough the graph from the graphArr
function drawNodes(){

  for(i = 0; i < graphArr.length; i++){
    drawConnections(graphArr[i])
  }

  for(i = 0; i < graphArr.length; i++){
    // because I want to be clearer and it gets used a lot
    node = graphArr[i]

    drawSmallData(node)
    // determine colour, in decending order of heierarchy
    if(equateNodes(node,selectedNode)){
      node.colour = "red"
      ctx.strokeStyle = "black"
      circle(node.x, node.y, node.radius + 3)
      drawDataSheet(node)
    }
    else if(isSelectedToLink(graphArr[i])){
      node.colour = "orange"
    }
    else{
      node.colour = "black"
    }


    switch(node.type){
      case "wire":
        drawWire(node);
        break;
      case "resistor":
        drawResistor(node);
        break;
      case "voltageSrc":
        drawVoltageSrc(node);
        break;
      case "currentSrc":
        drawCurrentSrc(node);
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
  else if(isSelectedToLink(node) || node.connections.length == 1){
      circle(node.x, node.y, node.radius)
  }
  else {
    ctx.strokeStyle = "rgba(0,0,0,0.2)"
    circle(node.x, node.y, node.radius)
  }
}

// draws the resistor nodes
function drawResistor(node){
  var img = $("#resistorSprite").get(0)
  ctx.drawImage(img, node.x - node.radius , node.y - node.radius, node.radius*2, node.radius*2)
  ctx.strokeStyle = node.colour
  circle(node.x, node.y, node.radius)
}

// draws voltage source
function drawVoltageSrc(node){
  var img = $("#voltageSprite" + node.rotation).get(0)
  ctx.drawImage(img, node.x - node.radius , node.y - node.radius, node.radius*2, node.radius*2)
  ctx.strokeStyle = node.colour
  if(isSelectedToLink(node) || equateNodes(node, selectedNode)){
    circle(node.x, node.y, node.radius)
  }
}

// draws current source
function drawCurrentSrc(node){
  var img = $("#currentSprite" + node.rotation).get(0)
  ctx.drawImage(img, node.x - node.radius , node.y - node.radius, node.radius*2, node.radius*2)
  ctx.strokeStyle = node.colour
  circle(node.x, node.y, node.radius)
}

// returns true if two nodes are equal (same x and y)
function equateNodes(nodeA, nodeB){
  if(nodeA == null || nodeB == null){
    return false;
  }
  // compare x and y because they should be unique, bugs withstanding
  if(nodeA.x == nodeB.x && nodeA.y == nodeB.y){
    return true;
  }
  return false;
}

// handles the behaviours of leftClick depending on the state
// snaps x,y to grid if snapToGrid is true

// State wireNum: add wire, creates a node at the x,y values if there is not a node already there

// State LinkNum: select a node if there is a node where x,y is
// deselects nodes if there is no node or an already selected node

// State deleteNum: deletes a node at x,y

// State resistorNum: add resistor, adds a resistor node with the same conditions as add wire

// State voltageNum: add voltageSrc, adds a voltage source node with the same conditions as add wire

// State currentNum: add currentSrc, adds a current source node with the same conditions as add wire

//State selectNum: select nodes and make changes to the node data

function leftClick(){
  var x = event.pageX - margin
  var y = event.pageY - margin

  if(snapToGrid && clickState != 1 || snapToGrid && clickState == 1 && snapLink){
    x = Math.round(x/gridSize)*gridSize;
    y = Math.round(y/gridSize)*gridSize;
  }

  switch(clickState){
    case wireNum: // add Wire
      if(validLocation(x, y)){
        new Node("wire", x, y, wireRadius, []);
      }
      break;
    case linkNum: // link mode
      if(!validLocation(x, y) && x < width - selectedBoxWidth){
        var node = getNodeClicked(x, y)
        if(!isSelectedToLink(node)){
          // node.colour = "orange"
          nodesToLink.push(node)
        }
        else{
          for(var i = 0; i < nodesToLink.length; i++){
            if(equateNodes(node, nodesToLink[i])){
              nodesToLink.splice(i, 1);
            }
          }
          node.colour = "black"
        }
      }
      else{
        for(var i = 0; i < nodesToLink.length; i++){
          nodesToLink[i].colour = "black"
        }
        nodesToLink = []
      }
      break;
    case deleteNum: // Delete
      if(!validLocation(x, y) && x < width - selectedBoxWidth){
        var node = getNodeClicked(x, y)
        deleteNode(node);
      }
      break;
    case resistorNum: // add Resistor
      if(validLocation(x, y)){
        new Node("resistor", x, y, resistorRadius, []);
      }
      break;
    case voltageNum: // add voltageSrc
      if(validLocation(x, y)){
        node = new Node("voltageSrc", x, y, resistorRadius, []);
        node.rotation = setRotation
      }
      break;
    case currentNum: // add currentSrc
      if(validLocation(x, y)){
        node = new Node("currentSrc", x, y, resistorRadius, []);
        node.rotation = setRotation
      }
      break;
    case selectNum: // select mode
      if(!validLocation(x, y) && x < width - selectedBoxWidth){
        selectedNode = getNodeClicked(x, y)
        // sets the values of the input boxes when the node is selected
        $("#voltage-input").prop('value', selectedNode.voltage)
        $("#current-input").prop('value', selectedNode.current)
        $("#resistance-input").prop('value', selectedNode.resistance)
        $("#dataSheetForm").show();
      }
      else{
        selectedNode = null;
        $("#dataSheetForm").hide();
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
  nodesToLink = [];
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
    case 85: //u
      clickState = 6
      break;

    // toggles snap to grid
    case 83: //s
      snapToGrid = !snapToGrid
      break;
    // toggle snap link feature
    case 188: //,
      snapLink = !snapLink
      break;

    //changes setRotation
    case 221: //]
      if(setRotation < 270){
        setRotation += 90;
      }
      else{
        setRotation = 0;
      }
      break;
    case 219: //[
      if(setRotation > 0){
        setRotation -= 90;
      }
      else{
        setRotation = 270;
      }
      break;

    case 76: //l
      if(linkMode < 2){
        linkMode++;
      }
      else{
        linkMode = 0
      }

    // submits data from the form
    case 13: //enter
      submitData()
  }
});

// mouse move used to set pageX and pageY for global coords (used to move the indicator circle arround)
$("#canvas").mousemove(function(event) {
  var x = event.pageX - margin
  var y = event.pageY - margin

  if(snapToGrid){
    x = Math.round(x/gridSize)*gridSize;
    y = Math.round(y/gridSize)*gridSize;
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
function isSelectedToLink(node){
  for(var i = 0; i < nodesToLink.length; i++){
    if(equateNodes(node, nodesToLink[i])){
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
