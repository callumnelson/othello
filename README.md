# Shakespearean Othello 

![Game screenshot](https://github.com/callumnelson/othello/blob/main/assets/images/screenshot.png)

An Elizabethan era spin on the classic board game, Othello. Valid moves can be played anywhere that would create a "sandwich" by outflanking one or more of the opponent's pieces in one or more directions. Black always moves first. If a player cannot play, they must skip their turn. If a player can play, they must play. The game ends when one of the following conditions is met:
1. The board is full and there are no more available squares
2. Neither player has a valid move

The player with the most pieces of their color wins and ties are possible. The computer player utilizes a minimax algorithm with up to three levels of recursion to determine the best move available to it. Challenge her if you dare!

## [Play the game here](https://shakespearean-othello.netlify.app/)

## Technologies used 💻

* CSS
* JavaScript
* HTML
* Git
* Netlify

## Attributions 🤩
* Othello utilizes the pacifico font family which can be accessed [here](https://fonts.google.com/specimen/Pacifico)

* Passages from the original Othello script, written by William Shakespeare, found [here](http://shakespeare.mit.edu/othello/full.html)

* Minimax algorithm explanation and pseudocode from Amina A. Aljubran [here](http://cs.indstate.edu/~aaljubran/paper.pdf)

* Recommended minimax board weights from [Washington University](https://courses.cs.washington.edu/courses/cse573/04au/Project/mini1/O-Thell-Us/Othellus.pdf)

* Fastest path to endgame with all black pieces. Used to test engame logic [YT](https://www.youtube.com/watch?v=6ehiWOSp_wk&ab_channel=SAWADYYY) 

* Path to endgame where neither player has a valid move. Used to test endgame logic [YT](https://www.youtube.com/watch?v=B2RKnhTrbTs&ab_channel=BelgianOthelloAssociation)

### Ice Box ⏭️

- [x] Add computer player that selects random move
- [x] Implement minimax algorithm up to three levels of recursion
- [x] Add sound effects for pieces being played
- [x] Additional styling to add to Shakespearean theme
- [] Add animation to pieces when they are flipped
- [] Mobile friendly
- [] Dark/light mode toggle
