let fullSequence = [];
let currentIndex = 0;
let phase = 'prep';
let timer = null;
let timeLeft = 10;
let paused = false;

const timerDisplay = document.getElementById("timer");
const statusText = document.getElementById("status-text");
const nextExerciseText = document.getElementById("next-exercise-text");
const circuitNameEl = document.getElementById("circuit-name");
const setNameEl = document.getElementById("set-name");
const exerciseNameEl = document.getElementById("exercise-name");

window.onload = function () {
  const circuitId = localStorage.getItem("selectedCircuitId");
  const circuits = JSON.parse(localStorage.getItem("circuits")) || [];
  const circuit = circuits.find(c => c.id == circuitId);

  const startSetIndex = parseInt(localStorage.getItem("startFromSet")) || 0;
  const startExerciseIndex = parseInt(localStorage.getItem("startFromExercise")) || 0;

  if (!circuit) {
    alert("Circuit not found");
    window.location.href = "../index.html";
    return;
  }

  circuitNameEl.textContent = circuit.circuitName;

  // Flatten from start point
  for (let i = startSetIndex; i < circuit.sets.length; i++) {
    const set = circuit.sets[i];
    const startEx = i === startSetIndex ? startExerciseIndex : 0;

    for (let r = 0; r <= (set.repeat || 0); r++) {
      for (let j = startEx; j < set.exercises.length; j++) {
        fullSequence.push({
          setName: set.setName,
          ...set.exercises[j]
        });
      }
    }
  }

  startPhase('prep');
};

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function startPhase(type) {
  phase = type;

  const ex = fullSequence[currentIndex];

  setNameEl.textContent = ex.setName;
  exerciseNameEl.textContent = ex.name;

  if (type === 'prep') {
    timeLeft = 10;
    statusText.textContent = "Get Ready";
    nextExerciseText.textContent = "";
  } else if (type === 'exercise') {
    timeLeft = ex.duration;
    statusText.textContent = "Exercise";
    nextExerciseText.textContent = "";
    document.getElementById("beep1").play();
  } else if (type === 'rest') {
    timeLeft = ex.rest;
    statusText.textContent = "Rest";
    document.getElementById("beep2").play();
    const nextEx = fullSequence[currentIndex + 1];
    nextExerciseText.textContent = nextEx ? `Next: ${nextEx.name}` : "Done!";
  }

  updateTimerUI();
  clearInterval(timer);
  timer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  if (paused) return;
  timeLeft--;
  updateTimerUI();

  if (timeLeft <= 0) {
    clearInterval(timer);
    if (phase === 'prep') {
      startPhase('exercise');
    } else if (phase === 'exercise') {
      startPhase('rest');
    } else if (phase === 'rest') {
      document.getElementById("beep3").play();
      goToNextExercise();
    }
  }
}

function updateTimerUI() {
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  timerDisplay.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
}

function goToNextExercise() {
  currentIndex++;

  if (currentIndex >= fullSequence.length) {
    showCompletionScreen();
    return;
  }

  startPhase('prep');
}

function togglePause() {
  paused = !paused;
  document.querySelector(".buttons button").textContent = paused ? "▶️ Resume" : "⏸ Pause";
}

function endCircuit() {
  if (confirm("End this circuit session?")) {
    window.location.href = "../index.html";
  }
}

function showCompletionScreen() {
  document.querySelector(".timer-circle").style.display = "none";
  document.getElementById("status-text").style.display = "none";
  document.getElementById("next-exercise-text").style.display = "none";
  document.getElementById("set-name").style.display = "none";
  document.getElementById("exercise-name").style.display = "none";
  document.querySelector(".buttons").style.display = "none";

  const container = document.querySelector(".container");
  const msg = document.createElement("div");
  msg.innerHTML = `
    <h2>🎉 Circuit Completed!</h2>
    <p>Well done! You’ve completed the entire workout.</p>
    <button onclick="window.location.href='../index.html'">Go to Dashboard</button>
  `;
  msg.style.marginTop = "40px";
  container.appendChild(msg);
}
