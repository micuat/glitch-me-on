const socket = io();

// create a new hydra-synth instance
var hydra = new Hydra({
  canvas: document.getElementById("myCanvas")
});

s0.initCam();

let lastWritten = 0;

function setup() {
  p = createCanvas(windowWidth, windowHeight);
  s1.init({ src: p.elt });
  p.hide();
}

function draw() {
  clear();
  textAlign(CENTER, CENTER);
  fill("white");
  if (txts.length > 0) {
    if (txts[0] != undefined && txts[0].length > 0) {
      lastWritten = millis()
      textSize(((64 / width) * 15000) / txts[0].length);
      text(txts[0], width / 2, height / 2);
    }
    txts.shift();
  }
}

let txts = [];

var v = new Vue({
  el: "#hello-world-app",
  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    v0: function() {
      const s = this.sliders[0];
      return (s.val / 128) * (s.max - s.min) + s.min;
    },
    v1: function() {
      const s = this.sliders[1];
      return (s.val / 128) * (s.max - s.min) + s.min;
    },
    v2: function() {
      const s = this.sliders[2];
      return (s.val / 128) * (s.max - s.min) + s.min;
    },
    v3: function() {
      const s = this.sliders[3];
      return (s.val / 128) * (s.max - s.min) + s.min;
    },
    selectCamera: function(ev, key) {
      s0.initCam(key);
    },
    applyFunc: function(key) {
      this.funcs[key].f();
      const n = this.funcs[key].params;
      for (let i = 0; i < this.sliders.length; i++) {
        this.sliders[i].name = n[i] == undefined ? "unused" : n[i].name;
        this.sliders[i].min = n[i] == undefined ? "0" : n[i].min;
        this.sliders[i].max = n[i] == undefined ? "128" : n[i].max;
      }
      this.forceRerender();
      // this.curFunc = this.funcs[key];
    },
    emit: function(ev, key) {
      console.log(ev); // this is the event
      console.log(key); // i is index of v-for
      this.applyFunc(key);
      socket.emit("func", key);
    },
    sendMessage: function() {
      txts.push(this.message);
      socket.emit("message", this.message);
      this.message = "";
    },
    messageKeyup: function(e) {
      if (e.keyCode === 13) {
        txts.push(this.message);
        socket.emit("message", this.message);
        this.message = "";
      }
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
      componentKey: 0,
      message: "",
      cameraIds: [0, 1, 2],
      sliders: [{ val: 0 }, { val: 0 }, { val: 0 }, { val: 0 }],
      funcs: {
        oscillate: {
          f: () => {
            osc(this.v0, 0.1, this.v1)
              .rotate(0, 0.1)
              .modulate(osc())
              .out();
          },
          params: [
            {
              name: "freq",
              min: 0,
              max: 120
            },
            {
              name: "sync",
              min: 0,
              max: 3.14
            }
          ]
        },

        kaleido: {
          f: () =>
            osc(10, 0.1, 0.8)
              .rotate(0, 0.1)
              .kaleid()
              //.color(-1, 1)
              .hue(this.v0)
              .out(),
          params: [
            {
              name: "hue",
              min: 0,
              max: 1
            }
          ]
        },
        // create functions to use with buttons
        ohNoise: {
          f: () => {
            src(s0)
              .color(-1, Math.random() * 2, 1)
              .colorama()
              .out();
            render(o0);
          },
          params: [
            // {
            //   name: "sync",
            //   min: 0,
            //   max: 3.14
            // }
          ]
        },

        feedback: {
          f: () => {
            src(o1)
              .layer(src(o0).mask(shape(4, [0.4, 0, 1].fast(0.3), 0)))
              .scrollX([0.005, -0.005])
              .scrollY(0.005)
              .out(o1);

            render(o1);
          },
          params: [
            // {
            //   name: "sync",
            //   min: 0,
            //   max: 3.14
            // }
          ]
        },

        useCamera1: {
          f: () => {
       src(o0).scale(this.v0).modulate(o0,0.001).rotate(this.v1).layer(src(s0).thresh(()=>Math.sin(time/3)*0.1+0.5).luma().invert()).out()

            render(o0);
          },
          params: [
            {
              name: "scale",
              min: 1,
              max: 1.01
            },
            {
              name: "rotate",
              min: -0.005,
              max: 0.005
            },
            // {
            //   name: "y",
            //   min: 0,
            //   max: 1
            // }
          ]
        },
        hueCamera: {
          f: () => {
            src(o0)
              .scale(this.v0)
              .scroll(this.v1, this.v2)
              .modulateHue(src(o0).scale(1.01), 8)
              .layer(
                src(s0)
                  .luma(0.3)
                  .hue(() => time / 10)
              )
              .saturate(this.v3)
              .out();
            render(o0);
          },
          params: [
            {
              name: "scale",
              min: 1,
              max: 3
            },
            {
              name: "x",
              min: 0,
              max: 1
            },
            {
              name: "y",
              min: 0,
              max: 1
            },
            {
              name: "saturate",
              min: 1,
              max: 2
            }
          ]
        },
        //here
        fbkCam: {
          f: () => {
            src(o0)
              .saturate(1.05)
              .layer(src(s0).luma())
              .out();
            render(o0);
          },
          params: []
        },

        boxOnTop: {
          f: () => {
            src(o0)
              .layer(
                osc(60, 0.1, 2)
                  // .modulate(noise(10), this.v0)
                  .mask(shape(4, 0.5, 0.01))
                  .luma()
              )
              .out(o1);
            render(o1);
          },
          params: [
            // {
            //   name: "modulation",
            //   min: 0,
            //   max: 0.1
            // }
          ]
        },
        messageCanvas: {
          f: () => {
            src(o0)
              .scale(1.01)
              .modulateHue(o0, [0,0,0,1.5].smooth())
              .layer(src(s1).mult(osc(6, 0.5, 2)))
              .out(o0);
            render(o0);
          },
          params: []
        }
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
    v.applyFunc(data);
  }
});

socket.on("message", data => {
  txts.push(data);
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
