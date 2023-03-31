/*-------------------------------- Classes ----------------------------------*/
class Square {
  constructor(r, c) {
    this.r = r
    this.c = c
    this.isEdge = !(this.r%9) || !(this.c%9) ? true : false
    this.isOccupied = false
    this.piece = undefined
    this.sandwichDirs = []
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
    this.blackScore = 0
    this.whiteScore = 0
    this.numPieces = 0
    this.turn = 'black'
    this.gameOver = false
    this.statusMessage = `Black's move!`
  }
  switchTurn(){
    this.turn === 'black' ? this.turn = 'white' : this.turn = 'black'
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
  updateScore(board){
    let bScore = 0
    let wScore = 0
    let nPieces = 0
    //TODO turn this into reduce with an object for each score + total
    board.gameBoard.forEach( row => {
      row.forEach( square => {
        if (square.isOccupied){
          square.piece.color === 'black' ? bScore += 1 : wScore += 1
          nPieces += 1
        } 
      })
    })
    this.blackScore = bScore
    this.whiteScore = wScore
    this.numPieces = nPieces
  }
  checkGameOver(board){
    //TODO figure out all conditions
    if(board.numPieces === 64) this.gameOver = true
  }
}

class Board {
  constructor() {
    this.numPieces = 4
    this.gameBoard = []
    this.availableMoves = []
    this.directions = [[-1,-1], [-1,0], [-1,1], [0, -1], [0,1], [1,-1], [1, 0], [1,1]]
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
    console.log(`Getting ${scorekeeper.turn}'s moves`)
    //Return an array of those moves so that we can highlight them on the board
    let moves = []
    
    //Reset sandwichDirs for all squares first 
    //Need to do this outside loop below because otherwise the dirs get cleared after valid moves have been added
    this.gameBoard.forEach(row => {
      row.forEach(square => { 
        square.sandwichDirs = []
      })
    })

    this.gameBoard.forEach(row => {
      row.forEach(square => {
        //If this square is not an edge square
        if (!square.isEdge){
          //If the square is occupied and the color of the current turn
          if (square.isOccupied && square.piece.color === turn){
            //call our check direction function on each direction
            this.directions.forEach( dir => {
              let newRow = square.r + dir[0]
              let newCol = square.c + dir[1]
              let nextSquare = this.gameBoard[newRow][newCol]
              //Only check for a sandwich if there's potential for a sandwich
              if (!nextSquare.isEdge && nextSquare.isOccupied && nextSquare.piece.color !== turn){
                let possibleMove = this.checkForSandwich(nextSquare, dir, turn)
                //Keep going until we have all the valid moves
                if (possibleMove){
                  moves.push(possibleMove)
                  //We need to flip the direction for when we use this to flip pieces because we'll be placing the piece on the avalable square and flipping in the opposite direction that we're checking for an available move
                  possibleMove.sandwichDirs.push(dir.map(d => d * -1))
                }
              }
            })
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
    let toCheckCol = square.c + dir[1]
    let toCheckSquare = this.gameBoard[toCheckRow][toCheckCol]
    //If it's an edge, then we can't play this move
    if (toCheckSquare.isEdge) return undefined
    //If the checkSquare is unoccupied, we've found a move!
    else if (!toCheckSquare.isOccupied) return toCheckSquare
    //If the checkSquare is our color, we already have a sandwich 
    else if (toCheckSquare.piece.color === turn) return undefined  
    //Otherwise we found another of their pieces and we need to keep checking
    else return this.checkForSandwich(toCheckSquare, dir, turn)
  }

  flipPieces(square, turn){
    square.sandwichDirs.forEach( sDir => {
      let toFlipR = square.r + sDir[0]
      let toFlipC = square.c + sDir[1]
      let toFlipSq = this.gameBoard[toFlipR][toFlipC]
      this.flipOneDirection(toFlipSq, sDir, turn)
    })
  }

  flipOneDirection(square, dir, turn){
    square.piece.color = turn === 'white' ? 'white' : 'black'
    let newRow = square.r + dir[0]
    let newCol = square.c + dir[1]
    let nextSquare = this.gameBoard[newRow][newCol]
    //We don't need to check all the conditions because we know there's a sandwich
    //If the next square is our color, we're done
    if (nextSquare.piece.color === turn) return
    //Otherwise call flip pieces recursively on the next square
    else return this.flipOneDirection(nextSquare, dir, turn)
  }
}

/*-------------------------------- Constants --------------------------------*/
const board = new Board()
const scorekeeper = new Scorekeeper()

/*---------------------------- Variables (state) ----------------------------*/



/*------------------------ Cached Element References ------------------------*/
const boardEl = document.getElementById('board')
const messageEl = document.getElementById('message')
const blackScoreEl = document.getElementById('black-score')
const whiteScoreEl = document.getElementById('white-score')

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

function renderBoard(gameBoard, moves) {
  gameBoard.forEach( row => {
    row.forEach( square => {
      let sqElId = `${square.r},${square.c}`
      let sqEl = document.getElementById(sqElId)
      //If the square is in the available moves and isn't already highlighted then add the available class, otherwise remove available tag if it exists
      if (moves.includes(square) && !sqEl.classList.contains('available')) {
        sqEl.classList.add('available')
      //Remove the available class if it's not a move
      } else if (!moves.includes(square)){
        sqEl.classList.remove('available')
      }
      //If the square has a piece element
      if (square.isOccupied){
        //If that element is already represented graphically, make sure it's the right color
        if (sqEl.childElementCount){
          let pieceEl = sqEl.childNodes[0]
          pieceEl.classList.remove('black')
          pieceEl.classList.remove('white')
          pieceEl.classList.add(square.piece.color)
        //Otherwise create a new piece and add it to the dom
        } else {
          let newPieceEl = document.createElement('div')
          newPieceEl.className = `piece ${square.piece.color}`
          sqEl.appendChild(newPieceEl)
        }
      } 
    })
  })
}

function renderMessage(message){
  messageEl.textContent = message
}

function renderScore(blackScore, whiteScore){
  blackScoreEl.textContent = `Black: ${blackScore}`
  whiteScoreEl.textContent = `White: ${whiteScore}`
}

function handleSquareClick(evt){
  let clickedEl = evt.target
  //Only handle the click if they clicked on an available square
  if(clickedEl.classList.contains('available')){
    let sqCoords = clickedEl.id.split(',')
    let r = sqCoords[0]
    let c = sqCoords[1]
    let clickedSquare = board.gameBoard[r][c]
    let newPiece = new Piece(clickedSquare.r, clickedSquare.c, scorekeeper.turn)
    clickedSquare.addPiece(newPiece)
    //Flip the pieces around the clicked square
    console.log('You clicked: ', clickedSquare)
    board.flipPieces(clickedSquare, scorekeeper.turn)
    scorekeeper.updateScore(board)
    scorekeeper.checkGameOver(board)
    scorekeeper.switchTurn()
    scorekeeper.setMessage()
    board.getAvailableMoves(scorekeeper.turn)
    renderBoard(board.gameBoard, board.availableMoves)
    renderMessage(scorekeeper.statusMessage)
    renderScore(scorekeeper.blackScore, scorekeeper.whiteScore)
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
  renderBoard(board.gameBoard, board.availableMoves)
}

function render(){
  renderBoard(board.gameBoard)
  renderMessage(scorekeeper.statusMessage)
  renderScore(scorekeeper.blackScore, scorekeeper.whiteScore)
}

init()

//TODO take params out of most functions since they already have global access to variables
  //e.g. render board has access to the board since it's global


//Notes
  //use render for initial rendering
  //use update for updated rendering
  //use set for setting game state variables
