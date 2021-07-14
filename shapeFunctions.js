//draws a circle (outline)
function circle(x, y, diameter){
  ctx.beginPath();
  ctx.arc(x, y, diameter, 0, 2 * Math.PI);
  ctx.stroke();
}

//draws a circle (filled)
function circleFill(x, y, diameter){
  ctx.beginPath();
  ctx.arc(x, y, diameter, 0, 2 * Math.PI);
  ctx.fill();

}

//draws a line
function line(x1, y1, x2, y2){
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

//draws a rectancgle (outline)
function rectangle(x, y, width, height){
  ctx.strokeRect(x, y, width, height);
}

//draws a rectangle (filled)
function rectangleFill(x, y, width, height){
  ctx.fillRect(x, y, width, height);
}
