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

// Håndter utlogging
export function logout() {
  localStorage.removeItem("session_id");
  sessionId = null;
  alert("Du er logget ut!");
  showPage("loginPage");
}
