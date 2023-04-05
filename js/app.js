/*-------------------------------- Constants --------------------------------*/
const numRows = 10
const numCols = 10
const pieceSound = new Audio('../assets/audio/placePiece.m4a')
pieceSound.volume = 0.25

/*-------------------------------- Classes ----------------------------------*/
/**
   * @class
   * @description Square class to hold information about row/column, whether the square is an edge, is occupied, and the sandwiches that the square can be used to make give the piece that it holds
   * @param {Number} r The row index of the square
   * @param {Number} c The column index of the square
   */
class Square {
  constructor(r, c) {
    this.r = r
    this.c = c
    this.isEdge = !(this.r%(numRows-1)) || !(this.c%(numCols-1)) ? true : false
    this.isOccupied = false
    this.piece = undefined
    this.sandwichDirs = []
  }
  /**
   * @method
   * @description Add a piece to the square
   * @param {Piece} piece The piece to be placed on the square
   */
  addPiece(piece) {
    this.piece = piece
    this.isOccupied = true
  }
}
/**
   * @class
   * @description Simple class to represent pieces on the board
   * @param {Number} r The row index of the piece
   * @param {Number} c The column index of the piece
   * @param {String} color The color of the piece
   */
class Piece {
  constructor(r, c, color){
    this.r = r
    this.c = c
    this.color = color
  }
}
/**
   * @class
   * @description Class to maintain information about whose turn it is, what the score is, and whether the game is over
   */
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
  /**
   * @method
   * @description Update the message that indicates the state of the game (whose turn it is, winner, tie)
   * @param {Array} gameBoard The current gameBoard array
   */
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
  /**
   * @method
   * @description Update the score by counting the pieces on the board of each player's color
   * @param {Array} gameBoard The current gameBoard array
   */
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
  /**
   * @method
   * @description Check if any of the end game scenarios have been met
   */
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
  /**
   * @method
   * @description End the game
   */
  endGame(){
    this.gameOver = true
  }
}
/**
   * @class
   * @description Hold and update gameBoard as well as information about the moves available to the players at any given point in time
   */
class Board {
  constructor() {
    this.gameBoard = []
    this.availableMoves = []
    this.prevAvailableMoves = []
    this.directions = [[-1,-1], [-1,0], [-1,1], [0, -1], [0,1], [1,-1], [1, 0], [1,1]]
    this.weights = [[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 100, -10, 11, 6, 6, 11, -10, 100, 0],
        [0, -10, -20, 1, 2, 2, 1, -20, -10, 0],
        [0, 10, 1, 5, 4, 4, 5, 1, 10, 0],
        [0, 6, 2, 4, 2, 2, 4, 2, 6, 0],
        [0, 6, 2, 4, 2, 2, 4, 2, 6, 0],
        [0, 10, 1, 5, 4, 4, 5, 1, 10, 0],
        [0, -10, -20, 1, 2, 2, 1, -20, -10, 0],
        [0, 100, -10, 11, 6, 6, 11, -10, 100, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]]
  }
  /**
   * @method
   * @description Set the initial board state with four pieces in the four middle squares and find the available moves
   */
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
  /**
   * @method
   * @description Get all available moves on the board by looping through board squares and checking for sandwiches in each direction
   * @param {String} turn The current turn
   */
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
  /**
   * @method
   * @description Set the prevMovesArray to point at the availableMoves before emptying available moves
   */
  clearAvailableMoves() {
    this.prevAvailableMoves = this.availableMoves
    this.availableMoves = []
  }
  /**
   * @method
   * @description For all squares on the board, check if the current player can make a sandwich by playing there
   * @param {Square} Square First square of a potential sandwich
   * @param {Array} dir Array corresponding to the direction in which to travel on the board
   * @param {String} turn The current turn
   * @returns {checkForSandwich} Calls self recursively until one of the return conditions has been met
   */
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
  /**
   * @method
   * @description Loop through all directions in which there is a sandwich to be made and call flipOneDirection
   * @param {Square} Square at which a move was played
   * @param {String} turn The current turn
   */
  flipPieces(square, turn){
    square.sandwichDirs.forEach( sDir => {
      let toFlipR = square.r + sDir[0]
      let toFlipC = square.c + sDir[1]
      let toFlipSq = this.gameBoard[toFlipR][toFlipC]
      this.flipOneDirection(toFlipSq, sDir, turn)
    })
  }
  /**
   * @method
   * @description Recursively flip pieces in one cardinal direction
   * @param {Square} Square The first square to flip
   * @param {Array} dir Array corresponding to the direction in which to travel on the board
   * @param {String} turn The current turn
   * @returns {flipOneDirection} Calls self recursively until all pieces in sandwich have been flipped
   */
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

