import { Puzzle } from './puzzle.js';

export class SimonDicePuzzle extends Puzzle {
    constructor(manager, contenedorHTML) {
        super(manager, contenedorHTML); // Llamada al constructor de la clase base
        this.secuencia = []; // Secuencia generada por el juego
        this.intentoUsuario = []; // Secuencia ingresada por el usuario
        this.nivel = 1; // Nivel actual del juego que empezará en 1
        this.nivelesMaximos = 5; // Número máximo de niveles
        this.botones = []; // Array para almacenar los botones del juego
        this.listoDisplay = null;
        this.renderizar(); // Iniciamos el juego con un botón
    }
    
    generarSecuencia() {
        for (let i = 0; i < this.nivelesMaximos; i++) {
            // Genera números del 1 al 4
            let paso = Math.floor(Math.random() * 4) + 1;
            this.secuencia.push(paso);
        }
    }
    
    renderizar() {
        // Creamos los botones del juego
        this.contenedorHTML.innerHTML = ''; // Limpiamos el contenedor
        const boton = document.createElement('button');
        boton.classList.add('comenzar-simon-boton');
        boton.textContent = 'Comenzar Simon Dice';
        boton.addEventListener('click', () => {
            this.contenedorHTML.innerHTML = '';
            const listoDisplay = document.createElement('div');
            listoDisplay.id = 'listo-display';
            listoDisplay.textContent = 'Memoriza la secuencia';
            this.contenedorHTML.appendChild(listoDisplay);
            this.listoDisplay = listoDisplay;
            this.generarSecuencia();
            
            for (let i = 0; i < 4; i++) {
                const boton = document.createElement('button');
                boton.classList.add('simon-boton');
                boton.style.backgroundColor = this.obtenerColor(i);
                boton.dataset.index = i;
                boton.addEventListener('click', () => this.manejarClick(i));
                this.contenedorHTML.appendChild(boton);
                this.botones.push(boton);
            }
            this.mostrarSecuencia();
        });
        this.contenedorHTML.appendChild(boton); 
        
    }

    obtenerColor(index) {
        const colores = ['red', 'green', 'blue', 'yellow'];  // Colores para los botones
        return colores[index]; // Retorna el color correspondiente al índice
    }

    mostrarSecuencia() {
        this.deshabilitarBotones(); // Bloqueamos los botones mientras se muestra la secuencia
        this.listoDisplay.textContent = 'Memoriza la secuencia';
        let indice = 0;
        const intervalo = setInterval(() => {
            if (indice >= this.nivel) { // Si ya mostramos la secuencia completa
                clearInterval(intervalo);
                
                // Esperamos x ms
                setTimeout(() => {
                    this.habilitarBotones(); // Habilitamos el input para el usuario
                    this.listoDisplay.textContent = '¡TU TURNO!';
                }, 10); 
                
                return; 
            }
            const botonIndex = this.secuencia[indice] - 1;
            this.iluminarBoton(botonIndex);
            indice++;
        }, 750);
    }

    iluminarBoton(index) {
        const boton = this.botones[index];
        boton.style.opacity = '0.2';
        setTimeout(() => {
            boton.style.opacity = '1';
        }, 350);
    }

    manejarClick(index) {
        if (this.botones[0].disabled) {
            return; 
        }
        this.intentoUsuario.push(index + 1); // Guardamos el intento del usuario
        this.verificarIntento();
}

    verificarIntento() {
        const intentoActual = this.intentoUsuario.length;
        if (this.intentoUsuario[intentoActual - 1] !== this.secuencia[intentoActual - 1]) {
            this.registrarFallo();
            this.deshabilitarBotones();
            this.intentoUsuario = []; // Reiniciamos el intento del usuario
            setTimeout(() => this.mostrarSecuencia(), 1000); // Mostramos la secuencia nuevamente
            return;
        }
        if (intentoActual === this.nivel) {
            if (this.nivel === this.nivelesMaximos) {
                this.solucionar(this.puntuacionSimon); // Puzzle resuelto
            } else {
                this.nivel++;
                this.intentoUsuario = []; // Reiniciamos el intento del usuario
                setTimeout(() => this.mostrarSecuencia(), 1000); // Mostramos la siguiente secuencia
            }
        }
    }

    habilitarBotones() {
        this.botones.forEach(boton => boton.disabled = false);
    }

    deshabilitarBotones() {
        this.botones.forEach(boton => boton.disabled = true);
    }

}