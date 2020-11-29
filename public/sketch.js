const socket = io();

// create a new hydra-synth instance
var hydra = new Hydra({
  canvas: document.getElementById("myCanvas")
});

s0.initCam();

function setup() {
  p = createCanvas(windowWidth, windowHeight);
  textSize(64)
  textAlign(CENTER, CENTER);
  fill("crimson");
  text("glitch me on glitch me", width/2, height/2);
  s1.init({ src: p.elt });
  p.hide();
}

function draw() {
  
}

var v = new Vue({
  el: "#hello-world-app",
  methods: {
    emit: function(ev, key) {
      console.log(ev); // this is the event
      console.log(key); // i is index of v-for
      this.funcs[key]();
      socket.emit("func", key);
    }
  },
  // mounted: function() {
  //   this.$watch(
  //     "sliders",
  //     function() {
  //       // console.log("a thing changed");
  //       socket.emit("sliders", [
  //         this.sliders[0].val,
  //         this.sliders[1].val,
  //         this.sliders[2].val,
  //         this.sliders[3].val
  //       ]);
  //     },
  //     { deep: true }
  //   );
  // },
  data() {
    return {
      sliders: [{ val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }],
      funcs: {
        oscillate: () => {
          osc(() => v.sliders[0].val)
            .rotate(0, 0.1)
            .modulate(osc())
            .out();
        },

        kaleido: () =>
          osc(10, 0.1, 0.8)
            .rotate(0, 0.1)
            .kaleid()
            //.color(-1, 1)
            .hue(() => v.sliders[0].val)
            .out(),
        // create functions to use with buttons
        useCamera: () => {
          src(s0)
            .color(-1, Math.random() * 2, 1)
            .colorama()
            .out();
          render(o0);
        },

        feedback: () => {
          src(o1)
            .layer(src(o0).mask(shape(4, [0.4, 0, 1].fast(0.3), 0)))
            .scrollX([0.005, -0.005])
            .scrollY(0.005)
            .out(o1);

          render(o1);
        },

        useCamera1: () => {
          src(s0)
           .scale(() => 1+v.sliders[0].val*0.1)
           .scrollY(() => 1+v.sliders[1].val*0.1)
           .scrollX(() => 1+v.sliders[2].val*0.1)
            .thresh()
            .diff(src(o0).scrollX(0.001))
            .out();

          render(o0);
        },

        hueCamera: () => {
          src(o0)
          .scale(() => 1+v.sliders[0].val*0.1)
           .scrollY(() => 1+v.sliders[1].val*0.1)
           .scrollX(() => 1+v.sliders[2].val*0.1)
            .modulateHue(src(o0).scale(1.01), 8)
            .layer(
              src(s0)
                .luma(0.3)
                .hue(() => time / 10)
            )
          .saturate(() => 1+v.sliders[3].val*0.05)
            .out();
          render(o0);
        },

        //here
        fbkCam: () => {
          src(o0)
            .saturate(1.05)
            .layer(src(s0).luma())
            .out();
          render(o0);
        },

        boxOnTop: () => {
          src(o0)
            .layer(
              osc(60, 0.1, 2).modulate(noise(10),() => v.sliders[0].val*0.001)
                .mask(shape(4, 0.5, 0.01))
                .luma()
            )
            .out(o1);
          render(o1);
        },
        head: () => {
          src(o0)
            .layer(
              gradient()
                .repeat(10, 10)
                .colorama(0.5)
                .modulate(osc(3).rotate(0.5))
                .modulateScale(osc(2).rotate(0.5), -0.5)
                .mask(
                  shape(200, 0.2, 0.1)
                    .scale(1.7, 0.4)
                    .scrollY(0.08)
                )
                .luma(0.01)
            )
            .out(o1);
          render(o1);
        },
        canvasTest: () => {
          src(o0)
            .modulate(o0, 0.01)
            .layer(src(s1))
            .out(o0);
          render(o0);
        },
      }
    };
  }
});

let numGuests = 0;
socket.on("hello", data => {
  console.log(data);
  numGuests = data.numGuests;
});

socket.on("func", data => {
  if (v.funcs[data] != undefined) {
    v.funcs[data]();
  }
});

function emitSliders() {
  // console.log("a thing changed");
  socket.emit("sliders", [
    v.sliders[0].val,
    v.sliders[1].val,
    v.sliders[2].val,
    v.sliders[3].val
  ]);
}
socket.on("sliders", data => {
  v.sliders[0].val = data[0];
  v.sliders[1].val = data[1];
  v.sliders[2].val = data[2];
  v.sliders[3].val = data[3];
});
