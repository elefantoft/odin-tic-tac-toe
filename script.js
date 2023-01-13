const menu = (() => {
    const menuForm = document.getElementById('menu-form')
    const computerCheckbox = document.getElementById('computer');
    const player2Input = document.getElementById('player2');

    
    const x1 = document.getElementById('x1')
    const o1 = document.getElementById('o1');
    const x2 = document.getElementById('x2');
    const o2 = document.getElementById('o2');

    
    // Listens for "play against computer?"
    computerCheckbox.addEventListener('change', () => {
        player2Input.disabled = computerCheckbox.checked;
        player2Input.innerHTML = "";
        if (computerCheckbox.checked) {
            player2Input.value = "";
        }
    })

    
    // Makes player 2 have the opposite marker of player 1
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
    
    
    menuForm.addEventListener('submit', event => {
        
        // Prevent form submit
        event.preventDefault();

        const player1 = menuForm.elements.player1.value ?
            menuForm.elements.player1.value : 'Player 1';
        const player1Marker = menuForm.elements.marker1.value;

        const player2 = menuForm.elements.player2.value ?
            menuForm.elements.player2.value : 'Player 2';
        const player2Marker = menuForm.elements.marker2.value;

        // Hides the form
        menuForm.classList.add('hidden');

        displayController.startGame(
            player1, player1Marker,
            player2, player2Marker,
            computerCheckbox.checked);
    })
})();

const displayController = (() => {
    
    let _player1;
    let _player2;
    let _currentPlayer;
    let _move;

    let _gameState = 'menu';

    
    // Shows if a game is active or not
    const getGameState = () => _gameState;


    // Sets the gamestate to active and creates the players
    const startGame = (p1, p1Marker, p2, p2Marker, isComputer) => {
        
        if (_gameState === 'menu') {
            
            _player1 = Player(p1, p1Marker, false);
            _player2 = Player(p2, p2Marker, isComputer);

            _player1.tiles = [];
            _player2.tiles = [];

            _currentPlayer = _player1.getMarker() === 'X' ? _player1 : _player2;

            gameBoard.createBoard();
            _gameState = 'active';
        }
    }

    // Passes the current player, and sets the other player as the next player
    const makeMove = (index) => {
        _currentPlayer.tiles.push(index);
        let move = _currentPlayer;
        _currentPlayer = _currentPlayer == _player1 ? _player2 : _player1;
        _checkBoard(move)
        return move;
    }

    const _checkBoard = (player) => {
        
        let combinedTiles = [..._player1.tiles, ..._player2.tiles];

        const threeInARow = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        for (let i = 0; i < threeInARow.length; i++) {
            if (threeInARow[i].every(element => player.tiles.includes(element))) {
                return _gameOver('victory', player);
            }
        }

        if (combinedTiles.length === 9) {
            return _gameOver('draw');
        }
    }

    const _gameOver = (state, player) => {

        _gameState = 'game-over';

        const container = document.getElementById('container');

        const gameOverDiv = document.createElement('div');
        gameOverDiv.className = 'game-over';

        if (state === 'victory') {
            gameOverDiv.innerHTML = `${player.getName()} wins!`
        } else if (state === 'draw') {
            gameOverDiv.innerHTML = "It's a draw!";
        }
        
        container.appendChild(gameOverDiv);

    }


    return {makeMove, startGame, getGameState};

})();

const gameBoard = (() => {

    const _gameBoard = new Array(9).fill("");
    const container = document.getElementById('container')

    let tiles;


    //Draws the initial board
    const createBoard = () => {
        if (displayController.getGameState() === 'menu') {
            container.classList.remove('form');
            container.classList.add('board');
            for (let i = 0; i < _gameBoard.length; i++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                container.appendChild(tile);
            }
            tiles = document.querySelectorAll('.tile');
            _setEventListener();
        }
    };


    // Listens for clicks on each tile
    const _setEventListener = () => {
        for (let i = 0; i < _gameBoard.length; i++) {
            tiles[i].addEventListener('click', _updateBoard(i))
        }
    };


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
            if ( isAvailable(index) && displayController.getGameState() === 'active' ) {
                let player = displayController.makeMove(index);
                _gameBoard[index] = player.getMarker();

                // Sets the marker color
                tiles[index].classList.add(player.getColor());

                drawBoard();
            }
        }
    } 
        
    return {createBoard};

})();

const Player = (playerName, playerMarker, isComputer) => {
    const name = isComputer ? 'Computer' : playerName;

    let markerColor;

    if (playerMarker === 'X') {
        markerColor = 'green'
    } else {
        markerColor = 'red'
    }

    const getName = () => name;
    const getMarker = () => playerMarker;
    const getColor = () => markerColor;

    return {getName, getMarker, getColor};
}

