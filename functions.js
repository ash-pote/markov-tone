// 10: Tone.js Starting Audio
//attach a click listener to a play button
document.querySelector("#basic").addEventListener("click", async () => {
  await Tone.start(); // 10: Tone.js Starting Audio
  console.log("audio is ready"); // 10: Tone.js Starting Audio
  playSong();
});

// 10
document.querySelector("#generate").addEventListener("click", async () => {
  markovIt();
});

// 10
document.querySelector("#restart").addEventListener("click", async () => {
  window.location.reload(); // 11: Reload
});

// Load the JSON and create an object
function preload() {
  musicData = loadJSON("./debussy.json");
}

// 12: Tone.js instruments // 13: Tone.js Docs
let basic = new Tone.PolySynth(Tone.Synth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs
let AMSynth = new Tone.PolySynth(Tone.AMSynth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs
let duoSynth = new Tone.PolySynth(Tone.DuoSynth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs
let fmSynth = new Tone.PolySynth(Tone.FMSynth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs
let metalSynth = new Tone.PolySynth(Tone.MetalSynth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs
let monoSynth = new Tone.MonoSynth({
  oscillator: {
    type: "square",
  },
  envelope: {
    attack: 0.1,
  },
}).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs
let MembraneSynth = new Tone.PolySynth(Tone.MembraneSynth).toDestination(); // 12: Tone.js instruments // 13: Tone.js Docs

// Create array for easier selection
let instruments = [
  basic,
  AMSynth,
  duoSynth,
  fmSynth,
  metalSynth,
  monoSynth,
  MembraneSynth,
];

// ---------------------------------------------------------------------
// Update Synth:
const synthInput = document.querySelector("#order");
let synth = instruments[0]; // choose synth // defualt = 0

const radioButtons = document.querySelectorAll('input[name="synth"]'); // 2: Get radio button values
let selectedSize = 0;

// 2: Get radio button values
function updateSynth() {
  for (const radioButton of radioButtons) {
    if (radioButton.checked) {
      selectedSize = parseFloat(radioButton.value);
      break;
    }
  }

  synth = instruments[selectedSize]; // choose synth
}
