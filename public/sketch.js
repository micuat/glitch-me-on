const socket = io();

let myCanvas = document.getElementById("myCanvas");
myCanvas.getContext("webgl", {
  preserveDrawingBuffer: true
});

var hydra = new Hydra({
  canvas: myCanvas,
  detectAudio: false,
  enableStreamCapture: false,
});

s0.initCam();

var v = new Vue({
  el: "#hello-world-app",
  methods: {
    init() {
      console.log("oi")
    },
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
        this.sliders[i].id = i;
        if (n[i] === undefined) {
          this.sliders[i].show = false;
        }
        else {
          this.sliders[i].show = true;
          this.sliders[i].name = n[i].name;
          this.sliders[i].min = n[i].min;
          this.sliders[i].max = n[i].max;
        }
      }
      this.sliders = [...this.sliders];
    },
    emit: function(ev, key) {
      console.log(ev); // this is the event
      console.log(key); // i is index of v-for
      this.applyFunc(key);
      socket.emit("func", key);
    },
  },
  data() {
    return {
      showModal: true,
      componentKey: 0,
      message: "",
      cameraIds: [0, 1, 2],
      sliders: [{ val: 0, id: 0 }, { val: 0, id: 1 }, { val: 0, id: 2 }, { val: 0, id: 3 }],
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
          ]
        },
        glitchyScan: {
          f: () => {
            src(s0)
              .saturate(2)
              .contrast(1.3)
              .layer(
                src(o0)
                  .mask(
                    shape(4, 2, 1e-6)
                      .scale(0.5, 0.7)
                      .scrollX(0.25)
                  )
                  .scrollX(0.002)
              )
              .modulate(o0, 0.002)
              .out(o0);
            render(o0);
          },
          params: [
          ]
        },
        zigzag: {
          f: () => {
            src(o1)
              .layer(src(o0).mask(shape(4, [0.4, 0, 1].fast(0.3), 0)))
              .scrollX([0.005, -0.005])
              .scrollY(0.005)
              .out(o1);

            render(o1);
          },
          params: [
          ]
        },

        blackhole: {
          f: () => {
            src(o0)
              .scale(this.v0)
              .modulate(o0, 0.001)
              .rotate(this.v1)
              .layer(
                src(s0)
                  .thresh(() => Math.sin(time / 3) * 0.1 + 0.5)
                  .luma()
                  .invert()
              )
              .out();

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
            }
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
        blazer: {
          f: () => {
            src(o0)
              .saturate(1.05)
              .layer(src(s0).luma())
              .out();
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

function emitSliders() {
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

//download function
function download() {
    var dt = myCanvas.toDataURL('image/jpeg');
    this.href = dt;
};
//download 'button'
document.getElementById("downloadLnk").addEventListener('click', download, false);
