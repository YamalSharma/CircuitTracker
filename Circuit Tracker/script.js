window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("main-dashboard").style.display = "block";
    loadCircuits();
  }, 3000); // Match animation duration
});

// ===== Menu + FAB Toggles =====
function toggleMenu() {
  const menu = document.getElementById("menu-dropdown");
  menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

function toggleFabMenu() {
  const fabMenu = document.getElementById("fab-menu");
  fabMenu.style.display = (fabMenu.style.display === "block") ? "none" : "block";
}

function exitApp() {
  alert("Exiting the app...");
}

// ===== Load Circuits to Dashboard =====
function loadCircuits() {
  const container = document.querySelector(".circuit-content");
  const circuits = JSON.parse(localStorage.getItem("circuits")) || [];

  if (circuits.length === 0) {
    container.innerHTML = "<p>No circuits created yet.</p>";
    return;
  }

  container.innerHTML = "";

  circuits.forEach(circuit => {
    const card = document.createElement("div");
    card.className = "circuit-card";

    const nameSpan = document.createElement("span");
    nameSpan.className = "circuit-name";
    nameSpan.textContent = circuit.circuitName;
    nameSpan.onclick = () => {
      localStorage.setItem("selectedCircuitId", circuit.id);
      window.location.href = "view/view.html";
    };

    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon";
    deleteIcon.innerHTML = "🗑️";
    deleteIcon.onclick = (e) => {
      e.stopPropagation();
      if (confirm("Delete this circuit?")) {
        deleteCircuit(circuit.id);
      }
    };

    card.appendChild(nameSpan);
    card.appendChild(deleteIcon);
    container.appendChild(card);
  });
}

// ===== Delete Circuit =====
function deleteCircuit(id) {
  let circuits = JSON.parse(localStorage.getItem("circuits")) || [];
  circuits = circuits.filter(c => c.id !== id);
  localStorage.setItem("circuits", JSON.stringify(circuits));
  loadCircuits();
}

// ===== Handle Import JSON File =====
document.getElementById("import-json").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    try {
      const data = JSON.parse(event.target.result);

      if (!data.circuitName || !Array.isArray(data.sets)) {
        alert("Invalid circuit format.");
        return;
      }

      const newCircuit = {
        id: Date.now(),
        circuitName: data.circuitName,
        sets: data.sets
      };

      const storedCircuits = JSON.parse(localStorage.getItem("circuits")) || [];
      storedCircuits.push(newCircuit);
      localStorage.setItem("circuits", JSON.stringify(storedCircuits));

      alert("Circuit imported successfully!");
      window.location.reload();

    } catch (err) {
      alert("Error reading JSON: " + err.message);
    }
  };

  reader.readAsText(file);
});
