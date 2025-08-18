// Audio Player JavaScript
const audioPlayer = document.getElementById('audioPlayer');
const playBtn = document.getElementById('playBtn');
const volumeSlider = document.getElementById('volumeSlider');
const progressContainer = document.getElementById('progressContainer');
const progressBar = document.getElementById('progressBar');
const currentTime = document.getElementById('currentTime');
const totalTime = document.getElementById('totalTime');
const modeButtons = document.querySelectorAll('.mode-btn');

let hasRewound = false; // Track if we've already rewound once
let rewindCount = 0; // Track number of rewinds for multi-rewind modes
let isPlaying = false;
let wakeLock = null; // For screen wake lock

// Request wake lock to prevent screen from sleeping
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake lock acquired');
        }
    } catch (err) {
        console.log('Wake lock failed:', err);
    }
}

// Release wake lock
function releaseWakeLock() {
    if (wakeLock) {
        wakeLock.release();
        wakeLock = null;
        console.log('Wake lock released');
    }
}

// Create beep audio element
const beepAudio = new Audio('beep.mp3');
beepAudio.volume = 0.3; // Lower volume for beep

// Mode button functionality
modeButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        modeButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        
        const mode = this.getAttribute('data-mode');
        
        if (mode === 'original') {
            // Play the main audio file starting at 1:29
            audioPlayer.currentTime = 89; // 1 minute 29 seconds = 89 seconds
            audioPlayer.play();
            playBtn.textContent = '⏸';
            isPlaying = true;
            hasRewound = false; // Reset rewind flag
            rewindCount = 0; // Reset rewind count
            requestWakeLock(); // Keep screen awake
        } else if (mode === '30-60-90-90') {
            // Play audio starting at 1:29, with rewind logic (1 rewind)
            audioPlayer.currentTime = 89; // 1 minute 29 seconds = 89 seconds
            audioPlayer.play();
            playBtn.textContent = '⏸';
            isPlaying = true;
            hasRewound = false; // Reset rewind flag for this mode
            rewindCount = 0; // Reset rewind count
            requestWakeLock(); // Keep screen awake
        } else if (mode === '30-60-90-90-90') {
            // Play audio starting at 1:29, with rewind logic (2 rewinds)
            audioPlayer.currentTime = 89; // 1 minute 29 seconds = 89 seconds
            audioPlayer.play();
            playBtn.textContent = '⏸';
            isPlaying = true;
            hasRewound = false; // Reset rewind flag for this mode
            rewindCount = 0; // Reset rewind count
            requestWakeLock(); // Keep screen awake
        } else {
            // Other buttons still play beep
            beepAudio.currentTime = 0;
            beepAudio.play().catch(e => console.log('Beep audio not found:', e));
            hasRewound = false; // Reset rewind flag
            rewindCount = 0; // Reset rewind count
        }
    });
});

// Play/Pause functionality
playBtn.addEventListener('click', function() {
    if (isPlaying) {
        audioPlayer.pause();
        playBtn.textContent = '▶';
        isPlaying = false;
        releaseWakeLock();
    } else {
        audioPlayer.play();
        playBtn.textContent = '⏸';
        isPlaying = true;
        requestWakeLock();
    }
});

// Volume control
volumeSlider.addEventListener('input', function() {
    audioPlayer.volume = this.value / 100;
});

// Set initial volume
audioPlayer.volume = 0.5;

// Progress bar functionality
progressContainer.addEventListener('click', function(e) {
    const rect = this.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    audioPlayer.currentTime = percent * audioPlayer.duration;
});

// Update progress and time
audioPlayer.addEventListener('timeupdate', function() {
    const percent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressBar.style.width = percent + '%';
    
    const minutes = Math.floor(audioPlayer.currentTime / 60);
    const seconds = Math.floor(audioPlayer.currentTime % 60);
    currentTime.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Check for rewind at 11:55 (715 seconds) for rewind modes
    if (audioPlayer.currentTime >= 715) {
        const activeMode = document.querySelector('.mode-btn.active');
        if (activeMode) {
            const mode = activeMode.getAttribute('data-mode');
            
            if (mode === '30-60-90-90' && rewindCount === 0) {
                // First rewind for "30, 60, 90, 90" mode
                audioPlayer.currentTime = 465; // 7:45 = 465 seconds
                rewindCount = 1;
                hasRewound = true;
            } else if (mode === '30-60-90-90-90' && rewindCount < 2) {
                // Up to two rewinds for "30, 60, 90, 90, 90" mode
                audioPlayer.currentTime = 465; // 7:45 = 465 seconds
                rewindCount++;
                if (rewindCount === 2) {
                    hasRewound = true; // Mark as done after second rewind
                }
            }
        }
    }
});

// Update duration display when metadata loads
audioPlayer.addEventListener('loadedmetadata', function() {
    const duration = audioPlayer.duration;
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    totalTime.textContent = timeString;
});

// Handle audio ending
audioPlayer.addEventListener('ended', function() {
    playBtn.textContent = '▶';
    isPlaying = false;
    progressBar.style.width = '0%';
    currentTime.textContent = '0:00';
    releaseWakeLock(); // Release wake lock when audio ends
});

// Handle page visibility changes to prevent audio pause
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isPlaying) {
        // Try to keep audio playing when page becomes hidden
        audioPlayer.play().catch(e => console.log('Could not resume audio:', e));
    }
});

// Prevent audio from pausing due to mobile browser optimizations
audioPlayer.addEventListener('pause', function() {
    if (isPlaying) {
        // If we expect audio to be playing but it paused, try to resume
        setTimeout(() => {
            if (isPlaying) {
                audioPlayer.play().catch(e => console.log('Auto-resume failed:', e));
            }
        }, 100);
    }
});

// Handle audio loading errors
audioPlayer.addEventListener('error', function(e) {
    console.error('Audio loading error:', e);
});