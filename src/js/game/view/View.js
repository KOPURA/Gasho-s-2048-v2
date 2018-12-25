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

    constructor(iGameSize) {
        this._gameSize = iGameSize;
        this._container = $('#' + sBoardContainerID);
    }

    get container() {
        return this._container;
    }

    get gameSize() {
        return this._gameSize;
    }

    getTileMargin() {
        let iBoardWidth = this.container.width();
        let iTileWidth  = this.getTileWidth();
        let iNumberOfMargins = this.gameSize - 1;
        return (iBoardWidth - this.gameSize * iTileWidth) / iNumberOfMargins;   
    }

    // Tile width should be the same as the width of the placeholder
    getTileWidth() {
        let oPlaceholder = this.getPlaceholderByIndex(0);
        return $(oPlaceholder).width();
    }

    getPlaceholders() {
        return this.container.find('.' + sTilePlaceholderClass);
    }

    getTiles() {
        return this.container.find('.' + sTileClass);
    }

    getPlaceholderByIndex(iIndex) {
        return this.getPlaceholders()[iIndex];
    }

    getTileByIndex(iIndex) {
        let oPlaceholder = this.getPlaceholderByIndex(iIndex);
        return $(oPlaceholder).children(0);
    }

    placeTile(iPosition, oTile, bShouldAnimate) {
        let iNumber = oTile.number;
        let sAdditionalClass = Util.getStyleClassByNumber(iNumber);
        let oPlaceholder = this.getPlaceholderByIndex(iPosition);
        let oNewTileDiv = $('<div/>', {
            class: 'tile ' + sAdditionalClass,
            text: iNumber,
        });
        if (bShouldAnimate) {
            $(oNewTileDiv).hide().appendTo(oPlaceholder).fadeIn();
        } else {
            $(oNewTileDiv).appendTo(oPlaceholder);
        }
    }

    notifyBoardPositionChanged(iPosition, oTile, bShouldAnimate) {
        $(this.getPlaceholderByIndex(iPosition)).empty();
        if (oTile)
            this.placeTile(iPosition, oTile, bShouldAnimate);
    }

    notifyBoardChanged(aNewBoard) {
        let that = this;
        $.each(aNewBoard, function(iIdx, oTile) {
            that.notifyBoardPositionChanged(iIdx, oTile, false);
        });
    }

    moveTiles(aNewBoard, oTransitionMap) {
        this.getTiles().stop(true, true); // Finish already running animations

        let that = this;
        return new Promise(function(resolve, reject) {
            oTransitionMap.executeAllTransitions(that).then(() => {
                that.notifyBoardChanged(aNewBoard);
                resolve();
            });
        });
    }

    notifyScoreChanged(iNewScore) {
        $('#' + sScorePlaceholderID).html(iNewScore);
    }
}