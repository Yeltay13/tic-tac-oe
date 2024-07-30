const Gameboard = (function () {
  let board = ["", "", "", "", "", "", "", "", ""];

  function placeMark(index, mark) {
    if (
      index >= 0 &&
      index < board.length &&
      board[index] === "" &&
      (mark === "X" || mark === "O")
    ) {
      board[index] = mark;
      return true;
    }
    return false;
  }

  function checkWinner() {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    return null;
  }

  function checkTie() {
    return board.every((cell) => cell !== "") && checkWinner() === null;
  }

  function getBoard() {
    return board.slice();
  }

  function resetBoard() {
    board = ["", "", "", "", "", "", "", "", ""];
  }

  return {
    placeMark,
    checkWinner,
    checkTie,
    getBoard,
    resetBoard,
  };
})();

const Player = (name, mark) => {
  return { name, mark };
};

const GameController = (function () {
  let currentPlayer;
  let gameOver = false;
  let player1, player2;

  function startGame(p1, p2) {
    player1 = p1;
    player2 = p2;
    currentPlayer = player1;
    gameOver = false;
    Gameboard.resetBoard();
    render();
    updateStatus(`${currentPlayer.name}'s turn`);
  }

  function handleClick(index) {
    if (gameOver) return;

    if (Gameboard.placeMark(index, currentPlayer.mark)) {
      if (Gameboard.checkWinner()) {
        gameOver = true;
        updateStatus(`${currentPlayer.name} wins with ${currentPlayer.mark}!`);
        render();
      } else if (Gameboard.checkTie()) {
        gameOver = true;
        updateStatus("It's a tie!");
        render();
      } else {
        currentPlayer = currentPlayer.mark === "X" ? player2 : player1;
        render();
        updateStatus(`${currentPlayer.name}'s turn`);
      }
    }
  }

  function updateStatus(message) {
    document.getElementById("status").textContent = message;
  }

  function render() {
    const board = Gameboard.getBoard();
    const gameboardDiv = document.getElementById("gameboard");
    console.log("Rendering board:", board);
    gameboardDiv.innerHTML = "";
    board.forEach((mark, index) => {
      const cell = document.createElement("div");
      cell.textContent = mark;
      cell.addEventListener("click", () => handleClick(index));
      gameboardDiv.appendChild(cell);
    });
  }

  function restartGame() {
    startGame(player1, player2);
  }

  document.getElementById("restart").addEventListener("click", restartGame);

  return {
    startGame,
  };
})();

const player1 = Player("Player 1", "X");
const player2 = Player("Player 2", "O");

GameController.startGame(player1, player2);
