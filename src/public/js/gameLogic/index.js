const chessGameSocket = io('/chessGame');

class Game {

  // Creates the Game constructor
	constructor(pieces) {
		this.board = document.getElementById('board');
		this.squares = this.board.querySelectorAll('.square');
		this.pieces = pieces;
		this.turn = 'white';
		this.clickedPiece = null;
		this.allowedMoves = null;
		this.addEventListeners();
	}

	addEventListeners() {
    // Listens the events on the pieces
		this.pieces.forEach( piece => {
			piece.img.addEventListener("click", this.pieceMove.bind(this)); 
			piece.img.addEventListener("dragstart", this.pieceMove.bind(this)); 
			piece.img.addEventListener("drop", this.pieceMove.bind(this));
		});
    // Listens the events  on the squares
		this.squares.forEach( square => {
			square.addEventListener("click", this.movePiece.bind(this)); 
			square.addEventListener("dragover", (event) => {
				event.preventDefault();
			}); 
			square.addEventListener("drop", this.movePiece.bind(this)); 
		});
	}

  // Allows the movement of the pieces
  pieceMove(event) {
    // Gets the name put in the id
		const name = event.target.getAttribute('id');
    // Searches the alloweds moves
		const allowedMoves = this.getPieceAllowedMoves(event, name);
    // If there is any 
		if (allowedMoves) {
      // Gets the position of the pieces
			const position = this.getPieceByName(name).position;
      // Gets the clicked square
			const clickedSquare = document.getElementById(position);

			clickedSquare.classList.add('clicked-square');

      // Show the allowed moves with css
			allowedMoves.forEach( allowedMove => {
				if (document.body.contains(document.getElementById(allowedMove))) {
					document.getElementById(allowedMove).classList.add('allowed');		
				}	
			});
		}
		else{
      // If there is no movement clears the squares
			this.clearSquares();
		}
	}

  // Changes the turn
	changeTurn() {
		if (this.turn == 'white') {
			this.turn = 'black';
		}
		else{
			this.turn = 'white';
		}
	}

  // Gets the pieces by color
	getPiecesByColor(color) {
    // Filters the color of the pieces
		return this.pieces.filter(obj => {
		  return obj.color === color
		});
	}

  // Gets the players positions
  getPlayerPositions(color){
    // Obtains the pieces by color and returns the position
		const pieces = this.getPiecesByColor(color);
		return pieces.map( a => parseInt(a.position));
	}

  // Filters the positions
  filterPositions(positions) {
		return positions.filter(pos => {
			return pos > 10 && pos < 89
		});
	};

  // Obtains the unblocked positions
  unblockedPositions(allowedPositions = [], position, color, checking = true){
		// Sets the positions
    position = parseInt(position);
		const unblockedPositions = [];

    // If the color is white sets the positions
		if (color == 'white') {
			var myBlockedPositions = this.getPlayerPositions('white');
			var otherBlockedPositions = this.getPlayerPositions('black');
		} // If not
		else {
			var myBlockedPositions = this.getPlayerPositions('black');
			var otherBlockedPositions = this.getPlayerPositions('white');
		}
		
    // Obtains the positions if it's a pawn
		if (this.clickedPiece.hasRank('pawn')) {
      // Atacking moves
			for (const move of allowedPositions[0]) {
				if (checking && this.myKingChecked(move)) continue;
				if (otherBlockedPositions.indexOf(move) != -1) unblockedPositions.push(move);
			}
			const blockedPositions = myBlockedPositions + otherBlockedPositions;
      // Normal moves
			for (const move of allowedPositions[1]) {
				if (blockedPositions.indexOf(move) != -1) break;
				else if (checking && this.myKingChecked(move, false)) continue;
				unblockedPositions.push(move);
			}
		} // If it's not a pawn
		else{
      // Searches the unblocked positions 
			allowedPositions.forEach( allowedPositionsGroup => {
				for (const move of allowedPositionsGroup) {
					if (myBlockedPositions.indexOf(move) != -1) {
						break;
					}
					else if ( checking && this.myKingChecked(move) ) {
						continue;
					}
					unblockedPositions.push(move);
					if (otherBlockedPositions.indexOf(move) != -1) break;
				}
			});
		}
			
		return this.filterPositions(unblockedPositions);
	}

