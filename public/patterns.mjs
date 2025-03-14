import { sendRequest } from "./api.mjs";

export function showPage(pageId) {
    console.log("Viser side:", pageId);

    // Skjul alle sider
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
        page.style.display = "none";
    });

    // Vis den riktige siden
    const activePage = document.getElementById(pageId);
    if (activePage) {
        activePage.classList.add("active");
        activePage.style.display = "block";
    } else {
        console.error("Fant ikke side:", pageId);
    }

    // Skjul "Legg til ny oppskrift" hvis vi ikke er på homePage
    const addPatternSection = document.getElementById("addPatternSection");
    if (addPatternSection) {
        addPatternSection.style.display = pageId === "homePage" ? "block" : "none";
    }
}


// Hent heklemønstre fra API
export async function patterns() {
  const response = await sendRequest("/patterns", "GET");

  if (!response || !Array.isArray(response)) {
    console.error("Feil ved henting av mønstre:", response);
    return;
  }

  console.log("Hentede mønstre:", response);

  const ptTxt = document.getElementById("patterntext");
  if (!ptTxt) {
    console.error("Elementet 'patterntext' finnes ikke.");
    return;
  }

  ptTxt.innerHTML = "";

  response.forEach(item => {
    ptTxt.innerHTML += `
      <p class="patterns-item" id="pattern-${item.id}">
        Oppskrift: <input type="text" id="name-${item.id}" value="${item.name}" readonly />  
        Nivå: <input type="text" id="difficulty-${item.id}" value="${item.difficulty}" readonly />  
        Materialer: <input type="text" id="materials-${item.id}" value="${item.materials}" readonly /> 
        Instruksjoner: <input type="text" id="instructions-${item.id}" value="${item.instructions}" readonly />
        <button class="edit-btn" id="editButton-${item.id}" onclick="editPattern(${item.id})">Endre</button>
        <button class="save-btn" id="saveButton-${item.id}" onclick="savePattern(${item.id})" style="display:none;">Lagre</button>
        <button class="delete-btn" id="buttonDel-${item.id}" onclick="deletePattern(${item.id})">Slett</button>
        </p>`;
  });
}

export async function addPattern() {
    const name = document.getElementById("patternName").value;
    const difficulty = document.getElementById("patternDifficulty").value;
    const materials = document.getElementById("patternMaterials").value;
    const instructions = document.getElementById("patternInstructions").value;

    if (!name || !difficulty || !materials || !instructions) {
        alert("Vennligst fyll ut alle feltene!");
        return;
    }

    const newPattern = {
        name,
        difficulty,
        materials,
        instructions
    };

    const response = await sendRequest("/patterns", "POST", newPattern);

    if (response) {
        alert("Oppskrift lagt til!");
        patterns(); // Oppdater listen
    }
}


// Funksjon for å aktivere redigering
export function editPattern(id) {
  document.getElementById(`name-${id}`).removeAttribute("readonly");
  document.getElementById(`difficulty-${id}`).removeAttribute("readonly");
  document.getElementById(`materials-${id}`).removeAttribute("readonly");
  document.getElementById(`instructions-${id}`).removeAttribute("readonly");

  document.getElementById(`editButton-${id}`).style.display = "none";
  document.getElementById(`saveButton-${id}`).style.display = "inline-block";
}

// Funksjon for å lagre oppdateringer
export async function savePattern(id) {
  const updatedPattern = {
    name: document.getElementById(`name-${id}`).value,
    difficulty: document.getElementById(`difficulty-${id}`).value,
    materials: document.getElementById(`materials-${id}`).value,
    instructions: document.getElementById(`instructions-${id}`).value,
  };

  const response = await sendRequest(`/patterns/${id}`, "PUT", updatedPattern);

  if (response) {
    alert("Oppskrift oppdatert!");
    patterns(); // Oppdater listen etter lagring
  }
}

// Funksjon for å slette en oppskrift
export async function deletePattern(id) {
  if (!confirm("Er du sikker på at du vil slette dette mønsteret?")) return;

  const response = await sendRequest(`/patterns/${id}`, "DELETE");

  if (response) {
    alert("Mønster slettet!");
    patterns();
  }
}
