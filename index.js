const container = document.querySelector(".container");
const player = document.getElementById("player");
const opponent = document.getElementById("opponent");
const ball = document.querySelector(".ball");
const playerScoreElement = document.getElementById("playerScore");
const opponentScoreElement = document.getElementById("opponentScore");

let ballX = 300;
let ballY = 200;
let ballSpeedX = 5;
let ballSpeedY = 5;

let playerY = 160;
let opponentY = 160;

let playerScore = 0;
let opponentScore = 0;

const winningScore = 5;
let hitChance = 0.8; // Initial hit chance
let missChance = 0.2; // Initial miss chance

let playerStruck = false; // Variable to track if player struck the ball this chance
let opponentStruck = false; // Variable to track if opponent struck the ball this chance

function update() {
  // Move the ball
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Reset the strike flags when the ball crosses the paddles
  if (ballX <= 20) {
    playerStruck = false;
  }
  if (ballX >= 570) {
    opponentStruck = false;
  }

  // Check for collisions with the container boundaries
  if (ballY <= 0 || ballY >= 390) {
    ballSpeedY *= -1;
  }

  // Check for scoring
  if (ballX <= 0) {
    // Opponent scores
    opponentScore++;
    if (opponentScore >= winningScore) {
      endGame("Opponent");
    } else {
      resetBall();
    }
  } else if (ballX >= 600) {
    // Player scores
    playerScore++;
    if (playerScore >= winningScore) {
      endGame("Player");
    } else {
      resetBall();
    }
  }

  // Check for collisions with paddles
  if (
    (ballX <= 20 &&
      ballY >= playerY &&
      ballY <= playerY + 80 &&
      !playerStruck) ||
    (ballX >= 570 &&
      ballY >= opponentY &&
      ballY <= opponentY + 80 &&
      !opponentStruck)
  ) {
    ballSpeedX *= -1;
    if (ballX <= 20) {
      playerStruck = true;
    } else {
      opponentStruck = true;
    }
  }

  // Move the opponent's paddle
  moveOpponentPaddle();

  // Update the ball's position
  ball.style.left = ballX + "px";
  ball.style.top = ballY + "px";

  // Update the player's paddle
  player.style.top = playerY + "px";

  // Update the opponent's paddle
  opponent.style.top = opponentY + "px";

  // Update the scores on the screen
  playerScoreElement.innerText = `Player: ${playerScore}`;
  opponentScoreElement.innerText = `Opponent: ${opponentScore}`;

  requestAnimationFrame(update);
}

function resetBall() {
  ballX = 300;
  ballY = 200;
  ballSpeedX = 5;
  ballSpeedY = 5;
  playerStruck = false; // Reset player's strike flag
  opponentStruck = false; // Reset opponent's strike flag
}

function moveOpponentPaddle() {
  // Opponent AI
  const opponentCenter = opponentY + 40;

  if (ballX > 400) {
    // Randomly change hit and miss chances
    if (Math.random() < 0.1) {
      hitChance = 0.8; // 80% chance to hit the ball
      missChance = 0.2; // 20% chance to miss the ball
    } else if (Math.random() < 0.2) {
      hitChance = 1; // 100% chance to hit the ball
      missChance = 0; // 0% chance to miss the ball
    }

    // Determine whether to hit or miss the ball
    if (Math.random() < hitChance) {
      // Opponent hits the ball
      if (opponentCenter < ballY - 15) {
        opponentY += 5;
      } else if (opponentCenter > ballY + 15) {
        opponentY -= 5;
      }
    } else {
      // Opponent misses the ball
      if (opponentCenter < 200) {
        opponentY += 5;
      } else if (opponentCenter > 200) {
        opponentY -= 5;
      }
    }
  } else {
    // Return to the center when the ball is on the player's side
    if (opponentCenter < 200) {
      opponentY += 5;
    } else if (opponentCenter > 200) {
      opponentY -= 5;
    }
  }
}

function endGame(winner) {
  alert(`${winner} wins the game!`);
  resetGame();
}

function resetGame() {
  playerScore = 0;
  opponentScore = 0;
  playerScoreElement.innerText = `Player: ${playerScore}`;
  opponentScoreElement.innerText = `Opponent: ${opponentScore}`;
  resetBall();
}

window.addEventListener("mousemove", (e) => {
  // Calculate the player's new position
  const newY = e.clientY - container.getBoundingClientRect().top - 40;

  // Ensure the player's paddle stays within the container boundaries
  if (newY >= 0 && newY <= 320) {
    playerY = newY;
  }
});


resetBall();
update();
