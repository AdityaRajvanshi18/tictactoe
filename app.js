//gameboard object
//player objects
//game flow controller object

const Player = (sign) => {
    this.sign = sign;

    const getSign = () =>{
        return sign;
    };

    return {getSign};
};


const gameBoard = (() => {
    const board = new Array(9);
    
    const setField = (index, sign) =>{
        board[index] = sign;
    };

    const getField = (index) => {
        return board[index]
    }

    const reset = () => {
        for (let i = 0; i < board.length; i++) {
            board[i] = "";
          }
    };

    return{setField, getField, reset};
})();

const displayController = (() => {
    const boardPieces = document.querySelectorAll(".gameboard-button");
    const resetButton = document.querySelector(".reset-button");
    const resultElement = document.querySelector("[id=result]");

    boardPieces.forEach((piece)=>
        piece.addEventListener("click", (e) => {
            if(gameController.isGameOver() || gameBoard.getField === "X" || gameBoard.getField === "O" ) {return;}
            gameController.playRoundHuman(parseInt(e.target.dataset.index));
            
            if(gameController.checkPlay()){
                gameController.playRoundComputer();
            }
            updateGameboard();
        })
    );

    const resetGame = () => {
        gameBoard.reset();
        gameController.reset();
        updateGameboard();
        location.reload();
    }

    resetButton.addEventListener("click", resetGame);

    const setResultMessage = (winner) => {
        if (winner ==="Draw"){
            setResultElement("No one wins, it is a draw!");
        }
        else if(winner === "Player"){
            setResultElement("Well done, Player wins!");
        }
        else{
            setResultElement("Computer wins, try again!");
        }
    }

    const setResultElement = (message) =>{
        resultElement.textContent = message;
        resultElement.classList.add("announcement");
    }

    const updateGameboard = () => {
        for(let i = 0; i < boardPieces.length; i++){
            boardPieces[i].textContent = gameBoard.getField(i);
        }
    };

    return {setResultMessage, setResultElement};
    
})();

const gameController = (() => {
    const player1 = Player("X");
    const player2 = Player("O");
    let roundNum = 1;
    let gameOver = false;
    let isPlay = true;

    const playRoundHuman = (pieceIndex) => {
        if (typeof gameBoard.getField(pieceIndex) != "undefined" ){
            isPlay = false;
            return;
        }
        gameBoard.setField(pieceIndex, player1.getSign());
        isPlay = true;
        if(checkWinnerHuman(pieceIndex)){
            gameOver = true;
            displayController.setResultMessage("Player");
            return;
        }
        if (roundNum === 9){
            gameOver = true;
            displayController.setResultMessage("Draw");
            return;
        }
        roundNum++;
    }

    const getRandomInt = (min, max) => {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    const playRoundComputer = () => {
        if (roundNum === 9){
            gameOver = true;
            return;
        }
        compIndex = getRandomInt(0, 8);
        
        if (typeof gameBoard.getField(compIndex) === "undefined" ){
            gameBoard.setField(compIndex, player2.getSign());
            roundNum++
        }
        else{
            playRoundComputer();
        }
        if(checkWinnerComp(compIndex)){
            gameOver = true;
            displayController.setResultMessage("Computer")
            return;
        }

    }
    const checkPlay = () => {
        return isPlay;
    }

    getCurrentPlayerSign = () =>{
        return roundNum %2 === 1 ? player1.getSign() : player2.getSign();
    };

    const checkWinnerHuman = (pieceIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    
        return winConditions
            .filter((combination) => combination.includes(pieceIndex))
            .some((possibleCombination) =>
                possibleCombination.every(
                    (index) => gameBoard.getField(index) === player1.getSign()
                )
            );
    };


    const checkWinnerComp = (compIndex) => {
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
    
        return winConditions
            .filter((combination) => combination.includes(compIndex))
            .some((possibleCombination) =>
                possibleCombination.every(
                    (index) => gameBoard.getField(index) === player2.getSign()
                )
            );
    };
    
    const isGameOver = () => {
        return gameOver;
    };

    const reset = () => {
        round = 1;
        gameOver = false;
        isPlay = true;
    };
    return {playRoundHuman, playRoundComputer, checkPlay, isGameOver, reset};
})();
