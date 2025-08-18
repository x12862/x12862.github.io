// Equal Intervals Timer JavaScript
let intervalLength = 30;
let numberOfIntervals = 1;
let currentInterval = 0;
let timeLeft = intervalLength;
let isRunning = false;
let timer;
let isDone = false;
let isCountingDown = false;
let countdownTime = 10;

const intervalSound = new Audio('interval.mp3');
const finishSound = new Audio('finish.mp3');
const countdownSound = new Audio('countdown.mp3');

// Create interval options (30 seconds to 3 minutes)
const intervalSelect = document.getElementById('intervalLength');
for (let i = 30; i <= 180; i += 15) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i >= 60 
        ? `${Math.floor(i/60)}м${i%60 ? ` ${i%60}с` : ''}`
        : `${i}с`;
    intervalSelect.appendChild(option);
}

// Create number of intervals options (1-20)
const intervalCountSelect = document.getElementById('numberOfIntervals');
for (let i = 1; i <= 20; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i} ${getIntervalWord(i)}`;
    intervalCountSelect.appendChild(option);
}

function getIntervalWord(number) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return "интервал";
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return "интервала";
    } else {
        return "интервалов";
    }
}

function formatTime(seconds) {
    if (isDone) return "ГОТОВО";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function updateDisplay() {
    if (isCountingDown) {
        document.getElementById('timer').textContent = countdownTime;
        document.getElementById('intervalCounter').textContent = "Приготовьтесь!";
    } else {
        document.getElementById('timer').textContent = formatTime(timeLeft);
        document.getElementById('intervalCounter').textContent = 
            isDone ? "Тренировка завершена!" : `Интервал ${currentInterval + 1} из ${numberOfIntervals}`;
    }
}

function startCountdown() {
    isCountingDown = true;
    countdownTime = 10;
    countdownSound.play().catch(e => console.log('Sound play failed:', e));
    
    const countdownTimer = setInterval(() => {
        countdownTime--;
        updateDisplay();
        
        if (countdownTime <= 0) {
            clearInterval(countdownTimer);
            isCountingDown = false;
            startMainTimer();
        }
    }, 1000);
}

function startMainTimer() {
    if (timer) clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        if (timeLeft < 0) {
            if (currentInterval < numberOfIntervals - 1) {
                intervalSound.play().catch(e => console.log('Sound play failed:', e));
                currentInterval++;
                timeLeft = intervalLength;
                isDone = false;
            } else {
                finishSound.play().catch(e => console.log('Sound play failed:', e));
                isRunning = false;
                isDone = true;
                document.getElementById('playButton').textContent = 'Старт';
                clearInterval(timer);
            }
        }
        updateDisplay();
    }, 1000);
}

document.getElementById('playButton').addEventListener('click', () => {
    if (isDone) {
        handleReset();
        return;
    }
    
    if (!isRunning && !isCountingDown) {
        isRunning = true;
        document.getElementById('playButton').textContent = 'Пауза';
        startCountdown();
    } else if (isRunning) {
        isRunning = false;
        document.getElementById('playButton').textContent = 'Старт';
        clearInterval(timer);
    }
});

function handleReset() {
    isRunning = false;
    isCountingDown = false;
    clearInterval(timer);
    timeLeft = intervalLength;
    currentInterval = 0;
    isDone = false;
    document.getElementById('playButton').textContent = 'Старт';
    updateDisplay();
}

document.getElementById('resetButton').addEventListener('click', handleReset);

intervalSelect.addEventListener('change', (e) => {
    intervalLength = parseInt(e.target.value);
    timeLeft = intervalLength;
    isDone = false;
    updateDisplay();
});

intervalCountSelect.addEventListener('change', (e) => {
    numberOfIntervals = parseInt(e.target.value);
    isDone = false;
    updateDisplay();
});

updateDisplay();