  // Obtains the allowed positions for each piece
  getPieceAllowedMoves(event, pieceName){
    // Sets the piece
		const piece = this.getPieceByName(pieceName);
    // Validates the turn
		if(this.turn == piece.color){
			this.clearSquares();
			this.setClickedPiece(piece);
			if (event.type == 'dragstart') {
				event.dataTransfer.setData("text", event.target.id);
			}

			let pieceAllowedMoves = piece.getAllowedMoves();
			if (piece.rank == 'king') {
				pieceAllowedMoves = this.getCastlingSquares(pieceAllowedMoves);
			}

			const allowedMoves = this.unblockedPositions( pieceAllowedMoves, piece.position, piece.color, true );
			this.allowedMoves = allowedMoves;
			return allowedMoves;
		} // Validates if it can be killed
		else if (this.clickedPiece && this.turn == this.clickedPiece.color && this.allowedMoves && this.allowedMoves.indexOf(piece.position) != -1) {
			this.kill(piece);
		}
		else{
			return 0;
		}
	}

  // Gets the castling squares
	getCastlingSquares(allowedMoves) {
    // Validates if its able to castle
		if ( !this.clickedPiece.ableToCastle || this.king_checked(this.turn) ) return allowedMoves;
		// Sets the two rooks
    const rook1 = this.getPieceByName(this.turn+'Rook1');
		const rook2 = this.getPieceByName(this.turn+'Rook2');
    // Validates if the rook is able to castle
		if (rook1 && rook1.ableToCastle) {
			const castlingPosition = rook1.position + 2
      // Validates if there are no pieces and if my king is not being checked
      if (
        !this.positionHasExistingPiece(castlingPosition - 1) &&
        !this.positionHasExistingPiece(castlingPosition) && !this.myKingChecked(castlingPosition, true) &&
        !this.positionHasExistingPiece(castlingPosition + 1) && !this.myKingChecked(castlingPosition + 1, true)
      )
			allowedMoves[1].push(castlingPosition);
		} // Validates if the rook is able to castle 
		if (rook2 && rook2.ableToCastle) {
			const castlingPosition = rook2.position - 1;
			if (
        !this.positionHasExistingPiece(castlingPosition - 1) && !this.myKingChecked(castlingPosition - 1, true) &&
        !this.positionHasExistingPiece(castlingPosition) && !this.myKingChecked(castlingPosition, true)    
      )
			allowedMoves[0].push(castlingPosition);
		}
		return allowedMoves;
	}

	getPieceByName(piecename) {
		return this.pieces.filter( obj => obj.name === piecename )[0];
	}

	getPieceByPos(piecePosition) {
		return this.pieces.filter(obj =>  obj.position === piecePosition )[0];
	}

	positionHasExistingPiece(position) {
		return this.getPieceByPos(position) != undefined;
	}

	setClickedPiece(piece) {
		this.clickedPiece = piece;
	}

  // Moves the pices
	movePiece(event, square='') {
    // Set the square
		square = square || event.target;
    // Validates if the square is allowed
		if (square.classList.contains('allowed')) {
      // Sets the clicked piece
			const clickedPiece = this.clickedPiece;
      // Validates id there is any
			if (clickedPiece) {
        // Sets the new position
				const newPosition = square.getAttribute('id');
        // Validates if it's a pawn or a king
				if (clickedPiece.hasRank('king') || clickedPiece.hasRank('pawn'))
					clickedPiece.changePosition(newPosition, true);
				else
					clickedPiece.changePosition(newPosition);
        // Inserts the image 
				square.append(clickedPiece.img);
				this.clearSquares();
				this.changeTurn();
        // Validates if the king is being checked
				if (this.king_checked(this.turn)) {
					if (this.king_dead(this.turn)) {
						this.checkmate(clickedPiece.color);
					}
					else{
						alert('check');
					}
				}
			}
			else{
				return 0;
			}
		}
		if (event) event.preventDefault();
	}

	kill(piece) {
		piece.img.parentNode.removeChild(piece.img);
		piece.img.className = '';

		const chosenSquare = document.getElementById(piece.position);
		this.pieces.splice(this.pieces.indexOf(piece), 1);
		this.movePiece('', chosenSquare);
	}

	castleRook(rookName) {
		const rook = this.getPieceByName(rookName);
		const newPosition = rookName.indexOf('Rook2') != -1 ? rook.position - 2 : rook.position + 3;

		this.setClickedPiece(rook);
		const chosenSquare = document.getElementById(newPosition);
		chosenSquare.classList.add('allowed');

		this.movePiece('', chosenSquare );
		this.changeTurn();
	}

