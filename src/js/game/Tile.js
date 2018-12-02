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

    isEqual(oOtherTile) {
        return this.number === oOtherTile.number;
    }

    merge(oOtherTile) {
        this.number += oOtherTile.number;
    }
}