  /**
   * @method
   * @description Evaluates board against weights for current player
   * @param turn The perspective from which to evaluate
   * @returns eval The sum of board positions * board weights for the given player
   */
  evaluateBoard(turn){
    let res = {white: 0, black: 0}
    this.weights.forEach( (row, rIdx) => {
      row.reduce( (acc, curr, cIdx) => {
        let square = this.gameBoard[rIdx][cIdx]
        if (square.isOccupied) {
          acc[square.piece.color] += curr
        }
        return acc
      }, res)
    })
    return turn === 'black' ? res['black'] - res['white'] : res['white'] - res['black']
  }
}
/**
 * @class
 * @description Represents the players of the game and stores information about their level and color
 */
class Player {
  constructor(level, color){
    //Level is 0 for humans
    this.level = level
    this.color = color
  }
  /**
 * @method
 * @description Given the current board and scorekeeper, creates a deep copy and computes the best move for the current player 
 * @param {Board} bCopy A deep copy of the board
 * @param {Scorekeeper} sCopy A deep copy of the scorekeeper
 * @param number depth The level of the AI / the depth of recursion to use
 * @param turn the turn of the perspective from which we are calling minimax
 * @returns {object} An object containing the coordinates of the best move and move's value (based on the board weights)
*/
 getBestMoveMinimax(bCopy, sCopy, depth, turn){ 
    sCopy.checkGameOver(bCopy)
    if (sCopy.gameOver){
      //If the current player wins: Return high value move
      sCopy.updateScore(bCopy.gameBoard)
      if ((sCopy.blackScore > sCopy.whiteScore && turn === 'black') || (sCopy.blackScore < sCopy.whiteScore && turn === 'white')){
        return 99999
      }
      //Else if the game is over and the current player loses return the lowest value move
      if ((sCopy.blackScore < sCopy.whiteScore && turn === 'black') || (sCopy.blackScore > sCopy.whiteScore && turn === 'white')){
        return -99999
      }
      //Else if the game is over and it is a tie return a neutral move
      if (sCopy.blackScore === sCopy.whiteScore){
        return 0
      }
    }
    //Get the valid moves for the current player
    bCopy.getAvailableMoves(turn)
    //If there are no available moves
    if (!bCopy.availableMoves.length){
      //If we're at base case, return low value
      if (depth === 1){
        return -99999
      //Otherwise, switch turns and call recursively from opponent's perspective
      }else {
        sCopy.switchTurn()
        bCopy.clearAvailableMoves()
        return -1 * this.getBestMoveMinimax(bCopy, sCopy, depth - 1, sCopy.turn).value
      }
    //Otherwise, play every move on the board to test its value
    }else {
      let bestMove = {
        r: undefined,
        c: undefined,
        value: -99999,
      }
      bCopy.availableMoves.forEach( move => {
        let currMove = {r: move.r, c: move.c, value: -99999}
        //Make copy of game state and play move
        let [boardCopy, scorekeeperCopy] = copyGameState(bCopy, sCopy)
        let moveCopyR = move.r
        let moveCopyC = move.c
        let moveSquareCopy = boardCopy.gameBoard[moveCopyR][moveCopyC]
        moveSquareCopy.addPiece(new Piece(moveCopyR, moveCopyC, scorekeeperCopy.turn))
        boardCopy.flipPieces(moveSquareCopy, scorekeeperCopy.turn)
        scorekeeperCopy.updateScore(boardCopy.gameBoard)
        // printBoard(boardCopy.gameBoard)
        //If we're at the depth of recursion, evaluate the board
        if (depth === 1){
          currMove.value = boardCopy.evaluateBoard(scorekeeperCopy.turn)
        } else {
          //We aren't at the depth of recursion yet so we need to call recursively
          scorekeeperCopy.switchTurn()
          //Clear available moves before getting them on the next call
          boardCopy.clearAvailableMoves()
          currMove.value = -1 * this.getBestMoveMinimax(boardCopy, scorekeeperCopy, depth - 1, scorekeeperCopy.turn).value
        }
        //See if the currMove's value is better than the previous best Move's value
        if (bestMove.value <= currMove.value) {
          bestMove = currMove
        //If best move is still undefined, set it to currMove to avoid infite endgame loop
        } else if (bestMove.r === undefined){
          bestMove.r = currMove.r
          bestMove.c = currMove.c
        }
      })
      return bestMove
    }
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
const helpEl = document.getElementById('help-icon')
const helpModalEl = document.getElementById('help-modal')
const closeModalEl = document.getElementById('close-modal')


/*----------------------------- Event Listeners -----------------------------*/

boardEl.addEventListener('click', handleSquareClick)
resetBtnEl.addEventListener('click', resetGame)
saveBtnEl.addEventListener('click', saveSettings)
helpEl.addEventListener('click', showHelpModal)
closeModalEl.addEventListener('click', hideHelpModal)

/*-------------------------------- Functions --------------------------------*/
/**
 * @function
 * @description Uses the DOM to create the initial game board after it has been initialized in the game state
 */
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
/**
 * @function
 * @description Renders the current board, including the available moves
 */
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
/**
 * @function
 * @description Renders the appropriate message according to the current game state
 */
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
/**
 * @function
 * @description Renders the current score
 */
function renderScore(){
  blackScoreEl.textContent = `${scorekeeper.blackScore}`
  whiteScoreEl.textContent = `${scorekeeper.whiteScore}`
}
/**
 * @function
 * @description Plays a move for the current player on the square that was passed and does so using timeouts if delay > 0. Checks if the move results in the next player being unable to play and switches turns if necessary.
 * @param {Square} Square instance that should be played upon
 */
function playMove(square) {
  //Don't play a sound if it's two computers with minimum delay
  if (!(blackPlayer.level && whitePlayer.level && delay < 1000)){
    pieceSound.play()
  }
  //Reset the interval so that it won't run until after the timeouts have happened below (ensured by adding a 250ms buffer for computation time / other timer weirdness)
  clearInterval(timer)
  timer = setInterval(playComputer, delay+250)
  
  //Instantiate a new piece at the square that is being played
  let newPiece = new Piece(square.r, square.c, scorekeeper.turn)
  square.addPiece(newPiece)
  board.clearAvailableMoves()
  render()
  setTimeout(() => {
    board.flipPieces(square, scorekeeper.turn)
    render()
    setTimeout(() => {
      scorekeeper.switchTurn()
      scorekeeper.setMessage()
      scorekeeper.updateScore(board.gameBoard)
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
        }, delay/3)
      }
    }, delay/3)
  }, delay/3)
}
/**
 * @function
 * @description Handles the user's click on an available square and plays the move that was clicked if it was valid at the time
 */
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
/**
 * @function
 * @description Called every interval if there is a computer player to grab the best move on the board and play that move
 */
