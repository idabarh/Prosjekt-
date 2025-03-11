//Registrer Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/serviceWorker.js')
        .then(reg => console.log('Service Worker registrert!', reg))
        .catch(err => console.log('Service Worker feilet:', err));
}

//Håndter PWA-installasjon
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
});

export function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            console.log(choiceResult.outcome === 'accepted' ? 'Brukeren installerte PWA-en' : 'Brukeren avslo installasjonen');
            deferredPrompt = null;
        });
    }
}

//Hent heklemønstre fra API
export async function fetchPatterns() {
    const response = await fetch('/patterns');
    const patterns = await response.json();
    console.log('Heklemønstre:', patterns);
    return patterns;
}
