const displayController = (function() {
    document.querySelectorAll('.modeBtn').forEach(button => button.addEventListener('click', handleModeToForm))

  function handleModeToForm() {
      handleGameModeLeave();
      const dataForm = parseInt(this.dataset.form)
      const form = document.querySelector(`form[data-form="${dataForm}"]`)
      handleFormEnter(form)
  }

  function handleGameModeEnter() {
    const div = document.querySelector('.gameMode');
    div.classList.add('enter')
    setTimeout(() => {
        div.classList.add('enter-active');
    },501);
  }

  function handleGameModeLeave() {
      const div = document.querySelector('.gameMode')
      div.classList.remove('enter-active')
      div.classList.remove('enter');

  }

  function handleFormEnter(form) {
    form.classList.add('enter')
    setTimeout(() => {
        form.classList.add('enter-active');
    },501);
  }

  function handleFormLeave(form) {
    form.classList.remove('enter-active')
    form.classList.remove('enter');
  }

  function handleFormToBoard(form) {
    handleFormLeave(form)
    handleBoardEnter();
  }

  function handleBoardEnter() {
      const board = document.querySelector('.tictactoe');
      board.classList.add('enter');
      setTimeout(() => {
        board.classList.add('enter-active');
      },501);
  }

  function handleBoardLeave() {
    const board = document.querySelector('.tictactoe');
    board.classList.remove('enter-active');
    board.classList.remove('enter');
  }

  function handleBoardToResult() {
      handleBoardLeave();
      handleResultEnter();
  }

  function handleResultToBoard() {
      handleResultLeave();
      handleBoardEnter();
  }

  function handleResultToGameMode() {
      handleResultLeave();
      handleGameModeEnter();
  }

  function handleResultEnter() {
      const resultScreen = document.querySelector('.resultScreen');
      resultScreen.classList.add('enter');
      setTimeout(() => {
        resultScreen.classList.add('enter-active');
      },501);
  }

  function handleResultLeave() {
    const resultScreen = document.querySelector('.resultScreen');
    resultScreen.classList.remove('enter-active');
    resultScreen.classList.remove('enter');
  }

  return {
      handleResultToGameMode,
      handleResultToBoard,
      handleModeToForm,
      handleBoardToResult,
      handleFormToBoard,
  }

  }());

const gameBoard = (function() {
    const boardNode = document.querySelector('.tictactoe');
    let board = ["", "", "", "", "", "", "", "", ""];
    let gameEnded = false

    function resetBoard() {
        board = ["", "", "", "", "", "", "", "", ""]
        gameEnded = false
        const squares = boardNode.querySelectorAll('.square')
        squares.forEach(square => square.textContent = '')
    }

    document.querySelector('.rematch').addEventListener('click', resetBoard)
    document.querySelector('.mainMenu').addEventListener('click', resetBoard)
    
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
        console.log('is ', gameFlow.getWhoMoves(), 'turn')
        if(!gameFlow.getGameStatus()) return
        if(gameEnded) return
        const player = gameFlow.getWhoMoves()
        const square = this;
        const index = parseInt(this.dataset.idx);
        const mark = player.marker
        square.textContent = mark;
        const text = this.textContent;
        board[index] = text;
        gameFlow.addTurn();
        const result = checkForAWin(board);
        if(result !== 'Tie' && result !== null) {
        gameEnded = true;
        resultScreen(`${result} Wins!!!`, 1, player);
        }
        if(result === 'Tie') {
        gameEnded = true;
        resultScreen(`It's a Tie`, 0, player);
        }
        if(result === null) {
            gameFlow.nextTurn();
        }
        if(result === null && gameFlow.getPlayers()[1].isComp) {
            makeCompMove();
        }
    }

    function makeCompMove() {
        if(!gameFlow.getGameStatus()) return
        if(gameEnded) return
        const player = gameFlow.getWhoMoves()
        const doRandom = Math.random() * 100 > parseInt(gameFlow.getDificulty());
        let bestScore = -Infinity;
        let bestMoveIndex;

        const mark = player.marker;
        
        if(!doRandom) {

        board.map((square, index) => {
            if(square !== '') return
            board[index] = mark
            
            let score = minimax(board, 0, false);

            board[index] = ''

            if (score > bestScore) {
                bestScore = score
                bestMoveIndex = index
            }
        })

        board[bestMoveIndex] = mark

        const squareNode = document.querySelector(`.square[data-idx='${bestMoveIndex}']`)
        squareNode.textContent = mark;

        } else {
            const squares = Array.from(document.querySelectorAll('.square'))
            const freeSquares = squares.filter(square => square.textContent === '')
            const index = Math.floor(Math.random() * freeSquares.length)
            const square = freeSquares[index]
            square.textContent = mark
            const boardIdx = square.dataset.idx
            board[boardIdx] = mark
        }

        gameFlow.addTurn()
        const result = checkForAWin(board)
        if(result === null) {
            gameFlow.nextTurn();
        }
        if(result !== 'Tie' && result !== null) {
        gameEnded = true
        resultScreen(`${result} Wins!!!`, 1, player)
        }
        if(result === 'Tie') {
        gameEnded = true
        resultScreen(`It's a Tie`, 0, player)
        } 
    }

    function checkForAWin(final) {

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

       if(win === null && final.filter(square => square === '').length < 1) return tie;
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
        let result = checkForAWin(board)
        if (result !== null) {
            if(gameFlow.getPlayers()[1].marker === 'O') {
                return results[result] * -1
            } else {
                return results[result]
            }
            
        }

        if(isMaximixing) {
            
            let bestScore = -Infinity

            board.map((square, index) => {
            if(square !== '') return
            board[index] = gameFlow.getPlayers()[1].marker
            let score = minimax(board, depth + 1, false);
            board[index] = ''
            bestScore = Math.max(score, bestScore)
        })
        return bestScore
        } else {
            
            let bestScore = Infinity

            board.map((square, index) => {
            if(square !== '') return
            board[index] = gameFlow.getPlayers()[0].marker
            let score = minimax(board, depth + 1, true);
            board[index] = ''
 
            bestScore = Math.min(score, bestScore)
            });
        return bestScore 
        }
    }

    function resultScreen(text, points, player) {
        displayController.handleBoardToResult()
        const resultP = document.querySelector('.result')
        const scoreP = document.querySelector('.score')
        scoreP.textContent = 'Scores: '
        gameFlow.addScore(player, points)
        scoreP.textContent += gameFlow.getPlayers().map(player => {
            return `${player.name} : ${player.score} `
        }).join('')
        resultP.textContent = text
        console.log(player, points)
    }

    return {
        getBoard,
        displayBoard,
        getColumns,
        getRows,
        getDiagonals,
        makeCompMove,
        minimax,
        board,
    }
}())

