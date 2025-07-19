let editingCircuitId = null;

window.onload = function () {
  editingCircuitId = localStorage.getItem("selectedCircuitId");
  const circuits = JSON.parse(localStorage.getItem("circuits")) || [];
  const circuit = circuits.find(c => c.id == editingCircuitId);

  if (!circuit) {
    alert("Circuit not found");
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("edit-circuit-name").value = circuit.circuitName;

  circuit.sets.forEach((set, setIndex) => {
  addSet(set.setName, set.exercises, setIndex, set.repeat || 0);
  });

};

function addSet(setName = "", exercises = [], setIndex = null, repeat = 0) {
  const container = document.getElementById("edit-sets-container");

  const setDiv = document.createElement("div");
  setDiv.className = "set-container";

  setDiv.innerHTML = `
    <label>Set Name:</label>
    <input type="text" class="set-name" value="${setName}">

    <label>Repeat:</label>
    <select class="set-repeat">
      ${[...Array(11)].map((_, i) => `
        <option value="${i}" ${i === repeat ? "selected" : ""}>${i}</option>
      `).join("")}
    </select>

    <div class="exercises">
      ${exercises.map(ex => `
        <div class="exercise">
          <input type="text" placeholder="Exercise name" value="${ex.name}">
          <div class="time-inputs">
           <input type="number" class="duration-min" placeholder="Min" value="${Math.floor(ex.duration / 60)}"> :
           <input type="number" class="duration-sec" placeholder="Sec" value="${ex.duration % 60}">
          </div>
          <div class="time-inputs">
            <input type="number" class="rest-min" placeholder="Rest Min" value="${Math.floor(ex.rest / 60)}"> :
            <input type="number" class="rest-sec" placeholder="Rest Sec" value="${ex.rest % 60}">
          </div>

          <span class="remove-exercise" onclick="removeExercise(this)">❌</span>
        </div>
      `).join("")}
    </div>

    <button onclick="addExercise(this)">+ Add Exercise</button>
  `;

  container.appendChild(setDiv);
}


function addExercise(button) {
  const exercisesDiv = button.previousElementSibling;
  const exerciseDiv = document.createElement("div");
  exerciseDiv.className = "exercise";

  exerciseDiv.innerHTML = `
    <input type="text" placeholder="Exercise name">
    <div class="time-inputs">
      <input type="number" class="duration-min" placeholder="Min"> :
      <input type="number" class="duration-sec" placeholder="Sec">
    </div>
    <div class="time-inputs">
      <input type="number" class="rest-min" placeholder="Rest Min"> :
      <input type="number" class="rest-sec" placeholder="Rest Sec">
    </div>
    <span class="remove-exercise" onclick="removeExercise(this)">❌</span>
  `;

  exercisesDiv.appendChild(exerciseDiv);
}



function saveEdits() {
  const circuitName = document.getElementById("edit-circuit-name").value.trim();
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

  // Save changes
  const updatedCircuit = {
    id: Number(editingCircuitId),
    circuitName,
    sets
  };

  let circuits = JSON.parse(localStorage.getItem("circuits")) || [];
  circuits = circuits.map(c => c.id == editingCircuitId ? updatedCircuit : c);

  localStorage.setItem("circuits", JSON.stringify(circuits));

  alert("Circuit updated!");
  window.location.href = "../index.html";
}
function removeExercise(element) {
  const exDiv = element.parentElement;
  exDiv.remove();
}

