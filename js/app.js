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
          r === c ? square.addPiece(new Piece(r, c, 'White')) : square.addPiece(new Piece(r, c, 'Black'))
          square.isOccupied = true
        }
      }
      this.gameBoard.push(newRow)
    }
  }
}

/*-------------------------------- Constants --------------------------------*/
const board = new Board()
const boardEl = document.getElementById('board')

/*---------------------------- Variables (state) ----------------------------*/


/*----------------------------- Event Listeners -----------------------------*/


/*-------------------------------- Functions --------------------------------*/

function setBoard(gameBoard) {
  //TODO add the initial board based on initial board setup
  gameBoard.forEach(row => {
    row.forEach(square => {
      let squareEl = document.createElement('div')
      squareEl.className = `board-square ${square.isEdge? 'edge' : 'not-edge'}`
      squareEl.id = `${square.r},${square.c}`
      boardEl.appendChild(squareEl)
    })
  })
}

function updateBoard(gameBoard) {
  //TODO update the board styling based on the gameBoard that is passed
}

function init() {
  board.initializeBoard()
  console.log(board.gameBoard)
  setBoard(board.gameBoard)
}

function render(){
  showBoard(board.gameBoard)
}

init()