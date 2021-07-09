const gameBoard = (function() {
    const boardNode = document.querySelector('.tictactoe');
    let board = ["", "", "", "", "", "", "", "", ""];
    let gameEnded = false

    function getColumns() {
        const columns = [
             [board[0], board[3], board[6]],
             [board[1], board[4], board[7]],
             [board[2], board[5], board[8]],
        ];
        return columns;
    }

    function getRows() {
        const rows = [
             [board[0], board[1], board[2]],
             [board[3], board[4], board[5]],
             [board[6], board[7], board[8]],
        ];
        return rows;
    }

    function getDiagonals() {
        const diagonals = [
             [board[0], board[4], board[8]],
             [board[2], board[4], board[6]],
        ];
        return diagonals;
    }
    
    function getBoard() {
        return board.slice()
    }

    function displayBoard() {
        board.map((square, index) => {
        boardNode.innerHTML += `
            <div data-idx="${index}" class="square square${index}">${square}</div>
            `
        }).join('')
        let squares = boardNode.querySelectorAll('.square')
        squares.forEach(square => square.addEventListener('click', makePlayerMove))
    }

    function makePlayerMove() {
        if(!gameFlow.getGameStatus()) return
        if(gameEnded) return
        const square = this;
        const index = parseInt(this.dataset.idx);
        square.textContent = gameFlow.getPlayers()[0].marker
        const text = this.textContent
        board[index] = text;
        gameFlow.addTurn()
        const result = checkForAWin()
        if(result !== 'Tie' && result !== null) {
        gameEnded = true
        console.log(result + ' df')
        }
        if(result === 'Tie') {
        gameEnded = true
        console.log(result + ' df')
        } 
        if(!gameEnded) makeRandomMove()
    }

    function makeRandomMove() {
        if(!gameFlow.getGameStatus()) return
        if(gameEnded) return
        let bestScore = -Infinity
        let bestMoveIndex;
    
        board.map((square, index) => {
            if(square !== '') return
            board[index] = 'X'
            
            let score = minimax(board, 0, false);
            board[index] = ''
 
            if (score > bestScore) {
                bestScore = score
                bestMoveIndex = index
            }
        })

        board[bestMoveIndex] = 'X'

        const squareNode = document.querySelector(`.square[data-idx='${bestMoveIndex}']`)
        squareNode.textContent = 'X';

        gameFlow.addTurn()
        const result = checkForAWin()
        if(result !== 'Tie' && result !== null) {
        gameEnded = true
        console.log(result)
        }
        if(result === 'Tie') {
        gameEnded = true
        console.log(result)
        } 
    }

    function checkForAWin() {

       let x = 'X';
       let o = 'O';
       let tie = 'Tie'
       let win = null

       getColumns()
       .map(column => {
           column.every(square => square === 'X') ? win = x : ""
           column.every(square => square === 'O') ? win = o : ""
       });
       
       if(!win) getRows()
       .map(row => {
           row.every(square => square === 'X') ? win = x : ""
           row.every(square => square === 'O') ? win = o : ""
       });

       if (!win) getDiagonals()
       .map(diagonal => {
            diagonal.every(square => square === 'X') ? win = x : ""
            diagonal.every(square => square === 'O') ? win = o : ""
       });
       if(win === null && gameFlow.getTurns() > 8) return tie;
       if(win) {
           return win
        } else {
            return null
        }

    }

    const results = {
        X: 1,
        O: -1,
        Tie: 0,
    }

    function minimax(board, depth, isMaximixing) {
        let result = checkForAWin()
        if (result !== null) { 
            return results[result]
        }

        if(isMaximixing) {
            
            let bestScore = -Infinity

            board.map((square, index) => {
            if(square !== '') return
            board[index] = 'X'
            let score = minimax(board, depth + 1, false);
            board[index] = ''
            bestScore = Math.max(score, bestScore)
        })
        return bestScore
        } else {
            
            let bestScore = Infinity

            board.map((square, index) => {
            if(square !== '') return
            board[index] = 'O'
            let score = minimax(board, depth + 1, true);
            board[index] = ''
 
            bestScore = Math.min(score, bestScore)
            });
        return bestScore 
        }
    }

    return {
        getBoard,
        displayBoard,
        getColumns,
        getRows,
        getDiagonals,
        makeRandomMove,
        minimax,
        board,
    }
}())

const gameFlow = (function() {
    let players = [];
    let turns = 0;
    let gameStarted = false

    function getTurns() {
        return turns
    }

    function addTurn() {
        turns++
    }

    function addPlayer(player) {
        if(players.length > 1) players = [];
        players.push(player)
    }

    function getPlayers() {
        return players.slice()
    }

    function getGameStatus() {
        return gameStarted;
    }

    document.playerForm.addEventListener('submit', function(e) {
        if(gameStarted) return
        e.preventDefault();
        const name = this.player1.value
        const mark = this.marker.value
        const other = mark === 'X' ? 'O' : 'X';
        const player1 = playerFactory(name, mark, false);
        const comp = playerFactory('comp', other, true);
        addPlayer(player1);
        addPlayer(comp)
        gameStarted = true;
        if(other === 'X') gameBoard.makeRandomMove(); 
    }) 

    return {
        getTurns,
        addTurn,
        getPlayers,
        getGameStatus,
    }
}())

const playerFactory = (name, marker, isComp = false) => {
    return {
        name,
        marker,
        isComp,
    };
  };

  gameBoard.displayBoard();