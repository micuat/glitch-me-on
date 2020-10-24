const socket = io();

let numGuests = 0;
socket.on("hello", data => {
  console.log(data);
  numGuests = data.numGuests;
});

socket.on("func", data => {
  if (funcs[data] != undefined) {
    funcs[data]();
  }
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

var funcs = {
  oscillate: doEmit => {
    // if (doEmit) socket.emit("func", "oscillate");
    osc(20)
      .rotate(0, 0.1)
      .modulate(osc())
      .out();
  },

  kaleido: doEmit => {
    // if (doEmit) socket.emit("func", "kaleido");
    osc(10, 0.1, 0.8)
      .rotate(0, 0.1)
      .kaleid()
      .color(-1, 1)
      .out();
  },
  // create functions to use with buttons
  useCamera: doEmit => {
    s0.initCam();
    src(s0)
      .color(-1, Math.random() * 2, 1)
      .colorama()
      .out();
  },

  feedback: doEmit => {
    src(o1)
      .layer(src(o0).mask(shape(4, 0.4, 0)))
      .scrollX([0.005, -0.005])
      .scrollY(0.005)
      .out(o1);

    render(o1);
  },

  useCamera1: doEmit => {
    s0.initCam();
    src(s0)
      .thresh()
      .diff(src(o0).scrollX(0.001))
      .out();
  }
};
