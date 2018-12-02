import { Util } from './Util.js';
import { Tile } from './Tile.js';
import { GameView } from './view/View.js';

export class Game {
    constructor() {
        this._size  = 4; // 4x4
        this._view  = new GameView();
        this._score = 0;
    }

    get board() {
        return this._board;
    }

    set board(aNewBoard) {
        this._board = aNewBoard;
        this.view.notifyBoardChanged(aNewBoard);
    }

    get size() {
        return this._size;
    }

    get view() {
        return this._view;
    }

    get score() {
        return this._score;
    }

    set score(iNewScore) {
        this._score = iNewScore;
        this.view.notifyScoreChanged(iNewScore);
    }

    intialize() {
        // Initialize model
        this.board = Array(this.size * this.size).fill(null);
        this.score = 0;
/*
    The game always begins with two of the 16 tiles prefilled with either:
    - two 2's
    - one 2 and one 4
    - two 4's
*/
        for (let i = 0; i < 2; i++) {
            this._placeRandomTile();
        }
    }

    moveDown() {
        let iBoardSize = this.board.length;
        let aStartIndices = Util.generateRange(iBoardSize - this.size, iBoardSize);
        this._move(aStartIndices, this.size, (a, b) => a - b);
    }

    moveUp() {
        let aStartIndices = Util.generateRange(0, this.size);
        this._move(aStartIndices, this.size, (a, b) => a + b);
    }

    moveRight() {
        let iGameSize = this.size;
        let aStartIndices = Util.generateRange(0, iGameSize).map(i => iGameSize*(i + 1) - 1);
        this._move(aStartIndices, 1, (a, b) => a - b);
    }

    moveLeft() {
        let iGameSize = this.size;
        let aStartIndices = Util.generateRange(0, iGameSize).map(i => i*iGameSize);
        this._move(aStartIndices, 1, (a, b) => a + b);
    }

    _move(aStartIndices, iStep, fnOperation) {
        let bHasBoardChanged = false;

        for (let i = 0; i < aStartIndices.length; i++) {
            let currIndex = aStartIndices[i];
            let aRelevantIndices = Util.generateRange(0, this.size).map(x => fnOperation(currIndex, x*iStep));

            // First, move the tiles if there exist free positions, where they can go
            for (let j = 0; j < this.size; j++) {
                let currIndex = aRelevantIndices[j];
                if (this.board[currIndex]) continue;// This is not a free position, just continue

                let aRange = Util.generateRange(j + 1, this.size).map(x => aRelevantIndices[x]);
                let nextElementIdx =  Util.first(aRange, x => this.board[x]); // Get the first element != null
                if (nextElementIdx == null) break; // Nothing to move

                this.board[currIndex] = this.board[nextElementIdx];
                this.board[nextElementIdx] = null;
                bHasBoardChanged = true;
            }

            for (let j = 0; j < this.size - 1; j++) {
                let currIndex = aRelevantIndices[j];
                let nextIndex = aRelevantIndices[j + 1];
                if (!this.board[currIndex]) continue;
                if (!this.board[nextIndex]) continue;

                if (this.board[currIndex].isEqual(this.board[nextIndex])) {
                    this.board[nextIndex] = null;
                    this.board[currIndex].up();
                    this.score += this.board[currIndex].number;
                    bHasBoardChanged = true;

                    // Move the remaining elements after the merge
                    for (let k = j + 1; k < aRelevantIndices.length - 1; k++) {
                        currIndex = aRelevantIndices[k];
                        nextIndex = aRelevantIndices[k + 1];
                        this.board[currIndex] = this.board[nextIndex]
                        this.board[nextIndex] = null;
                    }
                }
            }
        }

        if (bHasBoardChanged) {
            this.view.notifyBoardChanged(this.board);
            this._placeRandomTile();
        }
    }

    _placeTile(oTile, iPosition) {
        this.board[iPosition] = oTile;
        this.view.notifyBoardPositionChanged(iPosition, oTile.number, true);
    }

    _placeRandomTile() {
        let iPos = this._generateRandomFreePosition();
        let oTile = this._generateRandomTile();
        this._placeTile(oTile, iPos);
    }

    _generateRandomTile() {
        let iNumber = Util.generate2or4();
        let oTile = new Tile(iNumber);

        return oTile;
    }

    _generateRandomFreePosition() {
        let iBoardSize = this.board.length;
        let iFreeIndices = Util.generateRange(0, iBoardSize).filter(i => !this.board[i]);
        return Util.randomPick(iFreeIndices);
    }
}