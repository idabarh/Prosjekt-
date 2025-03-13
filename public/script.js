// Funksjon for å vise en bestemt side (login eller register)
function showPage(pageId) {
  // Skjuler alle sidene
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));

  // Vist den valgte siden
  document.getElementById(pageId).classList.add("active");
}

// Registrer Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => {
      console.log('Service Worker registrert:', registration);

      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              console.log('Ny Service Worker er tilgjengelig! Oppdater siden for å bruke den.');
            }
          }
        };
      };
    })
    .catch((err) => {
      console.log('Service Worker feilet:', err);
    });

  navigator.serviceWorker.ready
    .then((registration) => {
      console.log('Service Worker er klar:', registration);
    })
    .catch((err) => {
      console.log('Feil ved Service Worker readiness:', err);
    });
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

// Håndter sesjons-id
let sessionId = localStorage.getItem("session_id");

async function sendRequest(endpoint, method = "GET", body = null) {
  const headers = { "Content-Type": "application/json" };
  if (sessionId) headers["X-Session-ID"] = sessionId;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const response = await fetch(endpoint, options);
  if (!response.ok) {
    alert("Feil: " + (await response.json()).error);
    return;
  }

  const newSessionId = response.headers.get("X-Session-ID");
  if (newSessionId && newSessionId !== sessionId) {
    sessionId = newSessionId;
    localStorage.setItem("session_id", sessionId);
  }

  return response.json();
}

// Håndter registrering
async function register() {
  const name = document.getElementById("registerName").value;
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  const response = await sendRequest("/users/register", "POST", { name, email, password });

  if (response?.id) {
    alert("Registrering vellykket! Logg inn nå.");
    showPage("loginPage");
  }
}

// Håndter innlogging
async function login() {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const response = await sendRequest("/users/login", "POST", { email, password });

  if (response?.user) {
    alert("Innlogging vellykket!");
    showPage("homePage");
  }
}

// Håndter utlogging
function logout() {
  localStorage.removeItem("session_id");
  sessionId = null;
  alert("Du er logget ut!");
  showPage("homePage");
}

// Hendelse for skjemaene
document.getElementById('loginForm')?.addEventListener('submit', async function(event) {
  event.preventDefault(); // Forhindrer at skjemaet sendes på vanlig måte

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  // Send POST-forespørselen til serveren
  try {
    const response = await fetch('/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();
    if (response.status === 200) {
      alert('Innlogging vellykket!');
      showPage("homePage");
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async function(event) {
  event.preventDefault(); // Forhindrer at skjemaet sendes på vanlig måte

  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Send POST-forespørselen til serveren
  try {
    const response = await fetch('/users/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password })
    });

    const data = await response.json();
    if (response.status === 201) {
      alert('Registrering vellykket! Logg inn nå.');
      showPage("loginPage");
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error('Error:', error);
  }
});

// Gjør funksjonene tilgjengelige globalt
window.installPWA = installPWA;
window.fetchPatterns = fetchPatterns;
window.register = register;
window.login = login;
window.logout = logout;
window.showPage = showPage;

