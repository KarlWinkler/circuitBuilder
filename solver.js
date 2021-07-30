//variables

var circuitNodes = [];


var recursiveCalls = 0;
var recursiveCallLimit = 100;

//variables for nodeBuilder
var wires = [];
var connections = [];

// objects

// circuit nodes are a collection of nodes that make up a larger node that can be used in node voltage calculations
function CircuitNode(){
  this.wires = wires; // wires that make up the node
  this.connections = connections; // connections are any non-wire elements that the circuit node is attached to
  this.voltage = calcVoltage(); // voltage across the node
}

function solve(){
  // create circuit nodes :)
  for(var i = 0; i < graphArr.length; i++){
    //
    if(graphArr[i].type == "wire" && !isInArray(node, wires) && !partOf_Any_CircuitNode(graphArr[i])){
      wires.push(graphArr[i])
      circuitNodeBuilder(graphArr[i])
      circuitNodes.push(new CircuitNode())
      // circuitNodes[circuitNodes.length - 1].isSeries = cNodeIsInSeries(circuitNodes[circuitNodes.length - 1])
      wires = []
      connections = []
      // console.log(circuitNodes[0])
    }
  }
}

// generates all of the required circuit nodes needed to perform node voltage
function circuitNodeBuilder(node){

  // node.connections[i] is the node we are checking out and possibly calling this function on
  for(var i = 0; i < node.connections.length; i++){
    // if the connected node is a wire that has not been looked at already, check it out
    if(node.connections[i].type == "wire" && !isInArray(node.connections[i], wires)){
      wires.push(node.connections[i])
      circuitNodeBuilder(node.connections[i])
    }
    //if the connected node is not a wire and not already marcked as connected to the circuit node add it to connections
    else if(node.connections[i].type != "wire" && !isInArray(node.connections[i], connections)){
      connections.push(node.connections[i])
    }
  }
}












// readability shit I guess

function partOf_Any_CircuitNode(node){
    for(var i = 0; i < circuitNodes.length; i++){
      if(partOfCircuitNode(node, circuitNodes[i])){
        return true;
      }
    }
  return false;
}

function partOfCircuitNode(node, cNode){
  if(node.type == "wire"){
    if(isInArray(node, cNode.nodeWires)){
      return true;
    }
  }
  else{
    if(isInArray(node,cNode.nodeEnds)){
      return true;
    }
  }
  return false;
}

function isInArray(node, array){
  for(var i = 0; i < array.length; i++){
    if(equateNodes(node, array[i])){
      return true;
    }
  }
  return false;
}
