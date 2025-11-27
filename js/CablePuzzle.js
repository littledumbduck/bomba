import { Puzzle } from './puzzle.js';

export class CablePuzzle extends Puzzle {
    constructor(manager, contenedorHTML) {
        super(manager, contenedorHTML);
    }

    renderizar() {
        this.contenedorHTML.innerHTML = '<p>Puzzle de cables (por implementar)</p>';
        this.contenedorHTML.addEventListener('click', this.solucionar.bind(this));
    }
}