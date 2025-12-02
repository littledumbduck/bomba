import { Puzzle } from './puzzle.js';

export class ClickPuzzle extends Puzzle {
    constructor(manager, contenedorHTML) {
        super(manager, contenedorHTML);
        this.dibujoPuzzle = [[],[]]; // Array doble para el dibujo del puzzle 
        this.tiempoResolver = 15; // segundos para resolver el puzzle
        this.casillasActivas = 15; // Número de casillas activas
        this.alturaArray = 6; // Altura del array del puzzle
        this.anchoArray = 6; // Ancho del array del puzzle
        this.botonActivo = document.createElement('button').addClassList.add('boton-activo');
        this.BotonNoActivo = document.createElement('button').addClassList.add('boton-no-activo');
        this.renderizar();
    }

    renderizar() {
        this.contenedorHTML.innerHTML = `
            <div class="clickpuzzle-instrucciones">
                Haz clic en el botón para desactivar la bomba.
            </div>
        `;

        const botonEmpezar = document.createElement('button');
        botonEmpezar.classList.add('boton-clickpuzzle');
        botonEmpezar.textContent = 'Desactivar módulo';
        botonEmpezar.addEventListener('click', this.comenzarPuzzle.bind(this)); 
    }

    rellenarCasillas() {

        // En el array doble dibujoPuzzle, llenamos con valores aleatorios 1 o 0 las mismas veces que casillasActivas cuidando que no se repitan las posiciones
        let casillasLlenadas = 0;
        while (casillasLlenadas <= this.casillasActivas) {
            const fila = Math.floor(Math.random() * this.alturaArray);
            const columna = Math.floor(Math.random() * this.anchoArray);
            if (this.dibujoPuzzle[fila][columna] !== 1) {
                this.dibujoPuzzle[fila][columna] = 1;
                casillasLlenadas++;
            }
        }

        // Rellenamos el resto del array con 0
        for (let i = 0; i < this.alturaArray; i++) {
            for (let j = 0; j < this.anchoArray; j++) {
                if (this.dibujoPuzzle[i][j] !== 1) {
                    this.dibujoPuzzle[i][j] = 0;
                }
            }
        }
    }

    comenzarPuzzle() {
        this.rellenarCasillas();
        this.contenedorHTML.innerHTML = '';
        const tabla = document.createElement('table');
        tabla.classList.add('clickpuzzle-tabla');
        for (let i = 0; i < this.alturaArray; i++) {
            const fila = document.createElement('tr');
            for (let j = 0; j < this.anchoArray; j++) {
                const celda = document.createElement('td');
                const boton = document.createElement('button');
                if (this.dibujoPuzzle[i][j] === 1) {
                    boton.classList.add('boton-activo');
                    boton.idlist.add('boton-activo');
                    boton.addEventListener('click', this.manejarClick.bind(this, i, j, true));
                } else {
                    boton.classList.add('boton-no-activo');
                    boton.idlist.add('boton-no-activo');
                    boton.addEventListener('click', this.manejarClick.bind(this, i, j, false));
                }
                celda.appendChild(boton);
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
        this.contenedorHTML.appendChild(tabla);
    }

    manejarClick(fila, columna, esActivo) {
        if (esActivo) {
            this.dibujoPuzzle[fila][columna] = -1; // Marcamos como clicado
            const boton = this.contenedorHTML.querySelectorAll('button')[fila * this.anchoArray + columna];
            boton.disabled = true;
            this.casillasActivas--;
            if (this.casillasActivas === 0) {
                this.solucionar();
            }
        } else {
            // FALLO
            this.contenedorHTML.innerHTML = `
                <div class="puzzle-title">¡FALLASTE! Pulsaste una casilla incorrecta.</div>
                <button class="action-button-retry">REINTENTAR</button>
            `;
            // Lógica de registro
            this.contenedorHTML.style.backgroundColor = 'red';
            this.registrarFallo();
            // Conectar el nuevo botón de REINTENTAR
            const retryButton = this.contenedorHTML.querySelector('.action-button-retry');
            // Conectamos el botón de reintento al método resetearPuzzle()
            retryButton.addEventListener('click', this.resetearPuzzle.bind(this));
        }
    }

    resetearPuzzle() {
        this.dibujoPuzzle = [[],[]];
        this.casillasActivas = 15;
        this.contenedorHTML.style.backgroundColor = '#444';
        this.comenzarPuzzle();
    }
}