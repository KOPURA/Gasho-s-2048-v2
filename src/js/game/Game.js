import { Util } from './Util.js';
import { Tile } from './Tile.js';
import { GameView } from './view/View.js';
import { TransitionMap } from './transition/TransitionMap.js';

export class Game {

    constructor(iGameSize) {
        this._size  = iGameSize; // 4x4
        this._score = 0;
        this._view  = new GameView(iGameSize);

        this.initialize();
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

    get isOver() {
        return this._isOver;
    }

    set isOver(bIsOver) {
        this._isOver = bIsOver;
        if (this._isOver) {
            this.view.notifyGameOver();
        } else {
            this.view.notifyNewGame();
        }
    }

    initialize() {
        // Initialize model
        this.board = Array(this.size * this.size).fill(null);
        this.score = 0;
        this.isOver = false;

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
        if (this.isOver) return;

        let oTransitionMap = new TransitionMap(this.size);
        for (let i = 0; i < aStartIndices.length; i++) {
            let currIndex = aStartIndices[i];
            let aRelevantIndices = Util.generateRange(0, this.size).map(x => fnOperation(currIndex, x*iStep));

            // First merge the tiles, which can be merged
            for (let j = 0; j < this.size - 1; j++) {
                let currIndex = aRelevantIndices[j];
                if (!this.board[currIndex]) continue;

                let aNextIndices = Util.generateRange(j + 1, this.size).map(x => aRelevantIndices[x]);
                let nextIndex = Util.first(aNextIndices, x => this.board[x]); // Get the first element != null
                if (nextIndex == null) continue;

                if (this.board[currIndex].isEqual(this.board[nextIndex])) {
                    this.board[nextIndex] = null;
                    this.board[currIndex].up();
                    this.score += this.board[currIndex].number;
                    oTransitionMap.addTransition(nextIndex, currIndex, true);
                    j++; // Don't try for the next element, it is now null
                }
            }

            // Move the tiles if there exist free positions, where they can go
            for (let j = 0; j < this.size - 1; j++) {
                let currIndex = aRelevantIndices[j];
                if (this.board[currIndex]) continue;// This is not a free position, just continue

                let aNextIndices = Util.generateRange(j + 1, this.size).map(x => aRelevantIndices[x]);
                let nextElementIdx = Util.first(aNextIndices, x => this.board[x]); // Get the first element != null
                if (nextElementIdx == null) break; // Nothing to move

                this.board[currIndex] = this.board[nextElementIdx];
                this.board[nextElementIdx] = null;
                oTransitionMap.addTransition(nextElementIdx, currIndex, false);
            }
        }

        this.view.moveTiles(this.board, oTransitionMap).then(() => {
            this._placeRandomTile().then(() => {
                this.isOver = this._checkIsOver()
            });
        });
    }

    _placeTile(oTile, iPosition) {
        this.board[iPosition] = oTile;
        return this.view.notifyBoardPositionChanged(iPosition, oTile, true);
    }

    _placeRandomTile() {
        let iPos = this._generateRandomFreePosition();
        let oTile = this._generateRandomTile();
        return this._placeTile(oTile, iPos);
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

    _isFull() {
        return this.board.filter(t => !t).length === 0;
    }

    _getNeighbours(iIndex) {
        let aNeighbours = [];
        // Check tile above
        if ((iIndex - this.size) >= 0)
            aNeighbours.push(iIndex - this.size);
        // Check tile below
        if ((iIndex + this.size) < this.size * this.size)
            aNeighbours.push(iIndex + this.size);
        // Check tile on the right
        if ((iIndex + 1) % this.size) {
            aNeighbours.push(iIndex + 1);
        }
        // Check tile on the left
        if (iIndex && ((iIndex - 1) % this.size) != (this.size - 1)) {
            aNeighbours.push(iIndex - 1);
        }
        return aNeighbours;
    }

    _checkIsOver() {
        if (!this._isFull())
            return false;

        for (let i = 0; i < this.size * this.size; i++) {
            let aNeighbours = this._getNeighbours(i);
            let bHasMatchingNeighbour = aNeighbours.filter(j => this.board[i].isEqual(this.board[j])).length > 0;
            if (bHasMatchingNeighbour)
                return false;
        }

        return true;
    }
}
