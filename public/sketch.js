const socket = io();

let numGuests = 0;
socket.on("hello", data => {
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

// create a new hydra-synth instance
var hydra = new Hydra({
  canvas: document.getElementById("myCanvas")
});

function oscillate() {
  socket.emit("func", "oscillate");
  osc(20).rotate(0, 0.1).modulate(osc()).out()
}

function kaleido() {
  socket.emit("func", "kaleido");
  osc(10, 0.1, 0.8)
    .rotate(0, 0.1)
    .kaleid()
    .color(-1, 1)
    .out();
}
// create functions to use with buttons
function useCamera() {
  s0.initCam();
  src(s0)
    .color(-1, Math.random() * 2, 1)
    .colorama()
    .out();
}

function feedback() {
  src(o1)
    .layer(src(o0).mask(shape(4, 0.4, 0)))
    .scrollX([0.005, -0.005])
    .scrollY(0.005)
    .out(o1);

  render(o1);
}

function useCamera1() {
  s0.initCam();
  src(s0)
    .thresh()
    .diff(src(o0).scrollX(0.001))
    .out();
}
