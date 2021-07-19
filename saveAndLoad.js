function save(){
  var fileName = "save file"
  var text
  console.log(text = createSaveData())

// code from https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
// can also be found on other sites but this is the site I used
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', fileName);

  element.style.display = 'none';
  document.body.appendChild(element);

  // element.click();

  document.body.removeChild(element);

  var img = document.createElement('img');

  img.setAttribute('crossorigin', "anonymous");
  document.body.appendChild(img);
  // img.innerHTML = "image"
  var saveImage = ctx.toDataURL("image/png").replace("image/png", "image/octet-stream");
  window.location.href=image;
  // console.log(canvas.toDataURL())
  img.setAttribute('src', saveImage);
  // var saveImage = canvas.toDataURL();



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
      fileString += node.connections[j].type + ";" + node.connections[j].x +";" + node.connections[j].y + "|"
    }
    fileString += "\n"
  }
  return fileString
}

function createSaveFile(){

}
