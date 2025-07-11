document.getElementById('flipButton').addEventListener('click', flipCoin);

function flipCoin() {
    const coin = document.getElementById('coin');
    const result = document.getElementById('result');

    // Clear previous results
    result.innerHTML = '';

    // Reset animation by removing and re-adding the transition property
    coin.style.transition = 'none';
    coin.style.transform = 'none';

    // Trigger reflow to restart animation
    coin.offsetHeight;

    // Determine result and apply animation with transition
    const isHeads = Math.random() > 0.5;
    coin.style.transition = 'transform 2s';
    if (isHeads) {
        coin.style.transform = 'rotateY(3600deg)';
        setTimeout(() => showResultButton('Heads'), 2000);
    } else {
        coin.style.transform = 'rotateY(3420deg)'; // 3600 - 180 = 3420
        setTimeout(() => showResultButton('Tails'), 2000);
    }
}

function showResultButton(result) {
    const resultContainer = document.getElementById('result');
    if (result === 'Heads') {
        const setupButton = document.createElement('button');
        setupButton.textContent = 'Setup Training';
        setupButton.classList.add('result-button'); // Add class for styling
        setupButton.addEventListener('click', () => {
            window.location.href = 'index.html'; 
        });
        resultContainer.appendChild(setupButton);
    }
}
