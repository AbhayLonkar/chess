document.addEventListener('DOMContentLoaded', ()=> {
    let board = null;
    const game = new Chess();
    const moveHistory = document.getElementById('move-history')
    let moveCount = 1
    let userColor = "w"


    const makeRandomMove = ()=> {
      const possibleMove = game.moves();
      
      if(game.game_over()) {
        alert("Checkmate!")
      } else {
        const randomId = Math.floor(Math.random() * possibleMove.length);
        const move = possibleMove[randomId];
        game.move(move);
        board.position(game.fen())
        recordMove(move,moveCount);   
        moveCount++;
      }
    };

    const recordMove = (move, count) => {
        const formatedMove = count % 2?  `${Math.ceil(count/2)}. ${move}`  : `${move} -` ;
        moveHistory.textContent += formatedMove + " ";
        moveHistory.scrollTop = moveHistory.scrollHeight;
    };


    const onDragStart = (source, piece) => {
        return !game.game_over() &&  piece.search(userColor) === 0;
    }

    const onDrop = (source, target) => {
        const move = game.move({
            from: source,
            to: target,
            promotion : "q"
        });


    if( move === null){
        return "snapback"
    }

    window.setTimeout(makeRandomMove, 250);
    recordMove(move.san, moveCount)
    moveCount++;

    };

    // Function to handle the end of the game piece
    const onSnapEnd = () => {
        board.position(game.fen());
    };

    const boardConfig = {
        showNotation: true,
        draggable: true,
        position: 'start',
        onDragStart,
        onDrop,
        onSnapEnd,
        moveSpeed: 'fast',
        snapBackSpeed: 500,
        snapSpeed: 100,
    };

    board = Chessboard('board', boardConfig)
    
    document.querySelector('.play-again').addEventListener('click', () => {
        game.reset();
        board.start();
        moveHistory.textContent = ""
        moveCount = 1
        userColor = "w" 
    })

    document.querySelector('.set-pos').addEventListener('click', () => {
        const fen = prompt("Enter the notation for the desired position!")
        if(fen !== null) {
            if(game.load(fen)) {
                board.position(fen);
                moveHistory.textContent = "";
                moveCount = 1;
                userColor = "w"
            } else {
                alert("Invalid FEN notation. Please try again.")
            }
        }
    })

    document.querySelector('.flip-board').addEventListener('click', () => {
        board.flip();
        makeRandomMove();
        userColor = userColor === "w" ? "b":"w";
    })


});