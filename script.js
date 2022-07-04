const gameboard = (() => {
    let board = Array(3).fill("").map(() => Array(3));

    function updateBoard(a, b, mark) {
        board[a][b] = mark;
    }
    
    function checkMove(a, b) {
        return (board[a][b] === undefined);
    }

    function checkStatus() {
   
    }

    return {
        board,
        updateBoard: updateBoard,
        checkMove: checkMove,
    };
})();

