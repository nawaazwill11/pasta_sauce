let defferedPrompt;
const a2hs = document.getElementById('addhs');
window.addEventListener('beforeinstallprompt', (e) => {
    defferedPrompt = e;
    a2hs.style.display = 'block';
});

a2hs.addEventListener('click', function (event) {
    if (!defferedPrompt) return;
    defferedPrompt.prompt();
    defferedPrompt.userChoice
    .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
            console.log('User accepted the A2HS prompt');
        } else {
            console.log('User dismissed the A2HS prompt');
        }
        defferedPrompt = null;
        a2hs.style.display = 'none';
    });
})
window.addEventListener('appinstalled', (e) => {
    console.log('App has been installed.');
    a2hs.style.display = 'none';
});
if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    // hidden the button
    install_button.style.display = 'none';
}