/*
    The view will implement observable - it will be notified by the game when a Tile is place or has to move
    and it will take care to make the animations with jQuery and keep everything updated
*/
import { Util } from '../Util.js';

const sBoardContainerID = 'board-container';
const sScorePlaceholderID = 'score-placeholder';
const sTilePlaceholderClass = 'tile-placeholder';
const sTileClass = 'tile';

export class GameView {

    constructor() {
        this._container = $('#' + sBoardContainerID);
    }

    get container() {
        return this._container;
    }

    getPlaceholders() {
        return this.container.find('.' + sTilePlaceholderClass);
    }

    getPlaceholderByIndex(iIndex) {
        return this.getPlaceholders()[iIndex];
    }

    notifyBoardPositionChanged(iPosition, iNumber) {
        let sAdditionalClass = Util.getStyleClassByNumber(iNumber);
        let oPlaceholder = this.getPlaceholderByIndex(iPosition);
        $('<div/>', {
            class: 'tile ' + sAdditionalClass,
            text: iNumber,
        }).hide().appendTo(oPlaceholder).fadeIn();
    }

    notifyBoardChanged(aNewBoard) {
        let that = this;
        $.each(aNewBoard, function(iIdx, oTile) {
            $(that.getPlaceholderByIndex(iIdx)).empty();
            if (oTile)
                that.notifyBoardPositionChanged(iIdx, oTile.number);
        });
    }

    notifyScoreChanged(iNewScore) {
        $('#' + sScorePlaceholderID).html(iNewScore);
    }
}