const gameboard = (() => {
    let board = [' ', ' ', ' ',
                ' ', ' ', ' ',
                ' ', ' ', ' ',]

    function updateBoard(index, mark) {
        board[index] = mark;
    }
    
    function checkMove(index) {
        return (board[index] === ' ');
    }

    function checkStatus() {

        if (board[0] === board[1] && board[0] === board[2] && board[0] != ' ') {
            controller.declareWinner(controller.getCurrentPlayer());
        }
        if (board[3] === board[4] && board[3] === board[5] && board[3] != ' ') {
            controller.declareWinner(controller.getCurrentPlayer());
        }
        if (board[6] === board[7] && board[6] === board[8] && board[6] != ' ') {
            controller.declareWinner(controller.getCurrentPlayer());
        }
        //check columns
        if (board[0] === board[3] && board[0] === board[6] && board[0] != ' ') {
            controller.declareWinner(controller.getCurrentPlayer());
        }
        if (board[1] === board[4] && board[1] === board[7] && board[1] != ' ') {
            controller.declareWinner(controller.getCurrentPlayer());
        }
        if (board[2] === board[5] && board[2] === board[8] && board[2] != ' ') {
            controller.declareWinner(controller.getCurrentPlayer());
        }

        //check diagonals
        if (board[0] === board[4] && board[0] === board[8] && board[0] != ' ') {
            controller.declareWinner(controller.getCurrentPlayer());
        }
        if (board[2] === board[4] && board[2] === board[6] && board[2] != ' ') {
            controller.declareWinner(controller.getCurrentPlayer());
        }

        if (controller.getTotalMoves() === 9) {
            controller.declareWinner("Draw");
        }



    }
    return {
        updateBoard: updateBoard,
        checkMove: checkMove,
        checkStatus: checkStatus,
    };
})();

const playerFactory = (mark) => {

    return {mark};
}

const playerOne = playerFactory("X");

const playerTwo = playerFactory("O");

const controller = (() => {
    let currentPlayer = playerOne;
    let totalMoves = 0;
    const squares = document.querySelectorAll(".grid-item");

    function playGame() {
    squares.forEach((square, index) => {
        square.addEventListener('click', () => {
        if(gameboard.checkMove(index)) {
            playMove(square, index);}
        else {
            alert("Pick another move");
        }
    })});
}

    function playMove(square, index) {
        square.innerHTML = currentPlayer.mark;
        gameboard.updateBoard(index, currentPlayer.mark);
        totalMoves++;
        gameboard.checkStatus();
        currentPlayer === playerOne ? currentPlayer = playerTwo : currentPlayer = playerOne;}
    


    function declareWinner(winner) {
        
        if (winner === playerOne) {
            alert("You won");
        } else if (winner === playerTwo) {
            alert("The computer won");
        } else if (totalMoves === 9){
            alert("It's a draw!");
        }
    }

    function getCurrentPlayer() {
        return currentPlayer;
    }

    function getTotalMoves() {
        return totalMoves;
    }

    playGame();
    return {getCurrentPlayer: getCurrentPlayer, getTotalMoves: getTotalMoves, declareWinner: declareWinner}

})();





