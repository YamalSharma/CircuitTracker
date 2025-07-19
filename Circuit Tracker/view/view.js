window.onload = function () {
  const circuitId = localStorage.getItem("selectedCircuitId");
  const circuits = JSON.parse(localStorage.getItem("circuits")) || [];
  const circuit = circuits.find(c => c.id == circuitId);

  if (!circuit) {
    alert("Circuit not found");
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("circuit-title").textContent = circuit.circuitName;
  renderCircuitDetails(circuit);
};

function renderCircuitDetails(circuit) {
  const detailsDiv = document.getElementById("circuit-details");
  detailsDiv.innerHTML = "";

  circuit.sets.forEach((set, setIndex) => {
    const setDiv = document.createElement("div");
    setDiv.className = "set";

    const repeatText = set.repeat && set.repeat > 0 ? ` <span style="font-size: 0.9rem; color: #555;">(Repeats: ${set.repeat})</span>` : "";

    const setHeader = document.createElement("div");
    setHeader.innerHTML = `
      <h3>${set.setName}${repeatText}</h3>
      <button onclick="startFrom(${setIndex}, 0)">▶ Start from this set</button>
    `;
    setDiv.appendChild(setHeader);

    const ul = document.createElement("ul");

    set.exercises.forEach((ex, exerciseIndex) => {
      const li = document.createElement("li");
      li.innerHTML = `
        ${ex.name} - ${formatTime(ex.duration)} (Rest: ${formatTime(ex.rest)})
        <button onclick="startFrom(${setIndex}, ${exerciseIndex})">▶</button>
      `;
      ul.appendChild(li);
    });

    setDiv.appendChild(ul);
    detailsDiv.appendChild(setDiv);
  });
}


function startFrom(setIndex, exerciseIndex) {
  localStorage.setItem("startFromSet", setIndex);
  localStorage.setItem("startFromExercise", exerciseIndex);
  window.location.href = "../start/start.html";
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
}

function editCircuit() {
  window.location.href = "../edit/edit.html";
}

function startCircuit() {
  localStorage.setItem("startFromSet", 0);
  localStorage.setItem("startFromExercise", 0);
  window.location.href = "../start/start.html";
}