function playComputer(){
  let currentPlayer = scorekeeper.turn === 'black' ? blackPlayer : whitePlayer  
  //Clear the timer if the game is over
  if (scorekeeper.gameOver){
    clearInterval(timer)
    timer = undefined
  }
  //Only use the AI if there's an AI player and it's their turn
  else if (scorekeeper.turn === currentPlayer.color && currentPlayer.level > 0){
    // let bestMove = currentPlayer.computeBestMove(board, scorekeeper)
    let [bCopy, sCopy] = copyGameState(board, scorekeeper)
    let bestMove = currentPlayer.getBestMoveMinimax(bCopy, sCopy, currentPlayer.level, scorekeeper.turn, scorekeeper.turn)
    if(bestMove.r){
      let bestMoveSquare = board.gameBoard[bestMove.r][bestMove.c]
      playMove(bestMoveSquare)
    }
  }
}
/**
 * @function
 * @description Implement changes to player types made by the user and clear/set intervals for computer players accordingly
 */
function updatePlayerType() {
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
    timer = setInterval(playComputer, delay+250)
  //Create a timer if we're creating a computer player and there isn't already a timer that exists
  } else if (!timer && (blackPlayer.level > 0 || whitePlayer.level > 0)){
    timer = setInterval(playComputer, delay+250)
  //If we are changing the computer back to a player and that leaves us with no computer players then clear the timer
  } else if (timer && !blackPlayer.level && !whitePlayer.level){
    clearInterval(timer)
    timer = undefined
  }
}
/**
 * @function
 * @description Update the delay between turns that gets used in the timeout and interval
 */
