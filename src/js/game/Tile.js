import { Util } from './Util.js';

export class Tile {

    constructor(number) {
        this._number = number;
    }

    get number() {
        return this._number;
    }

    set number(iNumber) {
        this._number = iNumber;
    }

    up() {
        this.number *= 2;
    }

    isEqual(oOtherTile) {
        return this.number === oOtherTile.number;
    }
}