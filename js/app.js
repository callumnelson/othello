/*-------------------------------- Constants --------------------------------*/
const numRows = 10
const numCols = 10

/*-------------------------------- Classes ----------------------------------*/
class Square {
  constructor(r, c) {
    this.r = r
    this.c = c
    this.isEdge = !(this.r%(numRows-1)) || !(this.c%(numCols-1)) ? true : false
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
      } else if (this.blackScore > this.whiteScore) {
        this.statusMessage = `Black wins! And what was he? Forsooth, a great arithmetician`
      } else {
        this.statusMessage = `White wins! And what was he? Forsooth, a great arithmetician`
      }
    }
  }
  updateScore(gameBoard){
    let bScore = 0
    let wScore = 0
    let nPieces = 0
    //TODO turn this into reduce with an object for each score + total
    gameBoard.forEach( row => {
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
    //If the board is full, game over
    if(this.numPieces === (numRows-2)*(numCols-2)) {
      this.endGame()
      this.setMessage()
    //If neither player has available moves, game over
    } else if (!board.prevAvailableMoves.length && !board.availableMoves.length) {
      this.endGame()
      this.setMessage()
    }
  }
  endGame(){
    this.gameOver = true
  }
}

class Board {
  constructor() {
    this.gameBoard = []
    this.availableMoves = []
    this.prevAvailableMoves = []
    this.directions = [[-1,-1], [-1,0], [-1,1], [0, -1], [0,1], [1,-1], [1, 0], [1,1]]
  }
  initializeBoard() {
    //Create a 10x10 board with a 1x10 border around the edge
    for (let r = 0; r < numRows; r++) {
      let newRow = []
      for (let c = 0; c < numCols; c++){
        //Instantiate a new square and add to the board
        let square = new Square(r, c)
        newRow.push(square)
        //If the r,c pair is the middle four squares, add a piece to the square
        if ([numRows/2-1,numRows/2].includes(r) && [numCols/2-1,numCols/2].includes(c)){
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
  //Clear available moves to disable user input in between turns where there's a delay
  clearAvailableMoves() {
    this.prevAvailableMoves = this.availableMoves
    this.availableMoves = []
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

class Player {
  constructor(level, color){
    //Level is 0 for humans
    this.level = level
    this.color = color
  }
  computeBestMove(board, scorekeeper){
    let bestScore = 0
    let bestMove = {}
    board.availableMoves.forEach( move => {
      //Make deep copies so we don't mess up the real game board
      let scorekeeperCopy = clone(scorekeeper)
      let boardCopy = clone(board)
      //In order to clone squares in game board, have to loop through
      let gameBoardCopy = []
      board.gameBoard.forEach(row => {
        gameBoardCopy.push(row.map( square => clone(square)))
      })
      //Replace gameboard so that it contains squares of class square
      boardCopy.gameBoard = gameBoardCopy
      //Get current score to be able to compute change after playing the move
      let currentScore = scorekeeperCopy.turn === 'black' ? scorekeeperCopy.blackScore : scorekeeperCopy.whiteScore 
      //Get the move potential move from the copy of the game board
      let moveCopyR = move.r
      let moveCopyC = move.c
      let moveSquareCopy = boardCopy.gameBoard[moveCopyR][moveCopyC]
      moveSquareCopy.addPiece(new Piece(moveCopyR, moveCopyC, scorekeeperCopy.turn))
      boardCopy.flipPieces(moveSquareCopy, scorekeeperCopy.turn)
      scorekeeperCopy.updateScore(boardCopy.gameBoard)
      //Compute value of turn and update best move if we found a new best score
      let turnValue = scorekeeperCopy.turn === 'black' ? scorekeeperCopy.blackScore - currentScore : scorekeeperCopy.whiteScore - currentScore
      //Update best move if it's better than previous best move
      if (turnValue > bestScore) {
        bestMove.r = moveCopyR
        bestMove.c = moveCopyC
        bestMove.bestScore = turnValue
        bestScore = turnValue
      }
    })
    return bestMove
  }
}

/*---------------------------- Variables (state) ----------------------------*/
let board = new Board()
let scorekeeper = new Scorekeeper()
let delay, timer
let blackPlayer, whitePlayer

/*------------------------ Cached Element References ------------------------*/
const boardEl = document.getElementById('board')
const messageEl = document.getElementById('message')
const blackScoreEl = document.getElementById('black-score')
const whiteScoreEl = document.getElementById('white-score')
const resetBtnEl = document.getElementById('reset-button')
const saveBtnEl = document.getElementById('save-button')
const turnPieceEls = document.querySelectorAll('.turn-piece')
const delayInputEl = document.getElementById('delay-input')
//Whole wrapper for event bubbling
const pTypeEl = document.getElementById('player-type-wrapper')
//Inputs for resetting
const radioInputEls = document.querySelectorAll('input[type=radio]')


/*----------------------------- Event Listeners -----------------------------*/

boardEl.addEventListener('click', handleSquareClick)
resetBtnEl.addEventListener('click', resetGame)
saveBtnEl.addEventListener('click', saveSettings)
// delayInputEl.addEventListener('change', updateDelay)
// pTypeEl.addEventListener('change', handlePlayerTypeChange)

/*-------------------------------- Functions --------------------------------*/

function createBoard() {
  board.gameBoard.forEach(row => {
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

function renderBoard() {
  board.gameBoard.forEach( row => {
    row.forEach( square => {
      let sqElId = `${square.r},${square.c}`
      let sqEl = document.getElementById(sqElId)
      //If the square is in the available moves and isn't already highlighted then add the available class, otherwise remove available tag if it exists
      if (board.availableMoves.includes(square) && !sqEl.classList.contains('available')) {
        sqEl.classList.add('available')
      //Remove the available class if it's not a move
      } else if (!board.availableMoves.includes(square)){
        sqEl.classList.remove('available')
      }
      //If the square has a piece element
      if (square.isOccupied){
        //If that element is already represented graphically, make sure it's the right color
        if (sqEl.childElementCount){
          let pieceEl = sqEl.childNodes[0]
          pieceEl.classList.remove('black', 'white')
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

function renderMessage(){
  messageEl.textContent = scorekeeper.statusMessage
  turnPieceEls.forEach( el => {
    el.classList.remove('black', 'white')
    if(scorekeeper.gameOver){
      if (scorekeeper.blackScore === scorekeeper.whiteScore){
        //Set gradient to message pieces in case of tie
        el.setAttribute('style', `background: rgb(0,0,0);
        background: linear-gradient(90deg, rgba(0,0,0,1) 0%, rgba(135,135,135,1) 30%, rgba(255,255,255,1) 100%);`)
      } else {
        //Otherwise set message pieces to color of winner
        scorekeeper.blackScore > scorekeeper.whiteScore ? el.classList.add('black') : el.classList.add('white')
      }
    } else {
      el.classList.add(scorekeeper.turn)
      el.style.border = '0.5px solid black'
    }
  })
}

function renderScore(){
  blackScoreEl.textContent = `${scorekeeper.blackScore}`
  whiteScoreEl.textContent = `${scorekeeper.whiteScore}`
}

function playMove(square) {
  console.log('Current turn:', scorekeeper.turn)
  console.log('Available moves:', board.availableMoves)
  console.log('Previous moves:', board.prevAvailableMoves)
  let newPiece = new Piece(square.r, square.c, scorekeeper.turn)
  square.addPiece(newPiece)
  board.clearAvailableMoves()
  render()
  setTimeout(() => {
    board.flipPieces(square, scorekeeper.turn)
    scorekeeper.switchTurn()
    scorekeeper.setMessage()
    scorekeeper.updateScore(board.gameBoard)
    render()
    setTimeout(() => {
      board.getAvailableMoves(scorekeeper.turn)
      scorekeeper.checkGameOver(board)
      render()
      //If there aren't available moves, switch turns immediately
      if(!board.availableMoves.length) {
        setTimeout(() => {
          board.clearAvailableMoves()
          scorekeeper.switchTurn()
          scorekeeper.setMessage()
          board.getAvailableMoves(scorekeeper.turn)
          //Check if game is over because both players have no available moves
          scorekeeper.checkGameOver(board)
          //Need to set the message again if the game is over
          scorekeeper.setMessage()
          render()
        }, delay)
      }
    }, delay)
  }, delay)
}

function handleSquareClick(evt){
  let clickedEl = evt.target
  //Only handle the click if user clicked on an available square and the current turn is not a computer player's turn
  if(clickedEl.classList.contains('available')){
    if ((scorekeeper.turn === 'black' && !blackPlayer.level) || (scorekeeper.turn === 'white' && !whitePlayer.level)){
      let sqCoords = clickedEl.id.split(',')
      let r = sqCoords[0]
      let c = sqCoords[1]
      let clickedSquare = board.gameBoard[r][c]
      playMove(clickedSquare)
    }
  }
}

function playComputer(){
  let currentPlayer = scorekeeper.turn === 'black' ? blackPlayer : whitePlayer  
  //Clear the timer if the game is over
  if (scorekeeper.gameOver){
    clearInterval(timer)
    timer = undefined
  }
  //Only use the AI if there's an AI player and it's their turn
  else if (scorekeeper.turn === currentPlayer.color && currentPlayer.level > 0){
    let bestMove = currentPlayer.computeBestMove(board, scorekeeper)
    if(bestMove.r){
      let bestMoveSquare = board.gameBoard[bestMove.r][bestMove.c]
      playMove(bestMoveSquare)
    }
    
  } 
}

function handlePlayerTypeChange() {
  //Loop through radio inputs to get currently selected player type
  radioInputEls.forEach(inputEl => {
    let pColor = inputEl.id.split('-')[1]
    if (inputEl.checked) {
      //Coerce level to number
      pColor === 'black' ? blackPlayer.level = inputEl.id.split('-')[0]*1 : whitePlayer.level = inputEl.id.split('-')[0]*1
    }
  })
  //If there's already a timer, reinitiate the interval with the new delay value
  if (timer && (blackPlayer.level > 0 || whitePlayer.level > 0)){
    clearInterval(timer)
    timer = setInterval(playComputer, delay)
  //Create a timer if we're creating a computer player and there isn't already a timer that exists
  } else if (!timer && (blackPlayer.level > 0 || whitePlayer.level > 0)){
    //Always delay the computer by a second so rendering happens discernably
    timer = setInterval(playComputer, delay)
  //If we are changing the computer back to a player and that leaves us with no computer players then clear the timer
  } else if (timer && !blackPlayer.level && !whitePlayer.level){
    clearInterval(timer)
    timer = undefined
  }
}

function updateDelay(){
  delay = delayInputEl.childNodes[1].value*500
}

function saveSettings(){
  updateDelay()
  handlePlayerTypeChange()
}

function resetGame(){
  //Clear the GUI 
  while (boardEl.firstChild) {
    boardEl.removeChild(boardEl.firstChild);
  }
  //Instantiate new board and scorekeeper and point global vars to them
  board = new Board()
  scorekeeper = new Scorekeeper()
  //Reset delay slider value to 0
  delayInputEl.childNodes[1].value = 0
  clearInterval(timer)
  timer = undefined
  //Reset player type selector to human level
  radioInputEls.forEach(inputEl => {
    //If the input ID starts with a 0 it's the human input
    if (!(inputEl.id.split('-')[0]*1)){
      inputEl.checked = true
    }else {
      inputEl.checked = false
    }
  })

  init()
}

function init() {
  //Create game board
  board.initializeBoard()
  createBoard()
  //Create scorekeeper and set initial message
  scorekeeper.setMessage()
  //Calculate initial score
  scorekeeper.updateScore(board.gameBoard)
  //Find available moves
  board.getAvailableMoves(scorekeeper.turn)
  //Set initial delay
  delay = delayInputEl.childNodes[1].value
  //Create players
  blackPlayer = new Player(0, 'black')
  whitePlayer = new Player(0, 'white')
  
  render()
}

//https://gist.github.com/GeorgeGkas/36f7a7f9a9641c2115a11d58233ebed2
/**
 * @function
 * @description Deep clone a class instance.
 * @param {object} instance The class instance you want to clone.
 * @returns {object} A new cloned instance.
 */
function clone(instance) {
  return Object.assign(
    //Target is a new instance of class
    Object.create(
      // Set the prototype of the new object to the prototype of the instance.
      // Used to allow new object behave like class instance.
      Object.getPrototypeOf(instance),
    ),
    // Prevent shallow copies of nested structures like arrays, etc
    JSON.parse(JSON.stringify(instance)),
  )
}

function render(){
  renderBoard()
  renderMessage()
  renderScore()
}

init()

//TODO comments above functions like clone
