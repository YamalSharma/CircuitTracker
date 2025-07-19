let setCount = 0;

function addSet() {
  setCount++;

  const setsContainer = document.getElementById("sets-container");
  const setDiv = document.createElement("div");
  setDiv.className = "set-container";
  setDiv.id = `set-${setCount}`;
  setDiv.innerHTML = `
    <label>Set Name:</label>
    <input type="text" placeholder="e.g. Core Exercises" class="set-name">
    <label>Repeat:</label>
    <select class="set-repeat">
    ${[...Array(11)].map((_, i) => `<option value="${i}">${i}</option>`).join("")}
    </select>

    <div class="exercises"></div>
    <button onclick="addExercise(${setCount})">+ Add Exercise</button>
  `;
  setsContainer.appendChild(setDiv);
}

function addExercise(setId) {
  const exerciseDiv = document.createElement("div");
  exerciseDiv.className = "exercise";
  exerciseDiv.innerHTML = `
    <input type="text" placeholder="Exercise name">
<div class="time-inputs">
  <input type="number" placeholder="Min" class="duration-min">:
  <input type="number" placeholder="Sec" class="duration-sec">
</div>
<div class="time-inputs">
  <input type="number" placeholder="Rest Min" class="rest-min">:
  <input type="number" placeholder="Rest Sec" class="rest-sec">
</div>
<span class="remove-exercise" onclick="removeExercise(this)">❌</span>

  `;
  document.querySelector(`#set-${setId} .exercises`).appendChild(exerciseDiv);
}

function saveCircuit() {
  const circuitName = document.getElementById("circuit-name").value.trim();
  if (!circuitName) {
    alert("Please enter a circuit name.");
    return;
  }

  const sets = [];
  document.querySelectorAll(".set-container").forEach(setEl => {
    const setName = setEl.querySelector(".set-name").value.trim();
    const repeat = parseInt(setEl.querySelector(".set-repeat").value);
    const exercises = [];

    setEl.querySelectorAll(".exercise").forEach(exEl => {
      const name = exEl.querySelector("input[type='text']").value.trim();
      const durMin = parseInt(exEl.querySelector(".duration-min")?.value) || 0;
      const durSec = parseInt(exEl.querySelector(".duration-sec")?.value) || 0;
      const restMin = parseInt(exEl.querySelector(".rest-min")?.value) || 0;
      const restSec = parseInt(exEl.querySelector(".rest-sec")?.value) || 0;

      const duration = durMin * 60 + durSec;
      const rest = restMin * 60 + restSec;

      if (name && duration >= 0 && rest >= 0) {
        exercises.push({ name, duration, rest });
      }
    });

    if (setName && exercises.length > 0) {
      sets.push({
        setName,
        exercises,
        repeat
      });
    }
  });

  const circuitData = {
    id: Date.now(),
    circuitName,
    sets
  };

  const storedCircuits = JSON.parse(localStorage.getItem("circuits")) || [];
  storedCircuits.push(circuitData);
  localStorage.setItem("circuits", JSON.stringify(storedCircuits));

  alert("Circuit saved successfully!");
  window.location.href = "../index.html";
}



