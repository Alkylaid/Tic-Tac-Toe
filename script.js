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
    container = document.querySelector('.container');
    const header = document.getElementById('header');
    const modal = document.getElementById("modal");
    const modalContentOne = document.getElementById("modal-content-1");
    const modalContentTwo = document.getElementById("modal-content-2");
    const squares = document.querySelectorAll(".grid-item");
    const markerButtons = document.querySelectorAll(".player-marker");
    const vsComputerBtn = document.getElementById("vs-computer");
    const vsPlayerBtn = document.getElementById("vs-player");
    const aiDifficultySelect = document.getElementById("difficulty-select");
    const newGameBtn = document.getElementById("reset");
    const menuBtns = document.querySelectorAll(".menu-button.options");
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
        document.getElementById("menuPlayerSelect").classList.add("active");
        createPlayers();
        startGame();
    })

    vsComputerBtn.addEventListener('click', () => {
        vsAi = true;

        document.getElementById("menuAiSelect").classList.add("active");
        difficulty = aiDifficultySelect.options[aiDifficultySelect.selectedIndex].value;
        if (difficulty === "easy") {
            document.getElementById("menuEasySelect").classList.add("active");
        } else if (difficulty === "medium") {
            document.getElementById("menuMedSelect").classList.add("active");
        } else if (difficulty === "hard") {
            document.getElementById("menuHardSelect").classList.add("active");
        }
        modalContentOne.style.display = "none";
        modalContentTwo.style.display = "flex";

    })

    markerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            modal.style.display = "none";
            if (button.value === "X") {
                document.getElementById("menuCrossSelect").classList.add("active");
            } else if (button.value === "O") {
                document.getElementById("menuNoughtSelect").classList.add("active");
            }
            createPlayers(button.value);
            startGame();
        })
    })

    newGameBtn.addEventListener('click', () => {
        let menuSelections = document.querySelectorAll(".menu-button.options.active");
        if (menuSelections.length === 1) {
            vsAi = false;
            createPlayers();
        } else {
            vsAi = true;
            for (let i = menuSelections.length - 1; i > 0; i--) {
                if (menuSelections[i].id === "menuEasySelect" || 
                menuSelections[i].id === "menuMedSelect" || 
                menuSelections[i].id === "menuHardSelect") {
                    difficulty = menuSelections[i].value;
                }
                if(menuSelections[i].id === "menuCrossSelect" || menuSelections[i].id === "menuNoughtSelect") {
                    createPlayers(menuSelections[i].value);
                }
               
       }
       
    }
    reset();
        })

    menuBtns.forEach((button) => {
        button.addEventListener('click', () => {
            if (button.classList.contains('active')) {
                if(!button.id == "menuAiSelect") {
                    button.classList.remove('active');
                }
            } else if (button.id === "menuPlayerSelect") {
                for (let i = 1; i < menuBtns.length; i++) {
                    menuBtns[i].classList.remove('active');
                }
                button.classList.add('active');
            } else if (button.id === "menuAiSelect") {
                menuBtns[0].classList.remove('active');
                button.classList.add('active');
                if (!menuBtns[2].classList.contains("active") && !menuBtns[3].classList.contains("active")) {
                    menuBtns[2].classList.add("active");
                }
                if (!menuBtns[4].classList.contains("active") && !menuBtns[5].classList.contains("active") &&
                !menuBtns[6].classList.contains("active")) {
                    menuBtns[4].classList.add("active");
                }
            } else if (button.id === "menuCrossSelect") {
                if (!menuBtns[1].classList.contains("active")) {
                    menuBtns[1].classList.add("active");
                }
                if (!menuBtns[4].classList.contains("active") && !menuBtns[5].classList.contains("active") &&
                !menuBtns[6].classList.contains("active")) {
                    menuBtns[4].classList.add("active");
                }
                menuBtns[0].classList.remove('active');
                menuBtns[3].classList.remove('active');
                button.classList.add('active');
            } else if (button.id === "menuNoughtSelect") {
                if (!menuBtns[1].classList.contains("active")) {
                    menuBtns[1].classList.add("active");
                }
                if (!menuBtns[4].classList.contains("active") && !menuBtns[5].classList.contains("active") &&
                !menuBtns[6].classList.contains("active")) {
                    menuBtns[4].classList.add("active");
                }
                menuBtns[0].classList.remove('active');
                menuBtns[2].classList.remove('active');
                button.classList.add('active');
            } else if (button.id === "menuEasySelect") {
                if (!menuBtns[1].classList.contains("active")) {
                    menuBtns[1].classList.add("active");
                }
                if (!menuBtns[2].classList.contains("active") && !menuBtns[3].classList.contains("active")) {
                    menuBtns[2].classList.add("active");
                }
                menuBtns[0].classList.remove('active');
                menuBtns[5].classList.remove('active');
                menuBtns[6].classList.remove('active');
                button.classList.add('active');
            } else if (button.id === "menuMedSelect") {
                if (!menuBtns[1].classList.contains("active")) {
                    menuBtns[1].classList.add("active");
                }
                if (!menuBtns[2].classList.contains("active") && !menuBtns[3].classList.contains("active")) {
                    menuBtns[2].classList.add("active");
                }
                menuBtns[0].classList.remove('active');
                menuBtns[4].classList.remove('active');
                menuBtns[6].classList.remove('active');
                button.classList.add('active');
            } else if (button.id === "menuHardSelect") {
                if (!menuBtns[1].classList.contains("active")) {
                    menuBtns[1].classList.add("active");
                }
                if (!menuBtns[2].classList.contains("active") && !menuBtns[3].classList.contains("active")) {
                    menuBtns[2].classList.add("active");
                }
                menuBtns[0].classList.remove('active');
                menuBtns[4].classList.remove('active');
                menuBtns[5].classList.remove('active');
                button.classList.add('active');
            }
        })
    })



    //Renders game board
    function render() {
        squares.forEach((square, index) => {
            square.addEventListener('click', () => {

                if (!aiTurn && !gameOver) {
                    if (board.checkValidMove(index)) {
                        playMove(index);
                    } else {
                        return;
                    }
                    if (!gameOver && vsAi) {
                        aiTurn = true;
                        setTimeout(() => { aiPlays(difficulty) }, 500);
                    }
                }
            })
        }
        )
    }


    //Plays the move
    function playMove(index) {
        board.updateBoard(index, currentPlayer.mark)
        squares[index].innerHTML = `<span>${currentPlayer.mark}</span>`;
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
            score.innerHTML = `The winner is ${currentPlayer.mark}!`
        }
        container.append(score);
    }

    //Gets current player
    function getCurrentPlayer() {
        return currentPlayer;
    }

    //Resets board
    function reset() {
        board.clearBoard();
        squares.forEach((square) => {
            square.innerHTML = " ";
        })
        if (document.contains(document.getElementById('score'))) {
            score.remove();
        }
        currentPlayer = playerOne;
        totalMoves = 0;
        gameOver = false;
        aiTurn = false;
        startGame();
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
            } else if (difficulty === "medium" && playerOne === aiPlayer) {
                let currentBoardState = getCurrentState(board.gameBoard);
                let bestMove = minimax(currentBoardState, playerOne, 0, 3);
                playMove(bestMove.index);
            } else if (difficulty === "medium" && playerTwo === aiPlayer) {
                let currentBoardState = getCurrentState(board.gameBoard);
                let bestMove = minimax(currentBoardState, playerTwo, 0, 3);
                playMove(bestMove.index);
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

    function minimax(newBoard, player, depth, depthLimit = 99) {
        const availCells = getEmptyCells(newBoard);
        if (depth === depthLimit && playerTwo != aiPlayer) {
            return { score: depth - 10 }
        } else if (depth === depthLimit && playerOne != aiPlayer) {
            return { score: 10 - depth }
        } else if (board.checkWin(newBoard, playerTwo) && playerTwo != aiPlayer) {
            return { score: depth - 10 };
        } else if (board.checkWin(newBoard, playerOne) && playerOne != aiPlayer) {
            return { score: depth - 10 };
        } else if (board.checkWin(newBoard, aiPlayer)) {
            return { score: 10 - depth };
        } else if (availCells.length === 0) {
            return { score: 0 };
        }

        let moves = [];

        for (let i = 0; i < availCells.length; i++) {
            let move = {};
            move.index = newBoard[availCells[i]];
            newBoard[availCells[i]] = player.mark;

            if (player === playerOne) {
                let result = minimax(newBoard, playerTwo, depth + 1, depthLimit);
                move.score = result.score;
            } else {
                let result = minimax(newBoard, playerOne, depth + 1, depthLimit);
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





