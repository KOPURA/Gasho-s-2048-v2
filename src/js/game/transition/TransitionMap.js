import { Transition } from './Transition.js';

export class TransitionMap {

    constructor(iGameSize) {
        this._transitions = [];
    }

    get map() {
        return this._transitions;
    }

    addTransition(iFrom, iTo) {
        this.map.push(new Transition(iFrom, iTo));
    }

    executeAllTransitions(oView) {
        let iFinished = 0;
        let aTransitions = this.map;
        let iAllTransitions = aTransitions.length;

        return new Promise(function(resolve, reject) {
            for (let i = 0; i < iAllTransitions; i++) {
                aTransitions[i].execute(oView).then(() => {
                    if (++iFinished === iAllTransitions)
                        resolve();
                });
            };
        });
    }
}