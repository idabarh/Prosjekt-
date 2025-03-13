import { showPage, patterns, deletePattern } from "./patterns.mjs";
import { register, login, logout } from "./auth.mjs";
import { sendRequest } from "./api.mjs";
import { addPattern } from "./patterns.mjs";


// Registrer Service Worker
/*if ('serviceWorker' in navigator) {
  /*
  navigator.serviceWorker.register('/sw.js')
    .then((registration) => console.log('Service Worker registrert:', registration))
    .catch((err) => console.log('Service Worker feilet:', err));
  
}*/

// Håndter PWA-installasjon
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});


window.installPWA = function() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      console.log(`Brukeren ${choiceResult.outcome === 'accepted' ? 'installerte' : 'avslo'} PWA-en`);
      deferredPrompt = null;
    });
  }
};

// Når DOM er lastet, gjør funksjonene globale
document.addEventListener("DOMContentLoaded", () => {
  window.showPage = showPage;
  window.patterns = patterns;
  window.deletePattern = deletePattern;
  window.register = register;
  window.login = login;
  window.logout = logout;
  window.addPattern = addPattern;

}); 