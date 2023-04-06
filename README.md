# Shakespearean Othello ([play here](https://shakespearean-othello.netlify.app/))

An Elizabethan-era spin on the classic board game, Othello. 

![Game screenshot](https://github.com/callumnelson/othello/blob/main/assets/images/screenshot.png)

Black always moves first. A move consists of placing a piece on one of the available squares, which are highlighted on the board at the start of each turn. A valid move is one that creates a "sandwich" by outflanking one or more of the opponent's pieces in one or more directions. After a piece is placed, the browser handles re-rendering the board to change the color of the "captured" pieces. 

The rules are simple:
1. If a player cannot play, their turn will be skipped. 
2. If a player can play, they must play, and may not choose to skip their turn. 
3. The game ends in one of two scenarios: 
  * The board is full and there are no more available squares
  * Neither player has a valid move to make
4. At that point, the player with the most pieces of their color wins. It is possible to tie. 

The computer player utilizes a minimax algorithm (see more below) with up to three levels of recursion to determine the best move available to it. Only the bravest users should challenge her!

## Getting started 🏁

The game defaults to human vs. human mode with a 0.5-second delay for rendering turns. The user can elect to play against the computer or watch a computer vs. computer match. In order to do so, select the appropriate settings and click "Save Settings". If a computer player is selected to play with black pieces, the game will automatically start after the user presses "Save Settings". At any time during the game, the user can adjust the settings to change the speed of play or type of player and press "Save Settings". The "Reset Game" button will reset the board, set the turn delay to 0.5s, and set both player types to human. 

## More on Minimax 💻

Per [Wikipedia](https://en.wikipedia.org/wiki/Minimax), the Minimax algorithm is "a decision rule used in artificial intelligence, decision theory, game theory, statistics, and philosophy for minimizing the possible loss for a worst case (maximum loss) scenario." In Othello, the algorithm seeks to maximize the position on the board, based on a pre-determined set of weights associated with each board square (see attributions), while minimizing the value of the opponent's position. The three levels of computer player differ describe the number of moves into the future (depth of recursion) that the algorithm is taking into account, such that:
1. **Computer I** maximizes the value of its current move based on the board weights associated with its available moves without looking beyond the current move. 
2. **Computer II** looks ahead two moves and assumes that the opponent will play its best available move (highest board weight value). The computer then plays the move that maximizes its score while giving its opponent the least valuable. 
3. **Computer III** looks three moves into the future to maximize both its current move and its next move while minimizing the opponent's move in between. 

## Technologies used 💻

* CSS
* JavaScript
* HTML
* Git
* Netlify

## Attributions 🤩
* The Pacifico font family which can be accessed [here](https://fonts.google.com/specimen/Pacifico)
* Passages from the original Othello script, written by William Shakespeare, found [here](http://shakespeare.mit.edu/othello/full.html)
* Minimax algorithm explanation and pseudocode from Amina A. Aljubran [here](http://cs.indstate.edu/~aaljubran/paper.pdf)
* Recommended minimax board weights from [Washington University](https://courses.cs.washington.edu/courses/cse573/04au/Project/mini1/O-Thell-Us/Othellus.pdf)
* For testing endgame logic:
  * Fastest path to an endgame with all black pieces [here](https://www.youtube.com/watch?v=6ehiWOSp_wk&ab_channel=SAWADYYY)
  * Path to an endgame where neither player has a valid move [here](https://www.youtube.com/watch?v=B2RKnhTrbTs&ab_channel=BelgianOthelloAssociation)
* Comedy and drama masks downloaded from [here](https://pixabay.com/vectors/drama-comedy-and-tragedy-theater-312318/)

## Next Steps (Ice Box) ⏭️

- [x] Add a computer player that selects a random move
- [x] Implement minimax algorithm up to three levels of recursion
- [x] Add sound effects for pieces being played
- [x] Additional styling to add to the Shakespearean theme
- [x] Help modal with gameplay instructions
- [ ] Add animation to pieces when they are flipped
- [ ] Mobile friendly
- [ ] Dark/light mode toggle
