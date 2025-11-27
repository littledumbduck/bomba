// let tiempoRestante = 120; // Los segundos que dura la bomba antes de explotar
// const temporizadorDisplay = document.getElementById('temporizador-display');

class BombaManager {
    constructor() {
        // Atributos bomba temporizador
        this.tiempoRestante = 120;    
        this.temporizadorID = null;
        this.temporizadorDisplay = document.getElementById('temporizador-display');

        // Atributos juegos
        this.juegosActivos = 3;
        this.aciertosActuales = 0;
        this.maxFallos = 3;
        this.fallosActuales = 0;
        this.rejillaJuegos = document.getElementById('rejilla-juegos');

        // Iniciamos el temporizador
        this.iniciarTemporizador();
    }

    iniciarTemporizador() {
        this.temporizadorID = setInterval(() => {
            this.manejarTiempo();
        }, 1000);
    }

    manejarTiempo() {
        // 1. Restamos y actualizamos la pantalla
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
    }
}

class Puzzle {
    constructor(manager, contenedorHTML) {
        this.manager = manager;
        this.resuelto = false;
        this.contenedorHTML = contenedorHTML;
    }

    renderizar() {
        this.contenedorHTML.innerHTML = '<p>Puzzle genérico (debe ser sobrescrito)</p>';
    }

    solucionar() {
        if (!this.resuelto) {
            this.resuelto = true;
            this.manager.manejarAcierto();
            this.contenedorHTML.innerHTML = 'green'; // Indicador visual de éxito
        }
    }

    registrarFallo () {
        this.manager.manejarFallo();
    }

}

class BotonPuzzle extends Puzzle {
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




  document.addEventListener('DOMContentLoaded', () => {
      new BombaManager();
  });
