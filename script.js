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



const controller = (() => {

    let totalMoves = 0;
    let gameOver = false;
    let aiTurn = false;
    //const container = document.querySelector('.container');
    const header = document.getElementById('header');
    const modal = document.getElementById("modal");
    const modalContentOne = document.getElementById("modal-content-1");
    const modalContentTwo = document.getElementById("modal-content-2");
    const squares = document.querySelectorAll(".grid-item");
    const markerButtons = document.querySelectorAll(".player-marker");
    const vsComputerBtn = document.getElementById("vs-computer");
    const vsPlayerBtn = document.getElementById("vs-player");
    const aiDifficultySelect = document.getElementById("difficulty-select");
    let difficulty;
    let playerOne;
    let playerTwo;
    let aiPlayer;
    let vsAi = false;
    let currentPlayer;
    function createPerson(mark) {
        return {
            mark
        }
    }

    function createPlayers(marker) {
        if (!vsAi) {
            playerOne = createPerson("X");
            playerTwo = createPerson("O");
        } else if (marker === "X" && vsAi) {
            playerOne = createPerson("X");
            playerTwo = createPerson("O");
            aiPlayer = playerTwo;
        } else if (marker === "O" && vsAi) {
            playerOne = createPerson("X");
            aiPlayer = playerOne;
            playerTwo = createPerson("O");
        }
        currentPlayer = playerOne;
    }

    vsPlayerBtn.addEventListener('click', () => {
        modal.style.display = "none";
      
        createPlayers();
        startGame();
    })

    vsComputerBtn.addEventListener('click', () => {
        vsAi = true;
        difficulty = aiDifficultySelect.options[aiDifficultySelect.selectedIndex].value;
        modalContentOne.style.display = "none";
        modalContentTwo.style.display = "flex";

    })

    markerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            modal.style.display = "none";
            createPlayers(button.value);
            startGame();
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
                    if (!gameOver && vsAi) {
                        aiTurn = true;
                        aiPlays(difficulty);
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
    function startGame() {
        if (vsAi) {
            if (aiPlayer === playerOne) {
                aiTurn = true;
                aiPlays(difficulty);

            } else {

            }
        }
        render();
    }


    //Ai functionality with difficulty
    function aiPlays(difficulty) {
        if (aiTurn) {
            if (difficulty === "easy" || totalMoves === 0) {
                let index = Math.floor(Math.random() * 9);
                while (!board.checkValidMove(index)) {
                    index = Math.floor(Math.random() * 9)
                }
                playMove(index);
            } else if (difficulty === "hard" && playerOne === aiPlayer) {
                let currentBoardState = getCurrentState(board.gameBoard);
                let bestMove = minimax(currentBoardState, playerOne, 0);
                playMove(bestMove.index);
            } else if (difficulty === "hard" && playerTwo === aiPlayer) {
                let currentBoardState = getCurrentState(board.gameBoard);
                let bestMove = minimax(currentBoardState, playerTwo, 0);
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

    function getEmptyCells(board) {
        return board.filter(i => i != "X" && i != "O");
    }

    function minimax(newBoard, player, depth) {
        const availCells = getEmptyCells(newBoard);

        if (board.checkWin(newBoard, playerTwo) && playerTwo != aiPlayer) {
            return { score: depth-10 };
        } else if (board.checkWin(newBoard, playerOne) && playerOne != aiPlayer) {
            return { score: depth-10 };
        } else if (board.checkWin(newBoard, aiPlayer)) {
            return { score: 10-depth };
        } else if (availCells.length === 0) {
            return { score: 0 };
        }

        let moves = [];

        for (let i = 0; i < availCells.length; i++) {
            let move = {};
            move.index = newBoard[availCells[i]];
            newBoard[availCells[i]] = player.mark;

            if (player === playerOne) {
                let result = minimax(newBoard, playerTwo, depth+1);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, playerOne, depth+1);
                move.score = result.score;
            }

            newBoard[availCells[i]] = move.index;
            moves.push(move);
        }
        let bestMove;

        if (player === aiPlayer) {
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





