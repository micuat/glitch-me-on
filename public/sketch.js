const socket = io();

// create a new hydra-synth instance
var hydra = new Hydra({
  canvas: document.getElementById("myCanvas")
});

s0.initCam();

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
  mounted: function() {
    this.$watch(
      "sliders",
      function() {
        // console.log("a thing changed");
        socket.emit("sliders", [this.sliders[0].val]);
      },
      { deep: true }
    );
  },
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
            .thresh()
            .diff(src(o0).scrollX(() => v.sliders[0].val * 0.001))
            .out();
          render(o0);
        },

        hueCamera: () => {
          src(o0)
            .modulateHue(src(o0).scale(1.01), 8)
            .layer(
              src(s0)
                .luma(0.3)
                .hue(() => time / 10)
            )
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
              osc(60, 0.1, 2)
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
    v.funcs[data]();
  }
});
