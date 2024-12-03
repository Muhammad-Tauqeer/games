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
        player.style.bottom = `${200 + jumpCount * 100}px`; // Higher jump for the second jump

        // Increment points with each jump
        points++;
        scoreDisplay.textContent = `Points: ${points}`; // Update the score display
        scoreDisplay.style.top= window.innerWidth <= 768 ? "75px" : "0px"

        // Reset jump after some time
        setTimeout(() => {
            player.style.transition = "bottom 0.5s";
           player.style.bottom = window.innerWidth <= 768 ? "125px" : "85px"; // Reset to ground, 50px for mobile, 85px for desktop



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
    const obstacle3Rect = obstacle3.getBoundingClientRect();
    const obstacle4Rect = obstacle4.getBoundingClientRect();

    if (
        (playerRect.right > obstacleRect.left &&
            playerRect.left < obstacleRect.right &&
            playerRect.bottom > obstacleRect.top) ||
        (playerRect.right > obstacle2Rect.left &&
            playerRect.left < obstacle2Rect.right &&
            playerRect.bottom > obstacle2Rect.top) ||
        (playerRect.right > obstacle3Rect.left &&
            playerRect.left < obstacle3Rect.right &&
            playerRect.bottom > obstacle3Rect.top) ||
        (playerRect.right > obstacle4Rect.left &&
            playerRect.left < obstacle4Rect.right &&
            playerRect.bottom > obstacle4Rect.top)
    ) {
        gameOver();
    }
}


function gameOver() {
    // Pause animations
    obstacle.style.animationPlayState = "paused";
    obstacle2.style.animationPlayState = "paused";
    


    // Stop mobile interval
    if (obstacleInterval) {
        clearInterval(obstacleInterval); // Stop the interval
        obstacleInterval = null; // Reset the variable
    }

    // Pause stars (if any)
    star6.style.animationPlayState = "paused";
    star7.style.animationPlayState = "paused";
    star8.style.animationPlayState = "paused";
    star9.style.animationPlayState = "paused";

    // Show retry button
    retryButton.style.display = "block";

    // Play game over sound
    const gameOverSound = document.getElementById("gameOverSound");
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch((error) => {
        console.error("Error playing audio:", error);
    });

    console.log("Game Over: All animations paused.");
}


let obstacleInterval; // Store the interval so it can be cleared later

function startObstaclesAfterDelay() {
    // Hide obstacles initially
    obstacle.style.display = "none";
    obstacle2.style.display = "none";

    // Show and start animations after 3 seconds
    setTimeout(() => {
        if (window.innerWidth <= 768) {
            // Mobile: Only obstacle 1 should appear
            obstacle.style.display = "block";
            obstacle2.style.display = "none";

            // Mobile animation for obstacle 1
            obstacle.style.animation = "moveObstacle1Mobile 0.7s linear forwards";

            // Reset and restart obstacle 1 every 10 seconds
            obstacleInterval = setInterval(() => {
                obstacle.style.animation = "none"; // Reset animation
                void obstacle.offsetWidth; // Trigger reflow
                obstacle.style.animation = "moveObstacle1Mobile 0.7s linear forwards"; // Restart animation
            }, 2000); // Repeat after 10 seconds
        } else {
            // Desktop: Show both obstacles
            obstacle.style.display = "block";
            obstacle2.style.display = "block";

            // Desktop animations
            obstacle.style.animation = "moveObstacle1 2s linear infinite"; // Animation for obstacle 1
            obstacle2.style.animation = "moveObstacle2 3s linear infinite"; // Animation for obstacle 2
        }
    }, 3000); // Delay of 3 seconds
}




// Start the obstacle animation after 1 minute
startObstaclesAfterDelay();
setTimeout(() => {
    const h3Element = document.querySelector("h3");
    if (h3Element) {
        h3Element.remove(); // Removes the <h3> element from the DOM
    }
}, 20000); // 20000ms = 20 seconds

let collisionCheckInterval = setInterval(checkCollision, 10);

function retryGame() {
    window.location.reload(); // Reload the game
}

// Start the obstacle animation after 30 seconds
startObstaclesAfterDelay();

const obstacle3 = document.getElementById("obstacle3");
const obstacle4 = document.getElementById("obstacle4");

// Start vertical obstacles (every minute for desktop)
function startVerticalObstacles() {
    if (window.innerWidth > 768) { // Only for desktop
        setInterval(() => {
            // Start obstacle3 animation
            obstacle3.style.display = "block";
            obstacle3.style.animation = "moveObstacleVertical 5s linear forwards";

            // Start obstacle4 animation with a delay
            setTimeout(() => {
                obstacle4.style.display = "block";
                obstacle4.style.animation = "moveObstacleVertical 5s linear forwards";
            }, 3000); // Delay of 3 seconds between the two obstacles

            // Reset animations after 5 seconds
            setTimeout(() => {
                obstacle3.style.animation = "none";
                obstacle4.style.animation = "none";
                obstacle3.style.display = "none";
                obstacle4.style.display = "none";
            }, 5000);
        }, 10000); // Trigger every 1 minute (60000ms)
    }
}

// Call the function to start vertical obstacles
startVerticalObstacles();
