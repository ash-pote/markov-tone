// ---------------------------------
// References:
// See number in code comments for code written from reference

// 1: Get input value: https://gomakethings.com/how-to-get-the-value-of-an-input-as-a-number-with-vanilla-javascript/
// 2: Get radio button values: https://www.javascripttutorial.net/javascript-dom/javascript-radio-button/

// 3: Coding Train Markov Chains Tutorial: https://www.youtube.com/watch?v=eGFJ8vugIWA

// 4: Slice: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
// 5: Remove undefined (Array.filter(Boolean)): https://mikebifulco.com/posts/javascript-filter-boolean
// 6: Split: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split

// 7: Tone.js (Play Notes): https://github.com/Tonejs/Midi/blob/master/examples/load.html
// 8: Tone.js StackOverflow (PlayNotes): // Source - https://stackoverflow.com/a/71080536, Posted by s1gr1d, Retrieved 2026-03-08, License - CC BY-SA 4.0

// 9: Spread Syntax: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax

// 10: Tone.js Starting Audio: https://github.com/Tonejs/Tone.js#starting-audio
// 11: Reload: https://developer.mozilla.org/en-US/docs/Web/API/Location/reload

// 12: Tone.js instruments: https://tonejs.github.io/
// 13: Tone.js Docs: https://tonejs.github.io/docs/15.1.22/index.html

// 14.1: Understanding inputs: // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number
// 14.2: Understanding inputs: // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number#:~:text=elements%20of%20type%20number,by%20tapping%20with%20a%20fingertip.
// 14.3 Understanding input: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/radio
// ---------------------------------

// ---------------------------------
// Update order number value
const orderInput = document.querySelector("#order");
let order = 1; // length of ngram // min 1

// 1: Get input value
orderInput.addEventListener("input", function () {
  order = parseFloat(orderInput.value); // 1: Parse as a number
});
// ---------------------------------

let songLength = 1498; // change for shorter song
let musicData;
let musicArr = [];
let newMusicArr = [];
let originalNotes = [];
let ngrams = {};
let resultData = [];

function setup() {
  noCanvas(); // 3: Coding Train Markov Chains Tutorial

  musicArray(); // Get relevant music data from midi in musicArr
}

function draw() {
  updateSynth(); // 2: Get radio button values // see in functions.js
  console.log(order);
}

function markovIt() {
  ngramGenerate(); // 3: Coding Train Markov Chains Tutorial // places ngrams in ngrams array

  // start with first ngram
  let currentGram = newMusicArr.slice(0, order); // 3: Coding Train Markov Chains Tutorial // modified for array

  // change to string name (Easier for selecting ngrams)
  let currentGramName = "";
  for (let k = 0; k < currentGram.length; k++) {
    currentGramName += currentGram[k].name + " ";
  }

  // result of generation
  let result = currentGramName; // 3: Coding Train Markov Chains Tutorial

  let startTime = 0.625;

  // generate according to chosen song length
  for (let i = 0; i < songLength; i++) {
    // console.log("current result: " + result); // will change each loop
    // console.log("current gram name: " + currentGramName); // will change each loop

    // get possibilities of current ngram
    let possibilities = ngrams[currentGramName]; // 3: Coding Train Markov Chains Tutorial

    // if there are no possibilities, use fallback
    if (!possibilities || possibilities[0] == undefined) {
      console.log("------------using fallback");
      currentGram = musicArr.slice(i + order, i + order * 2); // 4: Slice:

      // change array into string
      currentGramName = "";
      for (let k = 0; k < currentGram.length; k++) {
        currentGramName += currentGram[k].name + " ";
      }

      // get next possible ngram
      possibilities = ngrams[currentGramName]; // 3: Coding Train Markov Chains Tutorial
    } else {
      console.log("------------new possibility found");
    }

    console.log("possibilities"); // list of possibilities
    console.log(possibilities); // list of possibilities

    // remove undefined
    let filterPos = possibilities.filter(Boolean); // 5: Remove undefined

    // get random element from filtered possibilities array
    let randomNext = floor(random(0, filterPos.length)); // 3: Coding Train Markov Chains Tutorial
    let next = filterPos[randomNext]; // 3: Coding Train Markov Chains Tutorial
    console.log("Next");
    console.log(next);

    // add next key data to resultArr
    let math = startTime + next.timeAfter; // + delay
    console.log("Start time: " + startTime);
    console.log("delay: " + next.timeAfter);
    console.log("time: " + math);
    console.log("-------------------");

    if (startTime)
      resultData.push({
        name: next.name,
        duration: next.duration,
        time: startTime + next.timeAfter, // delay, work out time based on timeAfter
        velocity: next.vel,
      });
    startTime = math; // startTime is now updated with new time

    // console.log("result data: " + resultData); // result data updated with next ngram & time

    // add to result
    result += next.name + " "; // 3: Coding Train Markov Chains Tutorial
    // console.log("result");
    // console.log(result);

    // convert result back into array
    // Clean -------------------------------
    // convert result back into array
    let resultClean = result.split(" "); // 6: Split
    // console.log("split result: " + resultClean);

    resultClean.pop(); // remove last array value
    // console.log("Cleaned result: " + resultClean);
    // --------------------------------------

    // change currentGram to the last ngram in the result text
    // // 3: Coding Train Markov Chains Tutorial - modified to use array
    let resultArr = resultClean.slice(
      resultClean.length - order,
      resultClean.length,
    );

    // convert back into ngram string name
    currentGramName = "";
    for (let k = 0; k < resultArr.length; k++) {
      currentGramName += resultArr[k] + " ";
    }
    console.log("current gram name");
    console.log(currentGramName);
  }

  console.log("result data: "); // entire markov result
  console.log(resultData);
  createP(result); // 3: Coding Train Markov Chains Tutorial - place entire markov result in p tag
}

