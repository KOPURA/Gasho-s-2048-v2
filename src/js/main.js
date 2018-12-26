import { Game } from './game/Game.js';
import { Util } from './game/Util.js';

export function main() {
    let oGame = new Game(4);

    document.onkeydown = function(e) {
        switch(e.key) {
            case 'ArrowDown' : oGame.moveDown();  break;
            case 'ArrowUp'   : oGame.moveUp();    break;
            case 'ArrowRight': oGame.moveRight(); break;
            case 'ArrowLeft' : oGame.moveLeft();  break;
            default          : return;
        }
        e.preventDefault();
    }

    document.getElementById('new-game-button').onclick = () => oGame.initialize();
}