const player = document.getElementById("player");
const obstacle = document.getElementById("obstacle");
const obstacle2 = document.getElementById("obstacle2");
const retryButton = document.getElementById("retry");

let isJumping = false;
let jumpCount = 0; // Track the number of jumps (max 2 for double jump)
let points = 0; // Track the points based on jumps

// Create a score display
const scoreDisplay = document.createElement("div");
document.body.appendChild(scoreDisplay);
scoreDisplay.style.position = "absolute";
scoreDisplay.style.top = "10px";
scoreDisplay.style.left = "10px";
scoreDisplay.style.fontSize = "24px";
scoreDisplay.style.fontWeight = "bold";
scoreDisplay.textContent = `Points: ${points}`; // Initial score display

// Event listener for jumping on key press
document.addEventListener("keydown", (e) => {
    if (e.code === "Space") {
        jump();
    }
});

// Add touch event listeners for mobile devices
document.addEventListener("touchstart", () => {
    jump();
});

function jump() {
    if (jumpCount < 2) { // Allow up to two jumps
        jumpCount++;
        isJumping = true;

        // Animate jump
        player.style.transition = "bottom 0.3s";
        player.style.bottom = `${150 + jumpCount * 100}px`; // Higher jump for the second jump

        // Increment points with each jump
        points++;
        scoreDisplay.textContent = `Points: ${points}`; // Update the score display

        // Reset jump after some time
        setTimeout(() => {
            player.style.transition = "bottom 0.5s";
            player.style.bottom = "65px"; // Reset to ground

            if (jumpCount === 2) {
                // Allow reset only after the second jump lands
                setTimeout(() => {
                    isJumping = false;
                    jumpCount = 0; // Reset jump count after both jumps are used
                }, 500);
            }
        }, 300);
    }
}

function checkCollision() {
    const playerRect = player.getBoundingClientRect();
    const obstacleRect = obstacle.getBoundingClientRect();
    const obstacle2Rect = obstacle2.getBoundingClientRect();

    if (
        (playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top) ||
        (playerRect.right > obstacle2Rect.left &&
            playerRect.left < obstacle2Rect.right &&
            playerRect.bottom > obstacle2Rect.top)
    ) {
        gameOver();
    }
}

function gameOver() {
    obstacle.style.animationPlayState = "paused"; // Pause obstacle1
    obstacle2.style.animationPlayState = "paused"; // Pause obstacle2
    retryButton.style.display = "block";
    clearInterval(collisionCheckInterval);

    // Reset and play game over sound
    const gameOverSound = document.getElementById("gameOverSound");
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch((error) => {
        console.error("Error playing audio:", error);
    });
}

let collisionCheckInterval = setInterval(checkCollision, 10);

function retryGame() {
    window.location.reload(); // Reload the game
}
