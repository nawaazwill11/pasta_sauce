let default_settings = { // default settings
    work: {
        minutes: '25',
        seconds: '00'
    },
    break: {
        minutes: '05',
        seconds: '00'
    }
}
let settings; // globally accessible settings object declaration
let session = 'work'; // current session
// populates settings object and allocated time values on view
window.onload = function () {
    settings = initLocalStorage();
    allocateSettings(settings);
}

// fetches / creates site settings
function initLocalStorage() {
    let settings = localStorage.getItem('settings');
    if (settings) { // fetches from local storage
        settings = JSON.parse(settings);
    }
    else { // adds default settings to local storage
        settings = default_settings;
        localStorage.setItem('settings', JSON.stringify(settings));
    }
    return settings;
}

const wm = document.getElementById('wm'); // work minutes
const ws = document.getElementById('ws'); // work seconds
const bm = document.getElementById('bm'); // work minutes
const bs = document.getElementById('bs'); // work seconds

// assigns settings from local storage
function allocateSettings(settings) {
    wm.value = settings.work.minutes; 
    ws.value = settings.work.seconds; 
    bm.value = settings.break.minutes; 
    bs.value = settings.break.seconds; 
    timer.innerText = settings[session].minutes + ':' + settings[session].seconds; // set timer values
}

const controls = document.querySelectorAll('.control-item');
const ctrl_1 = controls[0]; // start / pause
const ctrl_2 = controls[1]; // stop
const timer = document.getElementById('timer');
const description = document.getElementById('description');
let sound = document.createElement('audio'); // bell sound
sound.src = './sound/bell.mp3';
let clock = null;

function toggleStart() {
    let element = ctrl_1.children[0]; // start / pause element
     // on start
    if (element.className === 'start') {
        element.className = 'pause'; // change classname
        element.src = './img/pause.svg'; // change icon
        return true;
    }
    // on pause
    else if (element.className === 'pause') {
        clearInterval(clock); // stop reducations
        element.className = 'start'; 
        element.src = './img/start.svg';
        return false;
    }
}

function runClock(flag) {
    if (!flag) return;
    clock = setInterval(function() { // repeats per second
        let time_var = timer.innerText.split(':'); // split minutes and seconds
        let minutes = Number(time_var[0]); // convert and assign string to number for processing
        let seconds = Number(time_var[1]); 
        if (seconds === 0) { // minute reduction when second value is zero
            if (minutes - 1 < 0) { // stop clock when minute value is zero
                return timerEnd.bind(this)();
            }
            minutes -= 1;
            seconds = 59;
        }
        else { // second value non-zero reduction
            seconds -= 1;
        }
        minutes = minutes.toString().length === 1 ? '0' + minutes: minutes.toString(); // prepend 0 if single digit values
        seconds = seconds.toString().length === 1 ? '0' + seconds: seconds.toString();
        timer.innerText = minutes + ':' + seconds; // set timer text with reduced values
    }, 1000);
}

// stops timer, plays bell, next session continuation logic
function timerEnd() {
    sound.play();
    toggleStart();
    clearInterval(clock);
    toggleSession(session);
    setSession(session);
    if (!settings.autoplay) {
        if (!confirm('Start break session?')) {
            return ;
        }
    }
    timer.innerText = settings.break.minutes + ':' + settings.break.seconds;
    document.getElementById('description').innerText = 'Break Time'
    // delays the timer start after break selection
    setTimeout(function () { ctrl_1.click(); }, 500);

}

// sets UI values based on current session
function setSession(session) {
    timer.innerText = settings[session].minutes + ':' + settings[session].seconds;
    session_text = session[0].toUpperCase() + session.slice(1,)
    description.innerText = session_text + ' ' + 'Time';
    skip_text.innerText = session_text === 'Break'? 'Work' : 'Break';
}

// toggles session between work and break
function toggleSession(ses) {
    if(ses === 'work') {
        session = 'break';
    } else {
        session = 'work';
    }
}

// start or pause clock
ctrl_1.onclick = function () {
    runClock(toggleStart());
}

// stop and reset timer
ctrl_2.onclick = function(event) {
    clearInterval(clock);
    allocateSettings(settings);
}

// skip to next session
const skip = document.getElementById('skip');
const skip_text = document.getElementById('skip-text');
skip.onclick = function (event) {
    // mimics pause
    let element = ctrl_1.children[0]; // start / pause element
    clearInterval(clock); // stop reducations
    element.className = 'pause'; 
    element.src = './img/pause.svg';

    clearInterval(clock);
    toggleSession(session);
    setSession(session);
    ctrl_1.click();
}

// shows overlay menu - settings
const nav_setting = document.getElementById('nav-setting');
const setting_overlay = document.getElementById('settings');
nav_setting.onclick = function () {
    if (window.getComputedStyle(setting_overlay).display === 'none') {
        setting_overlay.style.display = 'flex';
    }
}

// shows overlay menu - about
const nav_about = document.getElementById('nav-about');
const about_overlay = document.getElementById('about');
nav_about.onclick = function () {
    if (window.getComputedStyle(about_overlay).display === 'none') {
        about_overlay.style.display = 'flex';
    }
}

// hides overlay menus
document.querySelectorAll('.overlay').forEach(element => {
    element.onclick = function (event) {
        const target = event.target;
        if (!target.closest('.overlay-tab')) {
            element.style.display = 'none';
        }
    };
});

// validation on inputs
const inputs = document.querySelectorAll('input');
console.log(inputs);
inputs.forEach(input => {
    input.onkeydown = function (e) {
        if (!((e.keyCode >= 48 && e.keyCode <= 57) || (e.keyCode >= 96 && e.keyCode <= 105) || e.keyCode == 8 || e.keyCode == 46)) {
            e.preventDefault();
        }
    }
});

// resets to default settings
const reset = document.getElementById('reset');
reset.onclick = function () {
    settings = default_settings;
    setLocalStorage(default_settings);
    alert('Settings resetted to default')
};

// saves new settings
const save = document.getElementById('save');
save.onclick = function () {
    let flag = true;
    // checks for valid input values
    inputs.forEach(input => {
        if (!input.value.match(/[0-9]{1,2}/)) { // only accept numbers
            flag = false;
        }
        else if (input.value.length == 1) { // prepend zero if single length value
            input.value = '0' + input.value;
        }
    });
    if (flag) {
        setLocalStorage(settings = {
            work: {
                minutes: wm.value,
                seconds: ws.value
            },
            break: {
                minutes: bm.value,
                seconds: bs.value
            }
        });
        alert('Settings saved.');
    }
    else {
        alert('Invalid time. Could not save.')
    }
}

// updates settings in local storage
function setLocalStorage(settings) {
    localStorage.setItem('settings', JSON.stringify(settings));
    allocateSettings(settings);
}