import { Puzzle } from './puzzle.js';

export class BotonPuzzle extends Puzzle {
    constructor(manager, contenedorHTML) {
        // Llamar al constructor de la clase Puzzle
        super(manager, contenedorHTML);
    }

    renderizar() {
        // 1. Crear el botón HTML
        const boton = document.createElement('button');
        boton.textContent = 'Presiona para desactivar';
        boton.classList.add('puzzle-boton'); // Clase CSS opcional para estilo

        // 2. Conectar el evento click con el método solucionar()
        // Usamos .bind(this) para asegurar que 'this' dentro de solucionar apunte al puzzle.
        boton.addEventListener('click', this.solucionar.bind(this));
        
        // 3. Limpiar la ranura y añadir el botón
        this.contenedorHTML.innerHTML = '';
        this.contenedorHTML.appendChild(boton);
    }
}