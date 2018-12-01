/*
    The view will implement observable - it will be notified by the game when a Tile is place or has to move
    and it will take care to make the animations with jQuery and keep everything updated
*/
import { Util } from '../Util.js';

const sBoardContainerID = 'board-container';
const sTilePlaceholderClass = 'tile-placeholder';
const sTileClass = 'tile';

export class GameView {

    constructor() {
        this._container = $('#' + sBoardContainerID);
    }

    get container() {
        return this._container;
    }

    getAllTiles() {
        return this.container.find('.' + sTileClass);
    }

    getPlaceholders() {
        return this.container.find('.' + sTilePlaceholderClass);
    }

    getPlaceholderByIndex(i) {
        return this.getPlaceholders()[i];
    }

    intialize() {
        this.getAllTiles().remove();
    }

    placeTile(number, position) {
        let sAdditionalClass = Util.getStyleClassByNumber(number);
        let oPlaceholder = this.getPlaceholderByIndex(position);
        $('<div/>', {
            class: 'tile ' + sAdditionalClass,
            text: number,
        }).hide().appendTo(oPlaceholder).fadeIn();
    }
}