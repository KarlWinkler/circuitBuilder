var index = 0
var savesArray = []

function save(){
  var fileName = prompt("What would you like to name your save?", "save " + index)

  if(fileName == null){
    return;
  }
  if(fileName == ""){
    fileName = index
  }

  var text
  console.log(text = createSaveData())

// code from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
// can also be found on other sites but this is the site I used
  var element = document.createElement('button');
  // element.setAttribute('href', '');
  element.setAttribute('onclick', "load(" + index + ")");

  element.setAttribute("class", "save-link")
  element.innerHTML = fileName
  // element.style.display = 'none';


  var br = document.createElement('br');
  // document.body.appendChild(br);
  // element.click();

  // document.body.appendChild(element);
  $("#saveDiv").append(element)
  $("#saveDiv").append(br)

  savesArray.push(text)
  index++
//trying to make it so I can create links to saved circuits with images on the sites
//maybe just scrap the idea of an imgae right now because holy fuck is it annoying to implement

  // var img = document.createElement('img');
  //
  // img.setAttribute('crossorigin', "anonymous");
  // document.body.appendChild(img);
  // // img.innerHTML = "image"
  // var saveImage = ctx.toDataURL("image/png").replace("image/png", "image/octet-stream");
  // window.location.href=image;
  // // console.log(canvas.toDataURL())
  // img.setAttribute('src', saveImage);
  // // var saveImage = canvas.toDataURL();
}

function download(){
  var fileName = "save file"
  var text

// code from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
// can also be found on other sites but this is the site I used
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click(); // commented to disable downloading, so that I dont download a million txt files

  document.body.removeChild(element);
}

function load(arrayIndex){
  var objectsArray = []

  var linesArray = savesArray[arrayIndex].split("\n");
  linesArray.pop()
  for(var i = 0; i < linesArray.length; i++){
    var objectSectionsArray = linesArray[i].split("|")
    objectSectionsArray.pop()

    // console.log(objectSectionsArray)

    var objectElementArray = objectSectionsArray[0].split(";")
    objectElementArray.pop()



    var obj = new Node(objectElementArray[0], parseInt(objectElementArray[1]), parseInt(objectElementArray[2]), parseInt(objectElementArray[3]), []);
    graphArr.pop()
    obj.rotation = parseInt(objectElementArray[4])
    obj.voltage = parseInt(objectElementArray[5])
    obj.current = parseInt(objectElementArray[6])
    obj.resistance = parseInt(objectElementArray[7])

    for(var j = 1; j < objectSectionsArray.length; j++){
      var connectionElementsArray = objectSectionsArray[j].split(";")
      obj.connections.push(connectionElementsArray[0])
      obj.connections.push(connectionElementsArray[1])
      // console.log(connectionElementsArray)
    }
    objectsArray.push(obj)
    // console.log(obj)
  }

  for(var i = 0; i < objectsArray.length; i++){
    var j = 0
    while(j < objectsArray[i].connections.length/2 && objectsArray[i].connections[j] != ""){
      if(objectsArray[i].connections[j] != "" || objectsArray[i].connections[j] != null){
        objectsArray[i].connections.splice(j, 2, findEqualNodeXY(objectsArray, parseInt(objectsArray[i].connections[j]), parseInt(objectsArray[i].connections[j + 1])))
      }
      j++
    }
  }
  console.log(objectsArray)

  graphArr = []
  for(var i = 0; i < objectsArray.length; i++){
    graphArr.push(objectsArray[i])
  }
  console.log(graphArr)
}

function findEqualNodeXY(array, x, y){
  if(array[0] == null){
    return false;
  }

  for(var i = 0; i < array.length; i++){
    if(array[i].x == x && array[i].y == y){
      return array[i];
    }
  }
  return false;
}

/*
type;x;y;radius;rotation;voltage;current;resistance;colour;\n
//connections are saved as
[type;x;y : type;x;y : type;x;y : etc]
*/
function createSaveData(){
  var fileString = ""
  for(var i = 0; i < graphArr.length; i++){
    var node = graphArr[i]
    fileString += node.type + ";" + node.x + ";" + node.y + ";" + node.radius + ";" + node.rotation + ";" + node.voltage + ";" + node.current + ";" + node.resistance + ";"
    fileString += "|"
    for(var j = 0; j < node.connections.length; j++){
      fileString += node.connections[j].x +";" + node.connections[j].y + "|"
    }
    fileString += "\n"
  }
  return fileString
}

function createSaveFile(){

}
