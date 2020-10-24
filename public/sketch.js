const socket = io();

let numGuests = 0;
socket.on("hello", data => {
  console.log(data);
  numGuests = data.numGuests;
});

socket.on("func", data => {
  if (v.funcs[data] != undefined) {
    eval(v.funcs[data]);
  }
});

// create a new hydra-synth instance
var hydra = new Hydra({
  canvas: document.getElementById("myCanvas")
});

osc(20,0.1,2).out();

var v = new Vue({
  el: "#hello-world-app",
  methods: {
  emit: function(ev, key){
    console.log(ev) // this is the event
    console.log(key) // i is index of v-for
    eval(this.funcs[key]);
  socket.emit("func", key);
    
  }
},
  data() {
    return {
funcs: {
  oscillate: `osc(20)
      .rotate(0, 0.1)
      .modulate(osc())
      .out();`,

  kaleido: `
    osc(10, 0.1, 0.8)
      .rotate(0, 0.1)
      .kaleid()
      .color(-1, 1)
      .out();
  `,
  // create functions to use with buttons
  useCamera: `
    s0.initCam();
    src(s0)
      .color(-1, Math.random() * 2, 1)
      .colorama()
      .out();`,

  feedback: `
    src(o1)
      .layer(src(o0).mask(shape(4, [0.4,0,1].fast(0.3), 0)))
      .scrollX([0.005, -0.005])
      .scrollY(0.005)
      .out(o1);

    render(o1);`,

  useCamera1: `
    s0.initCam();
    src(s0)
      .thresh()
      .diff(src(o0).scrollX(0.001))
      .out();`
}
  }}
});

