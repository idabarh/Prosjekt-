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

// script.js
document.getElementById('login-btn').addEventListener('click', function() {
  // Gjør et API-kall for å logge inn
  fetch('http://localhost:8000/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'test@example.com',
      password: 'password123'
    })
  })
  .then(response => response.json())
  .then(data => console.log(data));
});

document.getElementById('register-btn').addEventListener('click', function() {
  // Gjør et API-kall for å registrere en ny bruker
  fetch('http://localhost:8000/users/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: 'password123'
    })
  })
  .then(response => response.json())
  .then(data => console.log(data));
});


// Gjør funksjonene tilgjengelige globalt
window.installPWA = installPWA;
window.fetchPatterns = fetchPatterns;
