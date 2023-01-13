
// Controls the start menu and form
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

        menuForm.classList.add('hidden');

        displayController.startGame(
            player1, player1Marker,
            player2, player2Marker,
            computerCheckbox.checked);
    })

    const restart = () => {
        if (displayController.getGameState() == 'game-over') {
            menuForm.reset();
            menuForm.classList.remove('hidden');
        }
    }
    return {restart}
})();


// Controls the game
const displayController = (() => {
    
    const statusDiv = document.querySelector('.status');
    const statusFirstChild = document.querySelector('.status > div > p:first-child');
    const statusLastChild = document.querySelector('.status > div > p:last-child')

    let _player1;
    let _player2;
    let _currentPlayer;

    let _gameState = 'menu';

    
    // Shows if a game is active or not
    const getGameState = () => _gameState;


    // Sets the gamestate to active and creates the players
    const startGame = (p1, p1Marker, p2, p2Marker, isComputer) => {
        
        if (_gameState === 'menu') {
            
            _player1 = Player(p1, p1Marker, false);
            _player2 = Player(p2, p2Marker, isComputer);

            // Keeps track of each players current placements
            _player1.tiles = [];
            _player2.tiles = [];

            _currentPlayer = _player1.getMarker() === 'X' ? _player1 : _player2;

            gameBoard.createBoard();
            _gameState = 'active';

            updateStatusDiv(_gameState, _currentPlayer);
        }
    }

    // Shows who's turn it is, or if the game is over
    const updateStatusDiv = (state, player) => {

        statusFirstChild.className = "";
        statusLastChild.className = "";
        statusLastChild.innerHTML = "";

        if (state === 'draw') {
            statusFirstChild.innerHTML = "It's a draw";
            restartButton();
            return
        }

        const name = player.getName();
        const color = player.getColor();
        
        statusFirstChild.classList.add(color);

        if (state === 'active') {

            statusFirstChild.innerHTML = `${name}'s&nbsp;`
            statusLastChild.innerHTML = 'turn...'

        } else if (state === 'victory') {
            statusFirstChild.innerHTML = `${name} wins!`
            restartButton();
        }
    }


    // Passes the current player, and sets the other player as the next player
    const makeMove = (index) => {
        _currentPlayer.tiles.push(index);
        let move = _currentPlayer;
        _currentPlayer = _currentPlayer == _player1 ? _player2 : _player1;

        _checkBoard(move)

        if (_gameState === 'active') {
            updateStatusDiv(_gameState, _currentPlayer)
        }

        return move;
    }

    // Checks the tiles for a win or a draw
    const _checkBoard = (player) => {
        
        // An array to see if all the tiles are used
        let combinedTiles = [..._player1.tiles, ..._player2.tiles];

        // Winning patterns
        const threeInARow = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];

        for (let i = 0; i < threeInARow.length; i++) {
            if (threeInARow[i].every(element => player.tiles.includes(element))) {
                _gameState = 'game-over';
                return updateStatusDiv('victory', player);
            }
        }

        if (combinedTiles.length === 9) {
            _gameState = 'game-over';
            return updateStatusDiv('draw');
        }
    }

    // Creates a restart button when the game is over
    const restartButton = () => {
        const restartButton = document.createElement('button');
        restartButton.className = 'restart';
        restartButton.innerHTML = 'Play again?';

        restartButton.addEventListener('click', () => {

            statusFirstChild.className = "";
            statusLastChild.className = "";
            statusFirstChild.innerHTML = "";
            statusLastChild.innerHTML = "";

            statusDiv.removeChild(restartButton);

            gameBoard.restart();
            menu.restart();

            _gameState = 'menu';
        })

        statusDiv.appendChild(restartButton);
    }

    return {makeMove, startGame, getGameState};

})();

// Creates and updates the gameboard
const gameBoard = (() => {

    // An array which represents the gameboard
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


    // Draws the markers when called
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

    const restart = () => {
        if (displayController.getGameState() == 'game-over') {
            container.classList.remove('board');
            container.classList.add('form');

            tiles.forEach( element => container.removeChild(element));
            _gameBoard.fill("")
        }
    }
        
    return {createBoard, restart};

})();

// Factory function to create new players
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

