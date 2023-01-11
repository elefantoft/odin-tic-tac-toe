const displayController = (() => {
    const p1 = 'X'
    const p2 = 'O'

    let currentPlayer = p1

    const makeMove = () => {
        let move = currentPlayer;
        currentPlayer = currentPlayer == p1 ? p2 : p1;
        return move;
    }

    return { makeMove };

})();

const gameBoard = (() => {
    const _gameBoard = new Array(9).fill("");
    const squares = document.querySelectorAll('.container > div');

    const _updateBoardArray = (index) => {
        return function() {
            let marker = displayController.makeMove();
            _gameBoard[index] = marker;
            drawBoard();
        }
    } 

    const _setEventListener = (() => {
        for (let i = 0; i < _gameBoard.length; i++) {
            squares[i].addEventListener('click', _updateBoardArray(i))
        }
    })();

    // Draws the board when called
    const drawBoard = () => {
        for (let i = 0; i < _gameBoard.length; i++) {
            squares[i].innerHTML = _gameBoard[i];
        }
        }
        return { squares, drawBoard }
    }
)();

