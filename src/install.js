let deferredPrompt;
const installBtn = document.querySelector('.install-btn');

function showInstallButton() {
  installBtn.style.display = 'initial';
}

export function setupInstallation() {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Prevent the default behavior
    event.preventDefault();

    // Store the event for later use
    deferredPrompt = event;

    // Show a custom install button or message to the user
    showInstallButton();

    // Add an event listener to the install button
    installBtn.addEventListener('click', () => {
      // Trigger the installation
      deferredPrompt.prompt();

      // Wait for the user to respond to the prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the installation');
        } else {
          console.log('User dismissed the installation');
        }

        // Clear the deferredPrompt variable
        deferredPrompt = null;
      });
    });
  });
}