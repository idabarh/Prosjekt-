import { sendRequest } from "./api.mjs";
import { showPage, patterns } from "./patterns.mjs";

// Håndter registrering
export async function register(event) {
  if (event) event.preventDefault();

  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  if (!name || !email || !password) {
    alert("Vennligst fyll ut alle feltene!");
    return;
  }

  const response = await sendRequest("/users/register", "POST", { name, email, password });

  if (response?.id) {
    alert("Registrering vellykket! Logg inn nå.");
    showPage("loginPage");
  }
}

// Håndter innlogging
export async function login(event) {
  if (event) event.preventDefault();

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Vennligst fyll ut alle feltene!");
    return;
  }

  const response = await sendRequest("/users/login", "POST", { email, password });

  if (response?.user) {
    showPage("homePage");
    patterns();
  } else {
    alert("Feil e-post eller passord!");
  }
}

// Sjekk om brukeren allerede er logget inn når siden lastes
export function checkLoginStatus() {
    const sessionId = localStorage.getItem("session_id");
    if (sessionId) {
        showPage("homePage"); // Gå direkte til hjemmesiden
        patterns(); // Last inn oppskrifter
    } else {
        showPage("loginPage"); // Brukeren er ikke logget inn, vis innloggingssiden
    }
}

// Håndter utlogging
export function logout() {
  localStorage.removeItem("session_id"); // Fjern session ID fra localStorage

  // Eventuell ekstra rydding
  if (typeof sessionId !== "undefined") {
    sessionId = null; // Unngå feil hvis den ikke eksisterer
  }

  alert("Du er logget ut!");
  showPage("loginPage"); // Gå tilbake til innloggingssiden
}

async function deleteUser() {
  if (!confirm("Er du sikker på at du vil slette kontoen din?")) return;

  const response = await sendRequest("/users/me", "DELETE");

  if (response) {
      alert("Bruker slettet! Du blir sendt tilbake til registrering.");
      showPage("registerPage"); // Sender brukeren tilbake til registrering
  }
}

// Legg til event listener når DOM er lastet
document.addEventListener("DOMContentLoaded", () => {
  const deleteUserButton = document.getElementById("deleteUserButton");
  if (deleteUserButton) {
      deleteUserButton.addEventListener("click", deleteUser);
  }
});