	promote(pawn) {
		const queenName = pawn.name.replace('Pawn', 'Queen');
		const image = pawn.img;
		image.id = queenName;
		image.src = image.src.replace('Pawn', 'Queen');
		this.pieces.splice(this.pieces.indexOf(pawn), 1);
		this.pieces.push( new Queen(pawn.position, queenName) );
	}

	myKingChecked(pos, kill=true){
		const piece = this.clickedPiece;
		const originalPosition = piece.position;
		const otherPiece = this.getPieceByPos(pos);
		const should_kill_other_piece = kill && otherPiece && otherPiece.rank != 'king';
		piece.changePosition(pos);
		if (should_kill_other_piece) this.pieces.splice(this.pieces.indexOf(otherPiece), 1);
		if (this.king_checked(piece.color)) {
			piece.changePosition(originalPosition);
			if (should_kill_other_piece) this.pieces.push(otherPiece);
			return 1;
		}
		else{
			piece.changePosition(originalPosition);
			if (should_kill_other_piece) this.pieces.push(otherPiece);
			return 0;
		}
	}

	king_dead(color) {
		const pieces = this.getPiecesByColor(color);
		for (const piece of pieces) {
			this.setClickedPiece(piece);
			const allowedMoves = this.unblockedPositions( piece.getAllowedMoves(), piece.position, piece.color, true );
			if (allowedMoves.length) {
				this.setClickedPiece(null);
				return 0;
			}
		}
		this.setClickedPiece(null);
		return 1;
	}

	king_checked(color) {
		const piece = this.clickedPiece;
		const king = this.getPieceByName(color + 'King');
		const enemyColor = (color == 'white') ? 'black' : 'white';
		const enemyPieces = this.getPiecesByColor(enemyColor);
		for (const enemyPiece of enemyPieces) {
			this.setClickedPiece(enemyPiece);
			const allowedMoves = this.unblockedPositions( enemyPiece.getAllowedMoves(), enemyPiece.position, enemyColor, false );
			if (allowedMoves.indexOf(king.position) != -1) {
				this.setClickedPiece(piece);
				return 1;
			}
		}
		this.setClickedPiece(piece);
		return 0;
	}

	clearSquares(){
		this.allowedMoves = null;
		const allowedSquares = this.board.querySelectorAll('.allowed');
		allowedSquares.forEach( allowedSquare => allowedSquare.classList.remove('allowed') );
		const cllickedSquare = document.getElementsByClassName('clicked-square')[0];
		if (cllickedSquare) cllickedSquare.classList.remove('clicked-square');
	}

	checkmate(color){
		const endScene = document.getElementById('endscene');
		endScene.getElementsByClassName('winning-sign')[0].innerHTML = color + ' Wins';
		endScene.classList.add('show');
	}
}

const pieces = [
	new Rook(11, 'whiteRook1'),
	new Knight(12, 'whiteKnight1'),
	new Bishop(13, 'whiteBishop1'),
	new Queen(14, 'whiteQueen'),
	new King(15, 'whiteKing'),
	new Bishop(16, 'whiteBishop2'),
	new Knight(17, 'whiteKnight2'),
	new Rook(18, 'whiteRook2'),
	new Pawn(21, 'whitePawn1'),
	new Pawn(22, 'whitePawn2'),
	new Pawn(23, 'whitePawn3'),
	new Pawn(24, 'whitePawn4'),
	new Pawn(25, 'whitePawn5'),
	new Pawn(26, 'whitePawn6'),
	new Pawn(27, 'whitePawn7'),
	new Pawn(28, 'whitePawn8'),

	new Pawn(71, 'blackPawn1'),
	new Pawn(72, 'blackPawn2'),
	new Pawn(73, 'blackPawn3'),
	new Pawn(74, 'blackPawn4'),
	new Pawn(75, 'blackPawn5'),
	new Pawn(76, 'blackPawn6'),
	new Pawn(77, 'blackPawn7'),
	new Pawn(78, 'blackPawn8'),
	new Rook(81, 'blackRook1'),
	new Knight(82, 'blackKnight1'),
	new Bishop(83, 'blackBishop1'),
	new Queen(84, 'blackQueen'),
	new King(85, 'blackKing'),
	new Bishop(86, 'blackBishop2'),
	new Knight(87, 'blackKnight2'),
	new Rook(88, 'blackRook2')
];

const game = new Game(pieces);