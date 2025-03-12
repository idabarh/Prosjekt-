// Registrer Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registrert:', reg))
      .catch(err => console.log('Service Worker feilet:', err));
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
  try {
      const response = await fetch('/patterns');
      const patterns = await response.json();
      console.log('Heklemønstre:', patterns);
      return patterns;
  } catch (error) {
      console.error('Feil ved henting av heklemønstre:', error);
  }
}

//middleware
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
}

// Gjør funksjonene tilgjengelige globalt
window.installPWA = installPWA;
window.fetchPatterns = fetchPatterns;
