import { Util } from './Util.js';
import { Tile } from './Tile.js';
import { GameView } from './view/View.js';

export class Game {
    constructor() {
        this._size = 4; // 4x4
        this._view = new GameView();
    }

    get board() {
        return this._board;
    }

    get size() {
        return this._size;
    }

    get view() {
        return this._view;
    }

    intialize() {
        // Initialize model
        this._board = Array(this.size * this.size).fill(null);
        // Initialize view
        this.view.intialize();
/*
    The game always begins with two of the 16 tiles prefilled with either:
    - two 2's
    - one 2 and one 4
    - two 4's
*/
        for (let i = 0; i < 2; i++) {
            let iPos = this._generateRandomFreePosition();
            let oTile = this._generateRandomTile();
            this._placeTile(oTile, iPos);
        }
    }

    _placeTile(oTile, iPosition) {
        this.board[iPosition] = oTile;
        this.view.placeTile(oTile.number, iPosition);
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