import { ContadorPuzzle } from './ContadorPuzzle.js';
import { Numberle } from './Numberle.js';
import { SimonDicePuzzle } from './SimonDicePuzzle.js';

export class BombaManager {
    constructor() {
        // Atributos bomba temporizador
        this.tiempoRestante = 90;    
        this.temporizadorID = null;
        this.temporizadorDisplay = document.getElementById('temporizador-display');

        // Atributos juegos
        this.juegosActivos = 3;
        this.aciertosActuales = 0;
        this.maxFallos = 3;
        this.fallosActuales = 0;
        this.rejillaJuegos = document.getElementById('rejilla-juegos');

        // Array de puzzles disponibles (por implementar)
        this.tiposPuzzle = [Numberle, SimonDicePuzzle, ContadorPuzzle];

        // Iniciamos el temporizador
        this.iniciarTemporizador();

        // La acción de colocar los juegos en la rejilla
        this.colocarJuegosAleatorios();
    }

    iniciarTemporizador() {
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
        
        // 2. Verificamos la condición de explosión
        if (this.tiempoRestante <= 0) {
            // Detenemos el conteo regresivo
            clearInterval(this.temporizadorID); 
            
            // Llamamos al método de explosión
            this.explotarBomba(); 
        }
    }

    explotarBomba() {
        window.location.href = 'explotada.html';
        console.log("¡La bomba ha explotado!");
    }

    manejarAcierto() {
        this.aciertosActuales++;
        this.verificarEstadoJuego();
    }

    verificarEstadoJuego() {
        if (this.aciertosActuales >= this.juegosActivos) {
            clearInterval(this.temporizadorID);
            window.location.href = 'victoria.html';
            console.log("¡Bomba desactivada!");
        }
    }

    manejarFallo() {
        this.fallosActuales++;
        if (this.fallosActuales >= this.maxFallos) {
            clearInterval(this.temporizadorID);
            this.explotarBomba();
        }
    }

    colocarJuegosAleatorios() {
        const ranuras = this.rejillaJuegos.querySelectorAll('.ranura');
        const indicesSeleccionados = new Set();
        
        // Bucle para seleccionar 3 índices únicos (sin repetición)
        while (indicesSeleccionados.size < this.juegosActivos) {
            const indiceAleatorio = Math.floor(Math.random() * ranuras.length);
            indicesSeleccionados.add(indiceAleatorio); 
        }

        // Iteramos sobre los 3 índices únicos para instanciar y renderizar
        indicesSeleccionados.forEach(indice => {
            const ranura = ranuras[indice];

            // Elegimos un índice aleatorio dentro del array this.tiposPuzzle
            const ClaseSeleccionada = this.tiposPuzzle[
                Math.floor(Math.random() * this.tiposPuzzle.length)
            ];
            
            // Creamos una instancia de la clase que fue seleccionada aleatoriamente
            const puzzle = new ClaseSeleccionada(this, ranura); 
            puzzle.renderizar();
        });
    }
    
}

  document.addEventListener('DOMContentLoaded', () => {
      new BombaManager();
  });
