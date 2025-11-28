import { Puzzle } from './puzzle.js';

export class ContadorPuzzle extends Puzzle {
    constructor(manager, contenedorHTML) {
        super(manager, contenedorHTML);
        this.temporizadorInternoID = null;
        this.tiempoInicio = null;
        this.tiempoRestanteDisplay = null;
    }
    
    renderizar() {
        this.contenedorHTML.innerHTML = `
            <div class="puzzle-title">¡Presiona el botón cuando la cuenta llegue a 0!</div>
            <div class="puzzle-display">15.00</div>

            <button class="action-button">EMPEZAR</button>
        `;

        this.tiempoRestanteDisplay = this.contenedorHTML.querySelector('.puzzle-display');
        this.actionButton = this.contenedorHTML.querySelector('.action-button');

        this.actionButton.addEventListener('click', this.iniciarManejador.bind(this));
    }

    iniciarManejador() {
        if (!this.temporizadorInternoID) {
            this.tiempoInicio = Date.now();
            this.temporizadorInternoID = setInterval(() => {
                this.actualizarTemporizador();
        this.contenedorHTML.style.backgroundColor = '#444';
            }, 10); // con esto actualizamos cada 10 ms
            

            this.actionButton.textContent = '¡DETENER!';
        } else {
            clearInterval(this.temporizadorInternoID);
            const tiempoFin = Date.now();
            const tiempoTranscurrido = tiempoFin - this.tiempoInicio;

            const tiempoIdeal = 15000; // 15 segundos en ms
            const margen = 1000; // 1 segundo en ms de margen
            
            if (tiempoTranscurrido >= (tiempoIdeal - margen) && tiempoTranscurrido <= (tiempoIdeal + margen)) {
                this.actionButton.textContent = 'CONSEGUIDO!';
                this.solucionar();
            } else {
                // FALLO
                
                // 1. Mostrar mensaje de fallo y el botón de REINTENTO (Corrección de Sintaxis)
                this.contenedorHTML.innerHTML = `
                    <div class="puzzle-title">¡FALLASTE! Pulsaste el botón a los ${tiempoIdeal - tiempoTranscurrido}ms.</div>
                    <button class="action-button-retry">REINTENTAR</button>
                `;

                // 2. Lógica de registro
                this.contenedorHTML.style.backgroundColor = 'red';
                this.registrarFallo();
                
                // 3. Conectar el nuevo botón de REINTENTAR
                const retryButton = this.contenedorHTML.querySelector('.action-button-retry');
                
                // Conectamos el botón de reintento al método resetearPuzzle()
                retryButton.addEventListener('click', this.resetearPuzzle.bind(this));
            }

        }
    }

    actualizarTemporizador() {
        const duracionTotal = 15000; // 15 segundos

        const tiempoTranscurrido = Date.now() - this.tiempoInicio;
        let tiempoRestante = duracionTotal - tiempoTranscurrido;

        if (tiempoRestante <= 6000) {
            this.tiempoRestanteDisplay.style.visibility = 'hidden';
        }

        if (tiempoRestante <= -1000) {
            clearInterval(this.temporizadorInternoID);
            this.manager.explotarBomba();
            return;
        }

        const segundos = Math.floor(tiempoRestante / 1000);

        const milisegundos = Math.floor((tiempoRestante % 1000) / 10);

        this.tiempoRestanteDisplay.textContent = `${segundos < 10 ? '0' : ''}${segundos}.${milisegundos < 10 ? '0' : ''}${milisegundos}`;
    }

    resetearPuzzle() {
        clearInterval(this.temporizadorInternoID);
        this.temporizadorInternoID = null;
        this.tiempoRestanteDisplay.textContent = '15.000';
        this.renderizar();
    }
}
