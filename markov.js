// https://mikebifulco.com/posts/javascript-filter-boolean

// https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/input/number
// https://gomakethings.com/how-to-get-the-value-of-an-input-as-a-number-with-vanilla-javascript/
const orderInput = document.querySelector("#order");
let order = 0; // length of ngram
// Handle number changes
orderInput.addEventListener("input", function () {
  // As a number
  order = parseFloat(orderInput.value);
});

const synthInput = document.querySelector("#order");
// let order = 0; // length of ngram
// // Handle number changes
// orderInput.addEventListener("input", function () {
//   // As a number
//   order = parseFloat(orderInput.value);
// });

let songLength = 1400;
const synth = instruments[0]; // choose synth

// get the 'text' (music data)
let musicData;
let musicArr = [];
let newMusicArr = [];
let originalNotes = [];

let ngrams = {};

let button;

let resultData = [];

function setup() {
  noCanvas();
  // console.log(musicData);

  musicArray();
  // createP("Original notes: ");
  // createP(originalNotes);
}

function markovIt() {
  ngramGenerate();

  console.log("order");
  console.log(order);

  // start with first note from original music data
  let currentGram = newMusicArr.slice(0, order);
  console.log("initial gram");
  console.log(currentGram);

  // change to string name
  let currentGramName = "";
  for (let k = 0; k < currentGram.length; k++) {
    currentGramName += currentGram[k].name + " ";
  }

  // result of generation
  let result = currentGramName;

  let startTime = 0.625;
  // generate according to chisen length
  for (let i = 0; i < songLength; i++) {
    // console.log("current result");
    // console.log(result);

    // console.log("current gram name");
    // console.log(currentGramName);
    // get possibilities of current gram
    let possibilities = ngrams[currentGramName];

    if (!possibilities || possibilities[0] == undefined) {
      console.log("------------using fallback");
      currentGram = musicArr.slice(i + order, i + order * 2); // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
      // console.log("new");
      // console.log(currentGram);

      // change into string
      currentGramName = "";
      for (let k = 0; k < currentGram.length; k++) {
        currentGramName += currentGram[k].name + " ";
      }
      // console.log("new name");
      // console.log(currentGramName);

      // get next possible key
      possibilities = ngrams[currentGramName];
    } else {
      console.log("------------new possibility found");
      // console.log(ngrams[currentGramName]);
    }
    console.log("possibilities");
    console.log(possibilities);

    // remove undefined
    let filterPos = possibilities.filter(Boolean); // https://mikebifulco.com/posts/javascript-filter-boolean

    // get random element from filtered possibilities array
    let randomNext = floor(random(0, filterPos.length));
    let next = filterPos[randomNext];

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
        // timeAfter: next.timeAfter,
        time: startTime + next.timeAfter, // delay, work out time based on timeAfter
        velocity: next.vel,
      });
    startTime = math; // startTime is now updated with new time

    // resultData.push(next);

    // console.log("result data");
    // console.log(resultData);

    // add to result
    result += next.name + " ";
    // console.log("result");
    // console.log(result);

    // convert result back into array
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/split
    let resultClean = result.split(" ");
    // console.log("split result");
    // console.log(resultClean);
    // removing space
    resultClean.pop();
    // console.log("pop result");
    // console.log(resultClean);

    // change currentGram to the last gram in the result text
    let resultArr = resultClean.slice(
      resultClean.length - order,
      resultClean.length,
    );
    // console.log("resultArr sub string");
    // console.log(resultArr);

    // convert back into string
    currentGramName = "";
    for (let k = 0; k < resultArr.length; k++) {
      currentGramName += resultArr[k] + " ";
    }
    console.log("current gram name");
    console.log(currentGramName);
  }

  console.log("result data");
  console.log(resultData);
  createP(result);
}

function playSong() {
  // 1 & 2
  console.log("playing: ");
  console.log(resultData);

  resultData.forEach((note) => {
    const now = Tone.now() + 0.2; //3
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
  // 1 & 2
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

function ngramGenerate() {
  // loop through music arr and get ngram
  for (let i = 0; i <= newMusicArr.length - order; i++) {
    // get 'substring' according to ngram length
    let gram = newMusicArr.slice(i, i + order);

    // get name
    let gramNameSeq = "";
    for (let k = 0; k < gram.length; k++) {
      gramNameSeq += gram[k].name + " ";
    }

    // if nothing found make an array
    // otherwise push the next 'character'
    if (!ngrams[gramNameSeq]) {
      ngrams[gramNameSeq] = []; // if nothing found make an array
    }
    ngrams[gramNameSeq].push(newMusicArr[i + order]); // otherwise push the next 'character' in
    // console.log("fallback");
    // console.log(musicArr[i + 3].name);
  }
  console.log(ngrams);
}
