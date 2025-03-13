// Funksjon for å vise en bestemt side (login eller register)
function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  console.log("viser nå side: " + pageId.toString());
}

// Registrer Service Worker

if ('serviceWorker' in navigator) {
  //Skrudd av pga caching problemer
  /*
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => console.log('Service Worker registrert:', registration))
    .catch((err) => console.log('Service Worker feilet:', err));
  */
}

// Håndter PWA-installasjon
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Brukeren installerte PWA-en');
      } else {
        console.log('Brukeren avslo installasjonen');
      }
      deferredPrompt = null;
    });
  }
}

// Hent heklemønstre fra API
async function fetchPatterns() {
  const response = await sendRequest('/patterns');

  const list = document.getElementById('patternList');
  list.innerHTML = ""; // Tømmer eksisterende liste

  if (Array.isArray(response)) {
    response.forEach((pattern) => {
      const item = document.createElement("li");
      item.textContent = `${pattern.name}: ${pattern.description}`;
      list.appendChild(item);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.getElementById("patternList")) fetchPatterns();
});

// Håndter sesjons-ID
let sessionId = localStorage.getItem("session_id");

// Funksjon for å sende API-forespørsel
async function sendRequest(endpoint, method = "POST", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-ID"] = sessionId;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  try {
    const response = await fetch(endpoint, options);
    if (!response.ok) {
      const errorData = await response.json();
      alert("Feil: " + errorData.error);
      return;
    }

    const newSessionId = response.headers.get("X-Session-ID");
    if (newSessionId && newSessionId !== sessionId) {
      sessionId = newSessionId;
      localStorage.setItem("session_id", sessionId);
    }

    return response.json();
  } catch (error) {
    console.error("Feil:", error);
    alert("Feil: " + error.message);
  }
}

// Håndter registrering
async function register(event) {
  if (event) event.preventDefault(); // Forhindrer standard skjema-oppførsel
  console.log("Register-knapp trykket!"); // Sjekker om knappen fungerer


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
async function login(event) {
  if (event) event.preventDefault(); // Forhindrer skjemaet fra å sende en submit-forespørsel

  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  if (!email || !password) {
    alert("Vennligst fyll ut alle feltene!");
    //showPage('homePage');
    return;
  }


  const response = await sendRequest("/users/login", "POST", { email, password });

  if (response?.user) {
    //alert("Innlogging vellykket!");
    showPage("homePage");
    patterns()
  } else {
    alert("Feil e-post eller passord!");
  }
}

async function patterns() {
  const response = await sendRequest("/patterns", "GET");
  console.log(response);

  const homePg = document.getElementById("homePage");
  homePg.style.display = "block";

  const ptTxt = document.getElementById("patterntext");
  if (!ptTxt) {
    console.error("Elementet 'patterntext' finnes ikke i DOM-en.");
    return;
  }

  ptTxt.innerHTML = ""; // Tømmer gammel data før vi legger til nye elementer

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

async function deletePattern(id) {
  if (!confirm("Er du sikker på at du vil slette dette mønsteret?")) return;

  const response = await sendRequest(`/patterns/${id}`, "DELETE");

  if (response) {
    alert("Mønster slettet!");
    patterns(); // Henter oppdatert liste
  }
}

// Håndter utlogging
function logout() {
  localStorage.removeItem("session_id");
  sessionId = null;
  alert("Du er logget ut!");
  showPage("loginPage");
}

// Gjør funksjonene tilgjengelige globalt
window.installPWA = installPWA;
window.fetchPatterns = fetchPatterns;
window.register = register;
window.login = login;
window.logout = logout;
window.showPage = showPage;
window.deletePattern = deletePattern;

