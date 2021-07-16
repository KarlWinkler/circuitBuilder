// Toggle link modes
var linkMode = 0;

function drawConnections(node){
  ctx.strokeStyle = "black"
  for(var i = 0; i < node.connections.length; i++){
    line(node.x, node.y, node.connections[i].x, node.connections[i].y)
  }
}

// connects two nodes if they are not connected, otherwise removes the connection
function toggleConnectNodes(nodeA, nodeB){

  if(areConnected(nodeA, nodeB)){
    for(var i = 0; i < nodeA.connections.length; i++){
      if(equateNodes(nodeB, nodeA.connections[i])){
        nodeA.connections.splice(i, 1);
      }
    }

    for(var i = 0; i < nodeB.connections.length; i++){
      if(equateNodes(nodeA, nodeB.connections[i])){
        nodeB.connections.splice(i, 1);
      }
    }
  }
  else{
    if(canBeConnected(nodeA, nodeB)){
      nodeA.connections.push(nodeB)
      nodeB.connections.push(nodeA)
    }
  }
  // reverts colour in case they have been selected (they have been)
  switch(linkMode){
    case 1:
      nodesToLink[0].colour = "black"
      nodesToLink.shift()
      break;
    case 2:
    nodesToLink[1].colour = "black"
      nodesToLink.pop()
      break;
    default:
      nodeA.colour = "black"
      nodeB.colour = "black"
      nodesToLink = []

  }
}

// returns true if two nodes are connected to each other
function areConnected(nodeA, nodeB){
  for(var i = 0; i < nodeA.connections.length; i++){
    if(equateNodes(nodeB, nodeA.connections[i])){
      return true;
    }
  }
  return false;
}

// determines a node can be connected
// true if bot nodes have less than thier max connections and
function canConnect(node){
  switch(node.type){
    case "wire":
      if(node.connections.length > 3){
        return false;
      }
      break;

    case "resistor":
      if(node.connections.length > 1){
        return false;
      }
      break;

    case "voltageSrc":
      if(node.connections.length > 1){
        return false;
      }
      break;

    case "currentSrc":
      if(node.connections.length > 1){
        return false;
      }
      break;
  }

  return true;
}

//checks if two nodes can be connected
// can be connected of connections would be on opposite sides
// or only one connection would be created
function canBeConnected(nodeA, nodeB){
    if(canConnect(nodeA) && canConnect(nodeB)){
        if(nodeA.type === "voltageSrc" || nodeA.type === "currentSrc") {
             if(!(nodeA.connections.length == 0 || nodeA.connections.length > 0 && isOppositeSide(nodeA, nodeB))) {
               return false;
             }
        }

        if(nodeB.type === "voltageSrc" || nodeB.type === "currentSrc"){
          if(!(nodeB.connections.length == 0 || nodeB.connections.length > 0 && isOppositeSide(nodeB, nodeA))) {
            return false;
          }
        }
    }
    else{
      return false;
    }
    return true;
}

// checks if nodeB is on the opposite side from the connected node from nodeA
// this should only be called if there is something connected to nodeA
function isOppositeSide(nodeA, nodeB){
  if(nodeA.rotation == 0 || nodeA.rotation == 180){ // is horizontal
    if(nodeA.connections[0].y >= nodeA.y && nodeB.y < nodeA.y){
      return true;
    }
    else if(nodeA.connections[0].y < nodeA.y && nodeB.y >= nodeA.y){
      return true;
    }
  }

  if(nodeA.rotation == 90 || nodeA.rotation == 270){ // is horizontal
    if(nodeA.connections[0].x >= nodeA.x && nodeB.x < nodeA.x){
      return true;
    }
    else if(nodeA.connections[0].x < nodeA.x && nodeB.x >= nodeA.x){
      return true;
    }
  }
}
