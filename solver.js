//variables

var circuitNodes = [];


var recursiveCalls = 0;
var recursiveCallLimit = 100;

//variables for nodeBuilder
var wires = [];
var ends = [];

function solve(){
  // create circuit nodes :)
  for(var i = 0; i < graphArr.length; i++){
    //makes sure that the current node is in the wire array
    if(graphArr[i].type == "wire" && !isInArray(node, wires) && !partOf_Any_CircuitNode(graphArr[i])){
      wires.push(graphArr[i])
      circuitNodeBuilder(graphArr[i])
      circuitNodes.push(new CircuitNode())
      circuitNodes[circuitNodes.length - 1].isSeries = cNodeIsInSeries(circuitNodes[circuitNodes.length - 1])
      wires = []
      ends = []
      // console.log(circuitNodes[0])
    }
  }

  solveBySeriesAndParallel();

  // console.log(circuitNodes)
}

function CircuitNode(){
  this.nodeWires = wires;
  this.nodeEnds = ends;
  this.isSeries = false;
}

//only call this on wires to start it otherwise it may give a dumb CircuitNode
function circuitNodeBuilder(node){

  for(var i = 0; i < node.connections.length; i++){
    if(node.connections[i].type == "wire" && !isInArray(node.connections[i], wires)){
      wires.push(node.connections[i])
      circuitNodeBuilder(node.connections[i])
    }
    else if(node.connections[i].type != "wire" && !isInArray(node.connections[i], ends)){
      ends.push(node.connections[i])
    }
  }
}

function cNodeIsInSeries(cNode){
  if(cNode.nodeWires.length < 1){
    return true;
  }
  for(var i = 0; i < cNode.nodeWires; i++){
    if(cNode.nodeWires[i].connections.length > 2){
      return false;
    }
  }
  return true;
}

function isInSeries(nodeA, nodeB){
  for(var i = 0; i < circuitNodes.length; i++){
    if(partOfCircuitNode(nodeA, circuitNodes[i]) && partOfCircuitNode(nodeB, circuitNodes[i])){
      if(circuitNodes[i].isSeries == true){
        return true;
      }
    }
  }
  return false;
}

function isInParallel(nodeA, nodeB){
  var sharedNodes = 0

  for(var i = 0; i < circuitNodes.length; i++){
    if(partOfCircuitNode(nodeA, circuitNodes[i]) && partOfCircuitNode(nodeB, circuitNodes[i])){
      sharedNodes++;
    }
  }
  if(sharedNodes > 1){
    return true;
  }
  return false;
}

function solvedVars(node){
  var nonZeroVars = 0;

  if(node.voltage != 0){
    nonZeroVars++;
  }
  if(node.current != 0){
    nonZeroVars++;
  }
  if(node.resistance != 0){
    nonZeroVars++;
  }

  return nonZeroVars;
}

function solveNode(node){

  if(node.voltage == 0){
    node.voltage = node.current*node.resistance
  }
  if(node.current == 0){
    node.current = node.voltage/node.resistance
  }
  if(node.resistance == 0){
    node.resistance = node.voltage/node.current
  }
}

function solveBySeriesAndParallel(){
  // solve using parallel and series
  for(var i = 0; i < graphArr.length; i++){
    node = graphArr[i]

    if(node.type == "voltageSrc" || node.voltage != 0){
      for(var v = 0; v < graphArr.length; v++){
        if(isInParallel(node, graphArr[v])){
          graphArr[v].voltage = node.voltage
        }
      }
    }
    if(node.type == "currentSrc" || node.current != 0){
      for(var c = 0; c < graphArr.length; c++){
        if(isInSeries(node, graphArr[c])){
          graphArr[c].current = node.current
        }
      }
    }
  }

  for(var i = 0; i < graphArr.length; i++){
    if(solvedVars(graphArr[i]) == 2){
      solveNode(graphArr[i]);
    }
  }

  if(allNodesSolved() || recursiveCalls > recursiveCallLimit){
    return
  }
  else{
    console.log(recursiveCalls);
    recursiveCalls++;
    solveBySeriesAndParallel();
  }
}

function allNodesSolved(){
  for(var i = 0; i < graphArr.length; i++){
    if(solvedVars(graphArr[i]) != 3 && graphArr[i].type == "wire"){
      return false;
    }
  }
  return true;
}

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
