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
        // Initialize view
        this.view.notifyBoardChanged(this.board);
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
        let aRelevantIndices = Util.generateRange(iBoardSize - this.size, iBoardSize);
        this._move(aRelevantIndices, this.size, (a, b) => a - b);
    }

    moveUp() {
        let aRelevantIndices = Util.generateRange(0, this.size);
        this._move(aRelevantIndices, this.size, (a, b) => a + b);
    }

    moveRight() {
        let iGameSize = this.size;
        let aRelevantIndices = Util.generateRange(0, iGameSize).map(i => iGameSize*(i + 1) - 1);
        this._move(aRelevantIndices, 1, (a, b) => a - b);
    }

    moveLeft() {
        let iGameSize = this.size;
        let aRelevantIndices = Util.generateRange(0, iGameSize).map(i => i*iGameSize);
        this._move(aRelevantIndices, 1, (a, b) => a + b);
    }

    _move(aStartIndices, iStep, fnOperation) {
        for (let i = 0; i < aStartIndices.length; i++) {
            let currIndex = aStartIndices[i];
            let aRelevantIndices = [];
            for (let j = 0; j < this.size; j++) {
                aRelevantIndices.push(fnOperation(currIndex, j*iStep))
            }

            for (let j = 0; j < aRelevantIndices.length; j++) {
                let currIndex = aRelevantIndices[j];
                if (!this.board[currIndex]) {
                    for (let k = j + 1; k < aRelevantIndices.length; k++) {
                        let nextIndex = aRelevantIndices[k];
                        if (this.board[nextIndex]) {
                            this.board[currIndex] = this.board[nextIndex];
                            this.board[nextIndex] = null;
                            break;
                        }
                    }
                }
            }

            for (let j = 0; j < aRelevantIndices.length - 1; j++) {
                let currIndex = aRelevantIndices[j];
                let nextIndex = aRelevantIndices[j+1];
                if (!this.board[currIndex]) continue;
                if (!this.board[nextIndex]) continue;
                if (this.board[currIndex].isEqual(this.board[nextIndex])) {
                    this.board[currIndex].merge(this.board[nextIndex]);
                    this.board[nextIndex] = null;
                    this.score += this.board[currIndex].number;
                }
            }

            for (let j = 0; j < aRelevantIndices.length; j++) {
                let currIndex = aRelevantIndices[j];
                if (!this.board[currIndex]) {
                    for (let k = j + 1; k < aRelevantIndices.length; k++) {
                        let nextIndex = aRelevantIndices[k];
                        if (this.board[nextIndex]) {
                            this.board[currIndex] = this.board[nextIndex];
                            this.board[nextIndex] = null;
                            break;
                        }
                    }
                }
            }
        }
        this.view.notifyBoardChanged(this.board);
        this._placeRandomTile(); // Do not always place a new tile. If nothing has been moved, skip the new tile
    }

    _placeTile(oTile, iPosition) {
        this.board[iPosition] = oTile;
        this.view.notifyBoardPositionChanged(iPosition, oTile.number);
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