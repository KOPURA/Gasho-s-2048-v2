export class Util {

    static generateRandomNumber(min, max) {
        min = Math.ceil(min);  // Ensure integer
        max = Math.floor(max); // Ensure integer
        let randomNum = Math.random();

        return Math.floor(randomNum * (max - min + 1)) + min;
    }

    static generate2or4() {
        return 2 * (this.generateRandomNumber(0, 1) + 1);
    }

    static randomPick(aChoices) {
        let iRandomIndex = this.generateRandomNumber(0, aChoices.length - 1);
        return aChoices[iRandomIndex];
    }

    static getStyleClassByNumber(iNumber) {
        return 'tile-num-' + iNumber;
    }

    static generateRange(iMin, iMax) {
        return [...Array(iMax - iMin).keys()].map(i => i + iMin);
    }

    static first(aArray, fnFilter) {
        for (let i = 0; i < aArray.length; i++) {
            let currElement = aArray[i];
            if (fnFilter(currElement))
                return currElement;
        }
        return null;
    }
}