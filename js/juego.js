import { ContadorPuzzle } from './ContadorPuzzle.js';
import { Numberle } from './Numberle.js';
import { SimonDicePuzzle } from './SimonDicePuzzle.js';
import { PalabrasPuzzle } from './PalabrasPuzzle.js';
import { ClickPuzzle } from './ClickPuzzle.js';

class BombaManager {
    constructor() {
        // Atributos bomba temporizador
        this.tiempoRestante = 120;
        this.temporizadorID = null;
        this.temporizadorDisplay = document.getElementById('temporizador-display');

        // Atributos juegos
        this.juegosActivos = 4;
        this.aciertosActuales = 0;
        this.maxFallos = 3;
        this.fallosActuales = 0;
        this.rejillaJuegos = document.getElementById('rejilla-juegos');
        this.puntuacion = 0;

        // Array de puzzles disponibles y puntuaciones
        this.tiposPuzzle = [Numberle, SimonDicePuzzle, ContadorPuzzle, PalabrasPuzzle, ClickPuzzle]; // Todos los juegos agrupados en un array
        this.indicesSeleccionados = [];
        this.extra = 0;

        // Variable para apuntar al body de la web (usado para cambiar de página)
        this.formatearBody = document.body;

        // Iniciamos el temporizador
        this.iniciarTemporizador();

        // La acción de colocar los juegos en la rejilla
        this.colocarJuegosAleatorios();
    }

    iniciarTemporizador() {
        this.manejarTiempo(); // Llamada inicial para actualizar inmediatamente la pantalla
        this.temporizadorID = setInterval(() => {
            this.manejarTiempo();
        }, 1000);
    }

    manejarTiempo() {
        // Restamos y actualizamos la pantalla
        this.tiempoRestante--; 
        
        // Formateamos el tiempo a '0:59', '1:00', etc. para que se vea mejor
        const minutos = Math.floor(this.tiempoRestante / 60);
        const segundos = this.tiempoRestante % 60;
        this.temporizadorDisplay.textContent = 
            `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
        
        // Verificamos la condición de explosión
        if (this.tiempoRestante < 0) {
            
            // Logica para terminar el juego
            clearInterval(this.temporizadorID); 
            this.explotarBomba(); 
        }
    }

    explotarBomba() {
        window.location.href = 'explotada.html';
    }

    manejarAcierto(bonificacion) {
        this.extra = bonificacion;
        this.setPuntuacion();
        this.aciertosActuales++;
        this.verificarEstadoJuego();
    }

    verificarEstadoJuego() {
        if (this.aciertosActuales >= this.juegosActivos) {
            clearInterval(this.temporizadorID);
            this.pantallaVictoria();
        }
    }

    manejarFallo() {
        this.fallosActuales++;
        const contadorFallosDisplay = document.getElementById('contadorfallos-display');
        let x = '';

        if (this.fallosActuales === 1) {
            x = 'X';
        } else if (this.fallosActuales === 2) {
            x = 'X   X';
        }

        contadorFallosDisplay.textContent = x;
        if (this.fallosActuales >= this.maxFallos) {
            clearInterval(this.temporizadorID);
            this.explotarBomba();
        }
    }

    colocarJuegosAleatorios() {
        const ranuras = this.rejillaJuegos.querySelectorAll('.ranura');
        
        // Reiniciamos selección previa y calculamos cuántas ranuras usar
        this.indicesSeleccionados = [];
        const maxSlots = Math.min(this.juegosActivos, ranuras.length);

        // Bucle para seleccionar índices únicos (sin repetición)
        while (this.indicesSeleccionados.length < maxSlots) {
            const indiceAleatorio = Math.floor(Math.random() * ranuras.length);
            if (!this.indicesSeleccionados.includes(indiceAleatorio)) {
                this.indicesSeleccionados.push(indiceAleatorio);
            }
        }

        // Iteramos sobre los índices únicos para instanciar y renderizar
        this.indicesSeleccionados.forEach(indice => {
            const ranura = ranuras[indice];

            // Elegimos un índice aleatorio dentro del array this.tiposPuzzle
            const ClaseSeleccionada = this.tiposPuzzle[
                Math.floor(Math.random() * this.tiposPuzzle.length)
            ];
            
            // Creamos una instancia de la clase que fue seleccionada aleatoriamente
            const puzzle = new ClaseSeleccionada(this, ranura); 
            puzzle.renderizar();
        });

        for (let index = 0; index < this.indicesSeleccionados.length; index++) {
            console.log(this.indicesSeleccionados[index]);
            
        }

    }

    setPuntuacion() {

        this.puntuacion = this.puntuacion + ((this.tiempoRestante * 10 - (this.fallosActuales * 50)) * this.extra);

        console.log("Puntuación: " + this.puntuacion);
        console.log("Extra: " + this.extra);

    }

    pantallaVictoria() {
        const nuevoContenidoHTML = `
                <div class="victoria-container">
                <h1>🏆 ¡DESACTIVASTE LA BOMBA! 🏆</h1>
                <p>¡Enhorabuena!</p>
                <div class="puntuacion">Puntuación: ${this.puntuacion}</div>
                <a href="index.html" class="boton-reintentar-victoria">
                    Empezar Nueva Misión
                </a>
            </div>
        `;
        this.formatearBody.innerHTML = nuevoContenidoHTML;
    }
    
}

document.addEventListener('DOMContentLoaded', () => {
    new BombaManager();
});
