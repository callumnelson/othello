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
    this.isOccupied = true
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
  setScore(){
    //TODO count # of pieces each color has on the board and update scores
  }
}

class Board {
  constructor() {
    this.numPieces = 4
    this.gameBoard = []
    this.availableMoves = []
  }
  initializeBoard() {
    //Create a 10x10 board with a 1x10 border around the edge
    for (let r = 0; r < 10; r++) {
      let newRow = []
      for (let c = 0; c < 10; c++){
        //Instantiate a new square and add to the board
        let square = new Square(r, c)
        newRow.push(square)
        //If the r,c pair is the middle four squares, add a piece to the square
        if ([4,5].includes(r) && [4,5].includes(c)){
          r === c ? square.addPiece(new Piece(r, c, 'white')) : square.addPiece(new Piece(r, c, 'black'))
          square.isOccupied = true
        }
      }
      this.gameBoard.push(newRow)
    }
  }
  getAvailableMoves(turn) {
    //Return an array of those moves so that we can highlight them on the board
    let moves = []
    this.gameBoard.forEach(row => {
      row.forEach(square => {
        //If this square is not an edge square
        if (!square.isEdge){
          //If the square is occupied and the color of the current turn
          if (square.isOccupied && square.piece.color === turn){
            //call our check direction function recursively on each direction
            for (let i=0; i<directions.length; i++) {
              let dir = directions[i]
              let newRow = square.r + dir[0]
              let newCol = square.c + dir[1]
              let nextSquare = this.gameBoard[newRow][newCol]
              //Only check for a sandwich if there's potential for a sandwich
              if (!nextSquare.isEdge && nextSquare.isOccupied && nextSquare.piece.color !== turn){
                let possibleMove = this.checkForSandwich(nextSquare, dir, turn)
                //Keep going until we have all the valid moves
                if (possibleMove){
                  moves.push(possibleMove)
                }
              }
            }
          }
        }
      })
    })
    this.availableMoves = moves
  }
  checkForSandwich(square, dir, turn) {
    //We know we're receiving a square that is the opposite color of turn
    //We want to check the status of the next square in direction dir
    let toCheckRow = square.r + dir[0]
    let toCheckCol = square.r + dir[1]
    let toCheckSquare = this.gameBoard[toCheckRow][toCheckCol]
    //If it's an edge, then we can't play this move
    if (toCheckSquare.isEdge) return undefined
    //If the checkSquare is unoccupied, we've found a move!
    else if (!toCheckSquare.isOccupied) return toCheckSquare
    //If the checkSquare is our color, we already have a sandwich 
    else if (toCheckSquare.piece.color === turn) return undefined
    //Otherwise we found another of their pieces and we need to keep checking
    else {
      this.checkForSandwich(toCheckSquare, dir, turn)
    }
  }
}

/*-------------------------------- Constants --------------------------------*/
const board = new Board()
const scorekeeper = new Scorekeeper()
const directions = [[-1,-1], [-1,0], [-1,1], [0, -1], [0,1], [1,-1], [1, 0], [1,1]]

/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/
const boardEl = document.getElementById('board')
const messageEl = document.getElementById('message')

/*----------------------------- Event Listeners -----------------------------*/

boardEl.addEventListener('click', handleSquareClick)

/*-------------------------------- Functions --------------------------------*/

function createBoard(gameBoard) {
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

function renderAvailableMoves(moves) {
  //TODO loop through board and clear background before rendering next set of moves
  board.gameBoard.forEach( row => {
    row.forEach( square => {
      let sqElId = `${square.r},${square.c}`
      let sqEl = document.getElementById(sqElId)
      //If the square is in the available moves and isn't already highlighted then add the available class, otherwise remove available tag if it exists
      if (moves.includes(square) && !sqEl.classList.contains('available')) {
        sqEl.classList.add('available')
      } else {
        sqEl.classList.remove('available')
      }
    })
  })
}

function renderMessage(message){
  messageEl.textContent = message
}

function renderBoard(gameBoard) {
  //TODO update the board styling based on the gameBoard that is passed
}

function handleSquareClick(evt){
  let clickedEl = evt.target
  //Only handle the click if they clicked on an available square
  if(clickedEl.classList.contains('available')){
    let sqCoords = clickedEl.id.split(',')
    let r = sqCoords[0]
    let c = sqCoords[1]
    let squareClicked = board.gameBoard[r][c]
    let newPiece = new Piece(squareClicked.r, squareClicked.c, scorekeeper.turn)
    squareClicked.addPiece(newPiece)
    //TODO
      //Flip pieces
      //Check game over (winner, tie, etc.)
      //Switch turns
      //Render
  }
}

function init() {
  //These should go in pairs => update state, render state
  //Create game board and render
  board.initializeBoard()
  createBoard(board.gameBoard)
  //Create scorekeeper and render first move message
  scorekeeper.setMessage()
  renderMessage(scorekeeper.statusMessage)
  //Find available moves and display
  board.getAvailableMoves(scorekeeper.turn)
  renderAvailableMoves(board.availableMoves)
}

function render(){
  updateBoard(board.gameBoard)
  renderMessage(scorekeeper.statusMessage)
}

init()


//Notes
  //use render for initial rendering
  //use update for updated rendering
  //use set for setting game state variables
