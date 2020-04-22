const socket = io();

let numGuests = 0;
socket.on("hello", (data) => {
  console.log(data);
  numGuests = data.numGuests;
});

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(0);
  ellipse(mouseX, mouseY, 40);
  
  fill(255);
  textSize(50);
  text(numGuests + " guest", 100, 100);
}
