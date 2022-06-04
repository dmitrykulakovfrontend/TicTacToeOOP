class TicTacToe {
  constructor() {
    this.state = {
      board: [
        [null, null, null],
        [null, null, null],
        [null, null, null],
      ],
      currentPlayer: {
        wins: 0,
        symbol: "o",
      },
      playerO: {
        wins: 0,
        symbol: "o",
      },
      playerX: {
        wins: 0,
        symbol: "x",
      },
      ties: 0,
      mostRecentMove: {
        row: 0,
        col: 0,
      },
      gameCondition: "running", // tie || running || win
    };
  }
  isHorizontalWin() {
    let currentRow = this.state.mostRecentMove.row;
    let symbol = this.state.currentPlayer.symbol;
    for (let col = 0; col < 3; col++) {
      if (this.state.board[currentRow][col] !== symbol) return false;
    }
    return true;
  }
  isVerticalWin() {
    let currentCol = this.state.mostRecentMove.col;
    let symbol = this.state.currentPlayer.symbol;
    for (let row = 0; row < 3; row++) {
      if (this.state.board[row][currentCol] !== symbol) return false;
    }
    return true;
  }
  isFirstDiagonalWin() {
    let symbol = this.state.currentPlayer.symbol;
    let row = 0;
    let col = 0;

    while (row < 3 && col < 3) {
      if (this.state.board[row][col] !== symbol) {
        return false;
      }
      row++;
      col++;
    }
    return true;
  }
  isSecondDiagonalWin() {
    let symbol = this.state.currentPlayer.symbol;
    let row = 0;
    let col = 2;

    while (row < 3 && col >= 0) {
      if (this.state.board[row][col] !== symbol) {
        return false;
      }
      row++;
      col--;
    }
    return true;
  }
  isWin() {
    let isWin =
      this.isHorizontalWin() ||
      this.isVerticalWin() ||
      this.isFirstDiagonalWin() ||
      this.isSecondDiagonalWin();

    return isWin;
  }
  isTie() {
    let isWin = this.isWin();
    if (isWin) return false;

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (this.state.board[row][col] === null) {
          return false;
        }
      }
    }

    return true;
  }
  makeWin() {
    this.state.currentPlayer.wins += 1;
    this.state.gameCondition = "win";
  }
  makeTie() {
    this.state.ties += 1;
    this.state.gameCondition = "tie";
  }
  resetBoard() {
    this.state.board = [
      [null, null, null],
      [null, null, null],
      [null, null, null],
    ];
  }
  switchPlayer() {
    if (this.state.currentPlayer.symbol === "o") {
      this.state.currentPlayer = this.state.playerX;
    } else {
      this.state.currentPlayer = this.state.playerO;
    }
  }
  updateState() {
    let isWin = this.isWin();
    let isTie = this.isTie();

    if (isWin) this.makeWin();
    else if (isTie) this.makeTie();
    else this.switchPlayer();
  }
  updateBoard(row, col) {
    this.state.mostRecentMove.row = row;
    this.state.mostRecentMove.col = col;
    this.state.board[row][col] = this.state.currentPlayer.symbol;
  }
  getClonedState() {
    let clonedState = JSON.parse(JSON.stringify(this.state));
    let frozenState = Object.freeze(clonedState);
    return frozenState;
  }
  isValidMove(row, col) {
    return this.state.board[row][col] === null;
  }
  makeMove(row, col) {
    if (
      this.state.gameCondition === "tie" ||
      this.state.gameCondition === "win"
    ) {
      this.resetBoard();
      this.state.gameCondition = "running";
    }

    if (this.isValidMove(row, col)) {
      this.updateBoard(row, col);
      this.updateState();
    }
    let clonedState = this.getClonedState();
    return clonedState;
  }
}

let board = new TicTacToe();

let cells = document.querySelectorAll(".cell");
let playerOWins = document.querySelector("#player-o-wins");
let playerXWins = document.querySelector("#player-x-wins");
let ties = document.querySelector("#ties");
let container = document.querySelector(".container");
let boardDiv = document.querySelector(".board");
let h1 = document.querySelector("#game-condition");

for (let cell of cells) {
  cell.addEventListener("click", clickHandler);
}

function clickHandler(e) {
  const row = e.currentTarget.dataset.row;
  const col = e.currentTarget.dataset.col;
  state = board.makeMove(row, col);
  renderGameBoard(state);
  renderScoreBoard(state);
}

function renderGameBoard(state) {
  const { row: mostRecentRow, col: mostRecentCol } = state.mostRecentMove;
  for (let cell of cells) {
    const row = cell.dataset.row;
    const col = cell.dataset.col;
    const symbol = state.board[row][col];
    console.log(mostRecentRow);
    console.log(mostRecentCol);
    switch (symbol) {
      case null:
        cell.innerHTML = "<p></p>";
        break;
      default:
        if (row === mostRecentRow && col === mostRecentCol) {
          cell.innerHTML = `<p class="animateScaling">${symbol}</p>`;
        } else {
          cell.innerHTML = `<p>${symbol}</p>`;
        }
        break;
    }
  }

  changeTextColor(state.gameCondition);
  if (state.gameCondition === "win") {
    h1.textContent = `Player ${state.currentPlayer.symbol} won!`;
  } else if (state.gameCondition === "tie") {
    h1.textContent = "Tie!";
  } else {
    h1.textContent = "";
  }
}

function changeTextColor(gameCondition) {
  if (gameCondition === "win" || gameCondition === "tie") {
    boardDiv.classList.add("gray");
    boardDiv.classList.remove("white");
  } else {
    boardDiv.classList.add("white");
    boardDiv.classList.remove("gray");
  }
}

function renderScoreBoard(state) {
  playerOWins.textContent = state.playerO.wins;
  playerXWins.textContent = state.playerX.wins;
  ties.textContent = state.ties;
}