function updateDelay(){
  delay = delayInputEl.childNodes[1].value*1000
}
/**
 * @function
 * @description Handle user clicking the save settings button
 */
function saveSettings(){
  updateDelay()
  updatePlayerType()
}
/**
 * @function
 * @description Reset the game it its initial state when the user clicks the reset game button
 */
function resetGame(){
  //Stop the computers from playing
  clearInterval(timer)
  timer = undefined
  //Set a timeout to wait for state to settle if we're in the middle of a state change before resetting everything else
  setTimeout(() => {
    //Clear the GUI 
    while (boardEl.firstChild) {
      boardEl.removeChild(boardEl.firstChild);
    }
    //Instantiate new board and scorekeeper and point global vars to them
    board = new Board()
    scorekeeper = new Scorekeeper()
    //Reset delay slider value to default
    delayInputEl.childNodes[1].value = 0.5
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
  }, 100)
}

/**
 * @function
 * @description Set initial game state, create instances of board, scorekeeper, and player classes, and render
 */
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
  delay = delayInputEl.childNodes[1].value*1000
  //Create players
  blackPlayer = new Player(0, 'black')
  whitePlayer = new Player(0, 'white')
  
  render()
}


/**
 * @function
 * @description Deep clone a class instance.
 * @param {object} instance The class instance you want to clone.
 * @returns {object} A new cloned instance.
 * @author GeorgeGkas
 * @link https://gist.github.com/GeorgeGkas/36f7a7f9a9641c2115a11d58233ebed2
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
/**
 * @function
 * @description Clone the current game stane
 * @param {Board} board The current instance of the game board class
 * @param {Scorekeeper} scorekeeper The current instance of the scorekeeper
 * @returns {Board} boardCopy A new cloned instance of the board
 * @returns {Board} A new cloned instance of the scorekeeeper
 */
function copyGameState(board, scorekeeper) {
  let scorekeeperCopy = clone(scorekeeper)
  let boardCopy = clone(board)
  //In order to clone squares in game board, have to loop through
  let gameBoardCopy = []
  board.gameBoard.forEach(row => {
    gameBoardCopy.push(row.map( square => clone(square)))
  })
  //Replace gameboard so that it contains squares of class square
  boardCopy.gameBoard = gameBoardCopy
  return [boardCopy, scorekeeperCopy]
}
/**
 * @function
 * @description Show instructions modal
 */
function showHelpModal(){
  helpModalEl.style.display = 'block'
}
/**
 * @function
 * @description Hide instructions modal
 */
function hideHelpModal(){
  helpModalEl.style.display = 'none'
}

/**
 * @function
 * @description Render changes made to state
 */
function render(){
  renderBoard()
  renderMessage()
  renderScore()
}

init()