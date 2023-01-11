const menu = (() => {
    const computerCheckbox = document.getElementById('computer');
    const player2Input = document.getElementById('player2');

    const x1 = document.getElementById('x1')
    const o1 = document.getElementById('o1');
    const x2 = document.getElementById('x2');
    const o2 = document.getElementById('o2');


    computerCheckbox.addEventListener('change', () => {
        player2Input.disabled = computerCheckbox.checked;
        player2Input.innerHTML = "";
        if (computerCheckbox.checked) {
            player2Input.value = "";
        }
    })

    x1.addEventListener('change', (e) => {
        if (e.target.checked) {
            o2.checked = true;
        }
    })

    o1.addEventListener('change', (e) => {
        if (e.target.checked) {
            x2.checked = true;
        }
    })
    
})();

const displayController = (() => {
    
    const container = document.getElementById('container');

    let _gameState = 'menu';
    
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

const gameBoard = () => {

    const _gameBoard = new Array(9).fill("");
    const container = document.getElementById('container')

    //Draws the initial board
    const createBoard = (() => {
        container.className = 'board';
        for (let i = 0; i < _gameBoard.length; i++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            container.appendChild(tile);
        }
    })();

    const tiles = document.querySelectorAll('.tile');

    // Returns true if the tile hasn't been used
    const isAvailable = (index) => { return (_gameBoard[index] === "") }


    // Draws the board when called
    const drawBoard = () => {
        for (let i = 0; i < _gameBoard.length; i++) {
            tiles[i].innerHTML = _gameBoard[i];
        }
    }

    // Updates the array index with the player's marker
    const _updateBoard = (index) => {
        return function() {
            if ( isAvailable(index) ) {
                let marker = displayController.makeMove();
                _gameBoard[index] = marker;
                drawBoard();

                // Checks for draw or victory
                _gameOver(marker);
            }
        }
    } 
    
    // Listens for clicks on each tile
    const _setEventListener = (() => {
        for (let i = 0; i < _gameBoard.length; i++) {
            tiles[i].addEventListener('click', _updateBoard(i))
        }
    })();

    const _gameOver = (player) => {
        
        const threeInARow = (player, tile1, tile2, tile3) => {
            return (_gameBoard[tile1] === player && _gameBoard[tile2] === player && _gameBoard[tile3] === player)
        }

        if (// Check rows
            threeInARow(player, 0, 1, 2) || threeInARow(player, 3, 4, 5) || threeInARow(player, 6, 7, 8)

            // Check columns
            || threeInARow(player, 0, 3, 6) || threeInARow(player, 1, 4, 7) || threeInARow(player, 2, 5, 8)

            // Check diagonals
            || threeInARow(player, 0, 4, 8) || threeInARow(player, 2, 4, 6)) {
                console.log(`${player} wins!`)
        } else if (!_gameBoard.includes("")) {
            console.log("It's a draw!")
        }
    }
        
    return { tiles, drawBoard, _gameBoard }

}


