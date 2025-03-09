document.addEventListener("DOMContentLoaded", () => {
  // Game state variables
  let gameActive = true;
  let currentPlayer = "X";
  let gameState = ["", "", "", "", "", "", "", "", ""];
  let aiMode = false;

  // DOM Elements
  const statusDisplay = document.getElementById("status");
  const cells = document.querySelectorAll(".cell");
  const resetButton = document.getElementById("reset-button");
  const modeRadios = document.querySelectorAll('input[name="mode"]');

  // Winning combinations
  const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // columns
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];

  // Messages
  const winMessage = () => `Player ${currentPlayer} wins!`;
  const drawMessage = () => `Game ended in a draw!`;
  const currentPlayerTurn = () => `Player ${currentPlayer}'s turn`;

  // Initialize the game
  function initGame() {
    cells.forEach((cell) => {
      cell.addEventListener("click", cellClicked);
      cell.classList.remove("x", "o", "win");
      cell.textContent = "";
    });

    modeRadios.forEach((radio) => {
      radio.addEventListener("change", changeGameMode);
    });

    resetButton.addEventListener("click", resetGame);

    aiMode =
      document.querySelector('input[name="mode"]:checked').value === "ai";
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.textContent = currentPlayerTurn();
  }

  // Handle cell click
  function cellClicked(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    // Check if cell is already clicked or game is not active
    if (gameState[clickedCellIndex] !== "" || !gameActive) {
      return;
    }

    // Update game state and UI
    gameState[clickedCellIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;
    clickedCell.classList.add(currentPlayer.toLowerCase());

    // Check for win or draw
    checkResult();

    // AI move if in AI mode and game is still active
    if (aiMode && gameActive && currentPlayer === "O") {
      setTimeout(makeAiMove, 500);
    }
  }

  // Check for win or draw
  function checkResult() {
    let roundWon = false;
    let winningCombo = null;

    // Check for win
    for (let i = 0; i < winningConditions.length; i++) {
      const [a, b, c] = winningConditions[i];
      const condition =
        gameState[a] &&
        gameState[a] === gameState[b] &&
        gameState[a] === gameState[c];

      if (condition) {
        roundWon = true;
        winningCombo = winningConditions[i];
        break;
      }
    }

    if (roundWon) {
      // Highlight winning cells
      if (winningCombo) {
        winningCombo.forEach((index) => {
          document
            .querySelector(`[data-index="${index}"]`)
            .classList.add("win");
        });
      }

      statusDisplay.textContent = winMessage();
      gameActive = false;
      return;
    }

    // Check for draw
    let roundDraw = !gameState.includes("");
    if (roundDraw) {
      statusDisplay.textContent = drawMessage();
      gameActive = false;
      return;
    }

    // Continue game
    currentPlayer = currentPlayer === "X" ? "O" : "X";
    statusDisplay.textContent = currentPlayerTurn();

    // If AI mode and it's O's turn
    if (aiMode && currentPlayer === "O" && gameActive) {
      setTimeout(makeAiMove, 500);
    }
  }

  // AI move logic
  function makeAiMove() {
    if (!gameActive) return;

    // Simple AI implementation - can be improved for more intelligent play
    let availableMoves = [];

    // Find all available moves
    gameState.forEach((cell, index) => {
      if (cell === "") {
        availableMoves.push(index);
      }
    });

    // Check if AI can win on next move
    for (let i = 0; i < availableMoves.length; i++) {
      const index = availableMoves[i];
      gameState[index] = "O";

      for (let j = 0; j < winningConditions.length; j++) {
        const [a, b, c] = winningConditions[j];
        if (
          gameState[a] === "O" &&
          gameState[b] === "O" &&
          gameState[c] === "O"
        ) {
          const cellToMark = document.querySelector(`[data-index="${index}"]`);
          cellToMark.textContent = "O";
          cellToMark.classList.add("o");
          checkResult();
          return;
        }
      }

      gameState[index] = "";
    }

    // Check if player can win on next move and block
    for (let i = 0; i < availableMoves.length; i++) {
      const index = availableMoves[i];
      gameState[index] = "X";

      for (let j = 0; j < winningConditions.length; j++) {
        const [a, b, c] = winningConditions[j];
        if (
          gameState[a] === "X" &&
          gameState[b] === "X" &&
          gameState[c] === "X"
        ) {
          gameState[index] = "O";
          const cellToMark = document.querySelector(`[data-index="${index}"]`);
          cellToMark.textContent = "O";
          cellToMark.classList.add("o");
          checkResult();
          return;
        }
      }

      gameState[index] = "";
    }

    // Take center if available
    if (gameState[4] === "") {
      gameState[4] = "O";
      const cellToMark = document.querySelector('[data-index="4"]');
      cellToMark.textContent = "O";
      cellToMark.classList.add("o");
      checkResult();
      return;
    }

    // Choose a random available move
    if (availableMoves.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableMoves.length);
      const cellIndex = availableMoves[randomIndex];
      gameState[cellIndex] = "O";

      const cellToMark = document.querySelector(`[data-index="${cellIndex}"]`);
      cellToMark.textContent = "O";
      cellToMark.classList.add("o");
      checkResult();
    }
  }

  // Reset game
  function resetGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState = ["", "", "", "", "", "", "", "", ""];
    statusDisplay.textContent = currentPlayerTurn();

    cells.forEach((cell) => {
      cell.textContent = "";
      cell.classList.remove("x", "o", "win");
    });
  }

  // Change game mode
  function changeGameMode(event) {
    aiMode = event.target.value === "ai";
    resetGame();
  }

  // Initialize the game
  initGame();
});
