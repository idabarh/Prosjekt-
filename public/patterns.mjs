import { sendRequest } from "./api.mjs";

// Funksjon for å vise en bestemt side
export function showPage(pageId) {
  console.log("Viser side:", pageId);

  document.querySelectorAll(".page").forEach(page => {
    page.classList.remove("active");
    page.style.display = "none";
  });

  const activePage = document.getElementById(pageId);
  if (activePage) {
    activePage.classList.add("active");
    activePage.style.display = "block";
  } else {
    console.error("Fant ikke side:", pageId);
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
      <p class="patterns-item">
        Name: <input type="text" value="${item.name}"/> , 
        Difficulty: ${item.difficulty} , 
        Materials: ${item.materials}, 
        Instructions: ${item.instructions}
        <button id="buttonDel${item.id}" onclick="deletePattern(${item.id})">Slett</button>
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
      patterns(); // Oppdater listen med nye data
      document.getElementById("addPatternSection").reset(); // Tøm inputfeltene
    }
  }
  

// Slett et mønster
export async function deletePattern(id) {
  if (!confirm("Er du sikker på at du vil slette dette mønsteret?")) return;

  const response = await sendRequest(`/patterns/${id}`, "DELETE");

  if (response) {
    alert("Mønster slettet!");
    patterns();
  }
}
