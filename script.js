const board = (() => {
    let gameBoard = [' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' ',]

    function updateBoard(index, mark) {
        gameBoard[index] = mark;
    }

    function getBoard(index) {
        return gameBoard[index];
    }

    function clearBoard() {
        gameBoard.fill(' ');
    }


    function checkValidMove(index) {
        return (gameBoard[index] === ' ');
    }

    function checkStatus() {

        if (gameBoard[0] === gameBoard[1] && gameBoard[0] === gameBoard[2] && gameBoard[0] != ' ') {
            return controller.getCurrentPlayer();
        }
        if (gameBoard[3] === gameBoard[4] && gameBoard[3] === gameBoard[5] && gameBoard[3] != ' ') {
            return controller.getCurrentPlayer();
        }
        if (gameBoard[6] === gameBoard[7] && gameBoard[6] === gameBoard[8] && gameBoard[6] != ' ') {
            return controller.getCurrentPlayer();
        }
        //check columns
        if (gameBoard[0] === gameBoard[3] && gameBoard[0] === gameBoard[6] && gameBoard[0] != ' ') {
            return controller.getCurrentPlayer();
        }
        if (gameBoard[1] === gameBoard[4] && gameBoard[1] === gameBoard[7] && gameBoard[1] != ' ') {
            return controller.getCurrentPlayer();
        }
        if (gameBoard[2] === gameBoard[5] && gameBoard[2] === gameBoard[8] && gameBoard[2] != ' ') {
            return controller.getCurrentPlayer();
        }

        //check diagonals
        if (gameBoard[0] === gameBoard[4] && gameBoard[0] === gameBoard[8] && gameBoard[0] != ' ') {
            return controller.getCurrentPlayer();
        }
        if (gameBoard[2] === gameBoard[4] && gameBoard[2] === gameBoard[6] && gameBoard[2] != ' ') {
            return controller.getCurrentPlayer();
        }

        if (controller.getTotalMoves() === 9) {
            return "Draw";
        }



    }
    return {
        updateBoard,
        checkValidMove,
        checkStatus,
        clearBoard,
        getBoard
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
    //const container = document.querySelector('.container');
    const header = document.getElementById('header');
    const modal = document.getElementById("modal");

    const squares = document.querySelectorAll(".grid-item");

    const markerButtons = document.querySelectorAll(".player-marker");

    markerButtons.forEach((button) => {
        button.addEventListener('click', () => {
            startGame(button.value);
        })
    })

    function render() {
        squares.forEach((square, index) => {
            square.addEventListener('click', function boxClick() {
                if (!aiTurn && !gameOver){
                    if(board.checkValidMove(index)) {
                        playMove(index);
                        aiTurn = true;
                    }
                if(!gameOver){
                setTimeout(aiPlaysEasy, 300);
                }
                }
                board.getBoard(index) === undefined ? square.innerHTML = " " : square.innerHTML = `${board.getBoard(index)}`
            })
            
        }
        )
    };


    function playMove(index) {
            board.updateBoard(index, currentPlayer.mark)
            squares[index].innerHTML = currentPlayer.mark;
            totalMoves++;
            if (board.checkStatus() === currentPlayer || board.checkStatus() === "Draw") {
                board.checkStatus() === currentPlayer ? declareWinner(currentPlayer) : declareWinner("Draw");
                gameOver = true;
            }
            currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;


        

    }

    function getTotalMoves() {
        return totalMoves;
    }

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

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function reset() {
        board.clearBoard();

        render();
        if (document.contains(document.getElementById('score'))) {
            score.remove();
        }
        currentPlayer = playerOne;
        totalMoves = 0;
    }

    function startGame(markerOption) {
        if (markerOption === "X") {
            playerOne = playerFactory("X");
            playerTwo = playerFactory("O");
            currentPlayer = playerOne;
        } else {
            playerTwo = playerFactory("X");
            playerOne = playerFactory("O");
            currentPlayer = playerTwo;
            aiTurn = true;
            aiPlaysEasy();
        }

        modal.style.display = "none";
        render();
    }

    function addMark(index) {
        board.getBoard(index) === undefined ? squares[index].innerHTML = " " : squares[index].innerHTML = `${board.getBoard(index)}`
    }
    function aiPlaysEasy() {
            if (aiTurn) {
                let index = Math.floor(Math.random() * 9);
                console.log(index)
                while (!board.checkValidMove(index)) {
                    index = Math.floor(Math.random() * 9);
                }
                    playMove(index);
                    aiTurn = false;
                   
                }
            }
        

    return { getTotalMoves, getCurrentPlayer, reset, aiPlaysEasy }
})();





