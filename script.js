const board = (() => {
    let gameBoard = [' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' ',]


    //Updates board array with marker
    function updateBoard(index, mark) {
        gameBoard[index] = mark;
    }


    function getBoard(index) {
        if (!index) {
            return gameBoard;
        } else {
            return gameBoard[index];
        }
    }

    function clearBoard() {
        gameBoard.fill(' ');
    }

    //Check to see if marker can be placed
    function checkValidMove(index) {
        return (gameBoard[index] === ' ');
    }

    //Checks for winner or draw
    function checkWin(currentBoard, player) {
        if (
            (currentBoard[0] === player.mark && currentBoard[1] === player.mark && currentBoard[2] === player.mark) ||
            (currentBoard[3] === player.mark && currentBoard[4] === player.mark && currentBoard[5] === player.mark) ||
            (currentBoard[6] === player.mark && currentBoard[7] === player.mark && currentBoard[8] === player.mark) ||
            (currentBoard[0] === player.mark && currentBoard[3] === player.mark && currentBoard[6] === player.mark) ||
            (currentBoard[1] === player.mark && currentBoard[4] === player.mark && currentBoard[7] === player.mark) ||
            (currentBoard[2] === player.mark && currentBoard[5] === player.mark && currentBoard[8] === player.mark) ||
            (currentBoard[0] === player.mark && currentBoard[4] === player.mark && currentBoard[8] === player.mark) ||
            (currentBoard[2] === player.mark && currentBoard[4] === player.mark && currentBoard[6] === player.mark)
        ) {
            return true;
        } else {
            return false;
        }
    }

 



    return {
        updateBoard: updateBoard,
        checkValidMove: checkValidMove,
        checkWin: checkWin,
        clearBoard: clearBoard,
        getBoard: getBoard,
        gameBoard: gameBoard,
    };
})();

const playerFactory = (mark) => {

    return { mark };
}




const controller = (() => {
    let currentPlayer;
    let totalMoves = 0;
    let gameOver = false;
    let aiTurn = false;
    let aiFirstMove = true;
    //const container = document.querySelector('.container');
    const header = document.getElementById('header');
    const modal = document.getElementById("modal");
    const squares = document.querySelectorAll(".grid-item");
    const markerButtons = document.querySelectorAll(".player-marker");
    const vsComputerBtn = document.getElementById("vs-computer");
    const vsPlayerBtn = document.getElementById("vs-player")
    markerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            startGame(button.value);
        })
    })

    //Renders game board
    function render() {
        squares.forEach((square, index) => {
            square.addEventListener('click', () => {
                if (!aiTurn && !gameOver) {
                    if (board.checkValidMove(index)) {
                        playMove(index);
                    }
                    if (!gameOver) {
                        aiTurn = true;
                        aiPlays("hard");
                    }
                }
            })
        }
        )
    }


    //Plays the move
    function playMove(index) {
        board.updateBoard(index, currentPlayer.mark)
        squares[index].innerHTML = currentPlayer.mark;
        totalMoves++;
        console.log(totalMoves);
        if (board.checkWin(board.gameBoard, currentPlayer)) {
            gameOver = true;
            declareWinner(currentPlayer);
        } else if (totalMoves == 9) {
            gameOver = true;
            declareWinner("Draw")
        }

        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;
    }

    //Gets total # of moves
    function getTotalMoves() {
        return totalMoves;
    }

    //Adds winner declaration and stops game.
    function declareWinner(winner) {
        gameOver = true;
        const score = document.createElement('div');
        score.setAttribute('id', 'score');
        if (winner === "Draw") {
            score.innerHTML = "DRAW!";
        } else {
            score.innerHTML = `The winner is ${currentPlayer.mark}`
        }
        header.append(score);
    }

    //Gets current player
    function getCurrentPlayer() {
        return currentPlayer;
    }

    //Resets board
    function reset() {
        board.clearBoard();

        render();
        if (document.contains(document.getElementById('score'))) {
            score.remove();
        }
        currentPlayer = playerOne;
        totalMoves = 0;
    }

    //starts and renders game board
    function startGame(markerOption) {
        if (markerOption === "X") {
            playerOne = playerFactory("X");
            playerTwo = playerFactory("O");
            currentPlayer = playerOne;
            aiTurn = true;
            aiFirstMove = true;
            aiPlays("hard");
        } else {
            playerTwo = playerFactory("X");
            playerOne = playerFactory("O");
            currentPlayer = playerTwo;
            aiFirstMove = false;
            aiTurn = true;
            aiPlays("hard");
        }

        modal.style.display = "none";
        render();
    }


    //Ai functionality with difficulty
    function aiPlays(difficulty) {
        if (aiTurn) {
            if (difficulty === "easy" || aiFirstMove) {
                let index = Math.floor(Math.random() * 9);
                while (!board.checkValidMove(index)) {
                    index = Math.floor(Math.random() * 9)
                }
                playMove(index);
                aiFirstMove = false;
            } else if (difficulty === "hard") {
                let currentBoardState = getCurrentState(board.gameBoard);
                let bestMove = minimax(currentBoardState, playerOne);
                playMove(bestMove.index);
                
            }

        }
        aiTurn = false;
    }


    function getCurrentState(board) {
        let newBoard = [];
        for (let i = 0; i < board.length; i++) {
            if (board[i] === ' ') {
                newBoard[i] = i;
            } else {
                newBoard[i] = board[i];
            }
        }
        return newBoard;
    }

    function getEmptyCellIndexes(currentBoard) {
        return currentBoard.filter(i => i != "X" && i != "O");
    }

    function minimax(newBoard, player) {
        const availableCellIndexes = getEmptyCellIndexes(newBoard);

        if (board.checkWin(newBoard, playerTwo)) {
            return { score: -10 };
        } else if (board.checkWin(newBoard, playerOne)) {
            return { score: 10 };
        } else if (availableCellIndexes.length === 0) {
            return { score: 0 };
        }

        let moves = [];

        for (let i = 0; i < availableCellIndexes.length; i++) {
            let move = {};
            move.index = newBoard[availableCellIndexes[i]];
            newBoard[availableCellIndexes[i]] = player.mark;

            if (player === playerOne) {
                let result = minimax(newBoard, playerTwo);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, playerOne);
                move.score = result.score;
            }

            newBoard[availableCellIndexes[i]] = move.index;
           moves.push(move);
        }
        let bestMove;

        if (player === playerOne) {
            let bestScore = -1000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score > bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        } else {
            let bestScore = 1000;
            for (let i = 0; i < moves.length; i++) {
                if (moves[i].score < bestScore) {
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
       
        return moves[bestMove];
    }

    return { getTotalMoves, getCurrentPlayer, reset }
})();