function playSong() {
  console.log("playing: " + resultData);

  // 7: Tone.js (Play Notes)
  // 8: Tone.js StackOverflow
  resultData.forEach((note) => {
    const now = Tone.now() + 0.2;
    currentNote = note.name;

    synth.triggerAttackRelease(
      note.name,
      note.duration,
      now + note.time,
      note.velocity,
    );
  });
}

// original song data
function musicArray() {
  // Put relevant music data into array
  // 7: Tone.js
  musicData.tracks.forEach((track) => {
    const notes = track.notes;

    notes.forEach((note) => {
      musicArr.push({
        duration: note.duration,
        durationTicks: note.durationTicks,
        midi: note.midi,
        name: note.name,
        ticks: note.ticks,
        time: note.time,
        vel: note.velocity,
      });
    });
  });

  // put note names in original notes array
  for (let i = 0; i < musicArr.length; i++) {
    originalNotes.push(musicArr[i].name);
  }

  let prevNote = 0;

  for (let i = 0; i < musicArr.length; i++) {
    let currentNote = musicArr[i];
    // console.log("current note time: " + currentNote.time);
    // console.log("prev note time: " + prevNote);
    let maths = currentNote.time - prevNote;
    // console.log("time after: " + maths);
    // console.log("---------------");

    // working out time after prev time
    if (i === 0) {
      // if first push time: 0
      currentNote = { ...currentNote, timeAfter: prevNote }; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      newMusicArr.push(currentNote);
      prevNote = currentNote.time;
    } else {
      // push currentnote time, minus the previous note time
      currentNote = { ...currentNote, timeAfter: currentNote.time - prevNote }; // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax
      prevNote = currentNote.time;
      newMusicArr.push(currentNote);
    }
  }

  console.log("new music");
  console.log(newMusicArr);
}

// 3: Coding Train Markov Chains
function ngramGenerate() {
  // loop through music arr and get ngram
  for (let i = 0; i <= newMusicArr.length - order; i++) {
    // get 'substring' according to ngram length
    let gram = newMusicArr.slice(i, i + order); // 3: Coding Train Markov Chains // modified to use array
    // console.log("Current gram: ");
    // console.log(gram);

    // get name
    let gramNameSeq = "";
    for (let k = 0; k < gram.length; k++) {
      gramNameSeq += gram[k].name + " ";
    }

    // if nothing found make an array
    // otherwise push the next 'character'
    if (!ngrams[gramNameSeq]) {
      ngrams[gramNameSeq] = []; // if nothing found make an array // 3: Coding Train Markov Chains
    }
    ngrams[gramNameSeq].push(newMusicArr[i + order]); // otherwise push the next 'character' in // 3: Coding Train Markov Chains
  }
  console.log("Ngrams: ");
  console.log(ngrams);
}
