# Shakespearean Othello ([play here](https://shakespearean-othello.netlify.app/){:target="_blank"})

An Elizabethan-era spin on the classic board game, Othello. 

![Game screenshot](https://github.com/callumnelson/othello/blob/main/assets/images/screenshot.png)

Black always moves first. Valid moves can be played anywhere that would create a "sandwich" by outflanking one or more of the opponent's pieces in one or more directions.  If a player cannot play, they must skip their turn. If a player can play, they must play. The game ends when one of the following conditions is met:
1. The board is full and there are no more available squares
2. Neither player has a valid move

The player with the most pieces of their color wins and ties are possible. The computer player utilizes a minimax algorithm with up to three levels of recursion to determine the best move available to it. Challenge her if you dare!

## Getting started 🏁

The game will default to human vs. human with a 0.5-second delay for rendering turns. If you wish to play the computer or have a computer vs. computer match, select the appropriate settings and click "Save Settings". If you have designated a computer player to play with black pieces, the game will automatically start after "Save Settings" is pressed.

## More on Minimax 💻

Per [Wikipedia](https://en.wikipedia.org/wiki/Minimax), the Minimax algorithm is "a decision rule used in artificial intelligence, decision theory, game theory, statistics, and philosophy for minimizing the possible loss for a worst case (maximum loss) scenario." In Othello, the algorithm seeks to maximize the position on the board, based on a pre-determined set of weights associated with each board square (see attributions), while minimizing the value of the opponent's position. The three levels of computer player differ in the number of moves each looks into the future (depth of recursion) such that:
1. **Computer I**: Maximizes the value of its current move based on the board weights associated with its available moves without looking beyond the current move. 
2. **Computer II**: Looks ahead two moves and assumes that the opponent will play its best available move (highest board weight value). The computer then plays the move that maximizes its score while giving its opponent the least valuable. 
3. **Computer III**: Looks three moves into the future to maximize both its current move and its next move while minimizing the opponent's move in between. 

## Technologies used 💻

* CSS
* JavaScript
* HTML
* Git
* Netlify

## Attributions 🤩
* Othello utilizes the Pacifico font family which can be accessed [here](https://fonts.google.com/specimen/Pacifico)
* Passages from the original Othello script, written by William Shakespeare, found [here](http://shakespeare.mit.edu/othello/full.html)
* Minimax algorithm explanation and pseudocode from Amina A. Aljubran [here](http://cs.indstate.edu/~aaljubran/paper.pdf)
* Recommended minimax board weights from [Washington University](https://courses.cs.washington.edu/courses/cse573/04au/Project/mini1/O-Thell-Us/Othellus.pdf)
* Fastest path to an endgame with all black pieces. Used to test endgame logic [YT](https://www.youtube.com/watch?v=6ehiWOSp_wk&ab_channel=SAWADYYY) 
* Path to an endgame where neither player has a valid move. Used to test endgame logic [YT](https://www.youtube.com/watch?v=B2RKnhTrbTs&ab_channel=BelgianOthelloAssociation)
* Comedy and drama masks downloaded from [here](https://pixabay.com/vectors/drama-comedy-and-tragedy-theater-312318/)

### Ice Box ⏭️

- [x] Add a computer player that selects a random move
- [x] Implement minimax algorithm up to three levels of recursion
- [x] Add sound effects for pieces being played
- [x] Additional styling to add to the Shakespearean theme
- [x] Help modal with gameplay instructions
- [ ] Add animation to pieces when they are flipped
- [ ] Mobile friendly
- [ ] Dark/light mode toggle
