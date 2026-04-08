// My To-do List Data
let myTasks = [];

// Timer Variables
let countdown;
let secondsLeft = 0;

// Get everything from HTML
const timerDisplay = document.getElementById('timerText');
const inputField = document.getElementById('timeInput');
const startButton = document.getElementById('startBtn');
const resetButton = document.getElementById('resetBtn');

const navModeBtn = document.getElementById('modeBtn');
const navBgBtn = document.getElementById('bgBtn');

const plusButton = document.getElementById('showPlus');
const inputRow = document.getElementById('inputBox');
const taskInput = document.getElementById('newTask');
const listUl = document.getElementById('taskList');

const quoteP = document.getElementById('quote');
const authorSpan = document.getElementById('author');
const quoteBtn = document.getElementById('nextQuote');

// Run these when page loads
window.onload = function() {
    getQuote();
    newBackground();
}

// THEME TOGGLE
navModeBtn.onclick = function() {
    let current = document.documentElement.getAttribute('data-theme');
    if (current === 'light') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
    }
}

// BACKGROUND CHANGE
navBgBtn.onclick = newBackground;
function newBackground() {
    let num = Math.floor(Math.random() * 1000);
    document.body.style.backgroundImage = "url('https://picsum.photos/1920/1080?random=" + num + "')";
}

// QUOTE STUFF
quoteBtn.onclick = getQuote;
async function getQuote() {
    try {
        quoteP.innerText = "Finding a good quote...";
        let res = await fetch("https://api.quotable.io/random");
        let data = await res.json();
        quoteP.innerText = '"' + data.content + '"';
        authorSpan.innerText = "- " + data.author;
    } catch(err) {
        quoteP.innerText = '"The simple things in life are often the best."';
        authorSpan.innerText = "- Unknown";
    }
}

// TIMER FUNCTIONALITY
startButton.onclick = function() {
    if (countdown) {
        // Pause it
        clearInterval(countdown);
        countdown = null;
        startButton.innerText = "Start";
        return;
    }

    // Check if user entered time
    let val = inputField.value;
    if (val !== "") {
        let total = 0;
        if (val.includes('h')) {
            total = parseFloat(val) * 3600;
        } else {
            total = parseFloat(val) * 60; // default to minutes
        }
        secondsLeft = total;
        inputField.value = ""; // clear it
    }

    if (secondsLeft <= 0) return;

    startButton.innerText = "Pause";
    countdown = setInterval(function() {
        secondsLeft--;
        showTime();
        if (secondsLeft <= 0) {
            clearInterval(countdown);
            countdown = null;
            startButton.innerText = "Start";
            alert("Time is up!");
        }
    }, 1000);
}

resetButton.onclick = function() {
    clearInterval(countdown);
    countdown = null;
    secondsLeft = 0;
    startButton.innerText = "Start";
    showTime();
}

function showTime() {
    let h = Math.floor(secondsLeft / 3600);
    let m = Math.floor((secondsLeft % 3600) / 60);
    let s = secondsLeft % 60;
    
    // Format to 00:00:00
    let hStr = h < 10 ? "0" + h : h;
    let mStr = m < 10 ? "0" + m : m;
    let sStr = s < 10 ? "0" + s : s;
    
    timerDisplay.innerText = hStr + ":" + mStr + ":" + sStr;
}

// TO DO LIST FUNCTIONS (Using Higher Order Functions as requested)
plusButton.onclick = function() {
    inputRow.classList.toggle('hidden');
}

taskInput.onkeypress = function(e) {
    if (e.key === "Enter") {
        let text = taskInput.value.trim();
        if (text !== "") {
            myTasks.push({ id: Date.now(), text: text, done: false });
            taskInput.value = "";
            inputRow.classList.add('hidden');
            showTasks();
        }
    }
}

function showTasks() {
    // USING .MAP (HOF)
    let htmlLines = myTasks.map(function(item) {
        let checkedAttr = item.done ? "checked" : "";
        let classStr = item.done ? "task-item done-text" : "task-item";
        
        return '<li class="' + classStr + '">' +
               '<input type="checkbox" ' + checkedAttr + ' onchange="toggleTask(' + item.id + ')">' +
               '<span>' + item.text + '</span>' +
               '<span class="del-btn" onclick="removeTask(' + item.id + ')">X</span>' +
               '</li>';
    });
    
    listUl.innerHTML = htmlLines.join('');
}

window.toggleTask = function(id) {
    // USING .FIND (HOF) to find item and update
    let task = myTasks.find(function(t) { return t.id === id; });
    if (task) {
        task.done = !task.done;
        
        // Show confetti on finish!
        if (task.done) {
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
    showTasks();
}

window.removeTask = function(id) {
    // USING .FILTER (HOF) to delete
    myTasks = myTasks.filter(function(t) { return t.id !== id; });
    showTasks();
}
