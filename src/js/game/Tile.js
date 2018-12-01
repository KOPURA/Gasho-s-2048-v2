import { Util } from './Util.js';

export class Tile {

    constructor(number) {
        this._number = number;
    }

    get number() {
        return this._number;
    }

    static merge(tileOne, tileTwo) {
        return new Tile(tileOne.number + tileTwo.nubmer);
    }
}