const gameFlow = (function() {
    let players = [];
    let turns = 0;
    let gameStarted = false
    let dificulty;
    let turnToMove;

    function getWhoMoves() {
        return turnToMove
    }

    function nextTurn() {
        console.log(turnToMove, ' Turn ended')
        const player = players.find(player => player.marker !== turnToMove.marker)
        turnToMove = player
        console.log(turnToMove, ' Turn starts')
    }

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

    function getDificulty() {
        return dificulty;
    }

    function changeMark() {
        players.map(player => player.marker === 'X' ? player.marker = 'O' : player.marker = 'X')
        return
    }

    function addScore(player, points) {
        player.score += points
    }

    document.playerForm.addEventListener('submit', function(e) {
        if(gameStarted) return
        e.preventDefault();
        const name = this.player1.value
        const mark = this.marker.value
        const other = mark === 'X' ? 'O' : 'X';
        const player1 = playerFactory(name, mark, 0, false);
        const comp = playerFactory('Comp', other, 0, true);
        dificulty = this.Dificulty.value;
        addPlayer(player1);
        addPlayer(comp)
        gameStarted = true;
        displayController.handleFormToBoard(this)
        turnToMove = players.find(player => player.marker === 'X')
        if(other === 'X') gameBoard.makeCompMove();
    })

    document.twoPlayersForm.addEventListener('submit', function(e) {
        if(gameStarted) return
        e.preventDefault();
        const name1 = this.player1.value;
        const name2 = this.player2.value;
        const player1 = playerFactory(name1, 'X', 0, false);
        const player2 = playerFactory(name2, 'O', 0, false);
        addPlayer(player1);
        addPlayer(player2);
        turnToMove = players[0];
        gameStarted = true;
        displayController.handleFormToBoard(this);
    })
    
    
    document.querySelector('.rematch').addEventListener('click', function() {
        displayController.handleResultToBoard()
        gameStarted = true;
        turns = 0
        changeMark();
        turnToMove = players.find(player => player.marker === 'X')
        if(players[1].isComp && players[1].marker === 'X') gameBoard.makeCompMove();
    })

    document.querySelector('.mainMenu').addEventListener('click', function() {
        gameStarted = false;
        players = [];
        turns = 0
        dificulty = undefined;
        turnToMove = undefined;
        displayController.handleResultToGameMode();
    })

    return {
        getTurns,
        addTurn,
        getPlayers,
        getGameStatus,
        getDificulty,
        addScore,
        nextTurn,
        getWhoMoves,
    }
}())

const playerFactory = (name, marker, score, isComp = false) => {
    return {
        name,
        marker,
        score,
        isComp,
    };
  };

  gameBoard.displayBoard();
