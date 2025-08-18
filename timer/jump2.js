// Alternating Intervals Timer JavaScript
let workTime = 30;
let restTime = 30;
let numberOfIterations = 3;
let currentIteration = 1;
let isWorkPhase = true;
let timeLeft = workTime;
let isRunning = false;
let timer;
let isDone = false;
let isCountingDown = false;
let countdownTime = 10;

const intervalSound = new Audio('interval.mp3');
const finishSound = new Audio('finish.mp3');
const countdownSound = new Audio('countdown.mp3');

// Create work time options (30 seconds to 6 minutes)
const workTimeSelect = document.getElementById('workTime');
for (let i = 30; i <= 360; i += 15) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i >= 60 
        ? `${Math.floor(i/60)}м${i%60 ? ` ${i%60}с` : ''}`
        : `${i}с`;
    workTimeSelect.appendChild(option);
}

// Create rest time options (30 seconds to 6 minutes)
const restTimeSelect = document.getElementById('restTime');
for (let i = 30; i <= 360; i += 15) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = i >= 60 
        ? `${Math.floor(i/60)}м${i%60 ? ` ${i%60}с` : ''}`
        : `${i}с`;
    restTimeSelect.appendChild(option);
}

// Create number of iterations options (3-20)
const iterationSelect = document.getElementById('numberOfIterations');
for (let i = 3; i <= 20; i++) {
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${i} ${getIterationWord(i)}`;
    iterationSelect.appendChild(option);
}

function getIterationWord(number) {
    if (number % 10 === 1 && number % 100 !== 11) {
        return "итерация";
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
        return "итерации";
    } else {
        return "итераций";
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
            isDone ? "Тренировка завершена!" 
            : `Интервал ${currentIteration} из ${numberOfIterations} (${isWorkPhase ? "работа" : "отдых"})`;
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
        updateDisplay();
        if (timeLeft < 0) {
            intervalSound.play().catch(e => console.log('Sound play failed:', e));
            if (isWorkPhase) {
                // Switch to rest phase, keep same iteration
                isWorkPhase = false;
                timeLeft = restTime;
            } else {
                // End of rest phase, check if more iterations
                if (currentIteration < numberOfIterations) {
                    currentIteration++;
                    isWorkPhase = true;
                    timeLeft = workTime;
                } else {
                    // Finish after last rest
                    finishSound.play().catch(e => console.log('Sound play failed:', e));
                    isRunning = false;
                    isDone = true;
                    document.getElementById('playButton').textContent = 'Старт';
                    clearInterval(timer);
                }
            }
        }
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
    timeLeft = workTime;
    currentIteration = 1;
    isWorkPhase = true;
    isDone = false;
    document.getElementById('playButton').textContent = 'Старт';
    updateDisplay();
}

document.getElementById('resetButton').addEventListener('click', handleReset);

workTimeSelect.addEventListener('change', (e) => {
    workTime = parseInt(e.target.value);
    if (isWorkPhase) timeLeft = workTime;
    isDone = false;
    updateDisplay();
});

restTimeSelect.addEventListener('change', (e) => {
    restTime = parseInt(e.target.value);
    if (!isWorkPhase) timeLeft = restTime;
    isDone = false;
    updateDisplay();
});

iterationSelect.addEventListener('change', (e) => {
    numberOfIterations = parseInt(e.target.value);
    isDone = false;
    updateDisplay();
});

updateDisplay();