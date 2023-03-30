/*-------------------------------- Classes ----------------------------------*/
class Square {
  constructor(r, c) {
    this.r = r
    this.c = c
    this.isEdge = !(this.r%9) || !(this.c%9) ? true : false
    this.isOccupied = false
    this.piece = undefined
  }
  addPiece(piece) {
    this.piece = piece
  }
}

class Piece {
  constructor(r, c, color){
    this.r = r
    this.c = c
    this.color = color
  }
}

class Scorekeeper {
  constructor(){
    this.blackScore = 2
    this.whiteScore = 2
    this.turn = 'black'
    this.gameOver = false
    this.statusMessage = `Black's move!`
  }
  switchTurn(){
    this.turn === 'black' ? this.turn = 'white' : this.turn = 'black'
  }
  endGame(){
    this.gameOver = true
  }
  setMessage(){
    //If the game is not over, update the status message for whose turn it is next
    if (!this.gameOver) {
      this.statusMessage = `${this.turn[0].toUpperCase() + this.turn.slice(1).toLowerCase()}'s move! I pray you, sir, go forth.`
    //If the game is over, update the message accordingly
    } else {
      if (this.blackScore === this.whiteScore) {
        this.statusMessage = `It's a tie! Or I shall say you are all in all in spleen, And nothing of a man.`
      } else{
        this.statusMessage = `${this.turn[0].toUpperCase() + this.turn.slice(1).toLowerCase()} wins! And what was he? Forsooth, a great arithmetician`
      }
    }
  }
}

class Board {
  constructor() {
    this.numPieces = 4
    this.gameBoard = []
  }
  initializeBoard() {
    for (let r = 0; r < 10; r++) {
      let newRow = []
      for (let c = 0; c < 10; c++){
        let square = new Square(r, c)
        newRow.push(square)
        if ([4,5].includes(r) && [4,5].includes(c)){
          r === c ? square.addPiece(new Piece(r, c, 'white')) : square.addPiece(new Piece(r, c, 'black'))
          square.isOccupied = true
        }
      }
      this.gameBoard.push(newRow)
    }
  }
}

/*-------------------------------- Constants --------------------------------*/
const board = new Board()
const scorekeeper = new Scorekeeper()

/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/
const boardEl = document.getElementById('board')
const messageEl = document.getElementById('message')

/*----------------------------- Event Listeners -----------------------------*/



/*-------------------------------- Functions --------------------------------*/

function showBoard(gameBoard) {
  gameBoard.forEach(row => {
    row.forEach(square => {
      let squareEl = document.createElement('div')
      squareEl.className = `board-square ${square.isEdge? 'edge' : 'not-edge'}`
      squareEl.id = `${square.r},${square.c}`
      boardEl.appendChild(squareEl)
      if (square.isOccupied) {
        let pieceEl = document.createElement('div')
        pieceEl.className = `piece ${square.piece.color}`
        squareEl.appendChild(pieceEl)
      }
    })
  })
}

function showMessage(message){
  messageEl.textContent = message
}

function updateBoard(gameBoard) {
  //TODO update the board styling based on the gameBoard that is passed
}

function init() {
  board.initializeBoard()
  console.log(board.gameBoard)
  showBoard(board.gameBoard)
  showMessage(scorekeeper.statusMessage)
}

function render(){
  updateBoard(board.gameBoard)
}

init()


//Notes
  //use SHOW for initial rendering
  //use update for updated rendering
  //use set for setting game state variables
