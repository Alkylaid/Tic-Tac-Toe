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
        updateBoard: updateBoard,
        checkValidMove: checkValidMove,
        checkStatus: checkStatus,
        getBoard: getBoard,
    };
})();

const playerFactory = (mark) => {

    return { mark };
}

const playerOne = playerFactory("X");

const playerTwo = playerFactory("O");

const controller = (() => {
    let currentPlayer = playerOne;
    let totalMoves = 0;
    const container = document.querySelector('.container');

    const squares = document.querySelectorAll(".grid-item");

    (function render() {
        squares.forEach((square, index) => {
            square.addEventListener('click', () => {
                playMove(index);
            })
        }
        )
    })();

    function playMove(index) {
        if (board.checkValidMove(index)) {
            board.updateBoard(index, currentPlayer.mark)
            squares[index].innerHTML = currentPlayer.mark;
            totalMoves++;
            if (board.checkStatus() === currentPlayer || board.checkStatus() === "Draw") {
                board.checkStatus() === currentPlayer ? declareWinner(currentPlayer) : declareWinner("Draw");
            }
            currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;
            

        }

    }

    function getTotalMoves() {
        return totalMoves;
    }

    function declareWinner(winner) {
        const score = document.createElement('div');
        score.setAttribute('id', 'score');
        if (winner === "Draw") {
            score.innerHTML = "DRAW!";
        } else {
            score.innerHTML = `The winner is ${currentPlayer.mark}`
        }
        container.prepend(score);
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    return {getTotalMoves, getCurrentPlayer }
})();





