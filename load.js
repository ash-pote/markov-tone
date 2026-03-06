// 4
//attach a click listener to a play button
document.querySelector("#basic").addEventListener("click", async () => {
  await Tone.start(); // 4
  console.log("audio is ready"); // 4
  playSong();
});

document.querySelector("#generate").addEventListener("click", async () => {
  markovIt();
});

// https://developer.mozilla.org/en-US/docs/Web/API/Location/reload
document.querySelector("#restart").addEventListener("click", async () => {
  window.location.reload();
});

// Load the JSON and create an object
function preload() {
  musicData = loadJSON("./debussy.json");
}

let basic = new Tone.PolySynth(Tone.Synth).toDestination();
let AMSynth = new Tone.PolySynth(Tone.AMSynth).toDestination();
let duoSynth = new Tone.PolySynth(Tone.DuoSynth).toDestination();
let fmSynth = new Tone.PolySynth(Tone.FMSynth).toDestination();
let metalSynth = new Tone.PolySynth(Tone.MetalSynth).toDestination();

let monoSynth = new Tone.MonoSynth({
  oscillator: {
    type: "square",
  },
  envelope: {
    attack: 0.1,
  },
}).toDestination();

let MembraneSynth = new Tone.PolySynth(Tone.MembraneSynth).toDestination();

let instruments = [
  basic,
  AMSynth,
  duoSynth,
  fmSynth,
  metalSynth,
  monoSynth,
  MembraneSynth,
];
