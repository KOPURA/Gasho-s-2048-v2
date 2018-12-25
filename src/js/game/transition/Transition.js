const AnimationDirections = {
    LEFT:  'left',
    RIGHT: 'right',
    UP:    'top',
    DOWN:  'bottom',
}

export class Transition {

    constructor(iFrom, iTo, bIsMerge) {
        this._from = iFrom;
        this._to = iTo;
    }

    get from() {
        return this._from;
    }

    get to() {
        return this._to;
    }

    getDirection(oView) {
        if (this.from % oView.gameSize === this.to % oView.gameSize) {
            // One is Above the other
            return this.from > this.to ? AnimationDirections.UP : AnimationDirections.DOWN;
        } else {
            return this.from > this.to ? AnimationDirections.LEFT : AnimationDirections.RIGHT;
        }
    }

    calculateOffset(sDirection, oView) {
        let iTileWidth = oView.getTileWidth();
        let iMarginWidth = oView.getTileMargin(); 
        let iStep = 0;
        if (sDirection === AnimationDirections.UP || sDirection === AnimationDirections.DOWN) {
            iStep = Math.abs(this.from - this.to) / oView.gameSize;
        } else {
            iStep = Math.abs(this.from - this.to);
        }
        return iStep * (iTileWidth + iMarginWidth);
    }

    determineAnimationMap(oView) {
        let sDirection = this.getDirection(oView);
        let iOffset = this.calculateOffset(sDirection, oView);
        let mAnimationMap = {};
        mAnimationMap[sDirection] = '-=' + iOffset + 'px';
        return mAnimationMap;
    }

    execute(oView) {
        let oTile = oView.getTileByIndex(this.from);
        let mAnimationMap = this.determineAnimationMap(oView);

        return oTile.animate(mAnimationMap, {
            duration: 100,
            queue: false,
            easing: 'linear',
        }).promise();
    }
}