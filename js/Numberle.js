import { Puzzle } from './puzzle.js';

export class Numberle extends Puzzle {

    constructor(manager, contenedorHTML) {
        super(manager, contenedorHTML);
        this.intentosMaximos = 10;
        this.intentosRealizados = 0;
        this.numeroSecreto = this.generarNumeroSecreto();
    }

    renderizar() {
        this.contenedorHTML.innerHTML = `
            <div class="numberle-title">Adivina el número secreto (${this.numeroSecreto.length} dígitos)</div>
            <div class="puzzle-instructions">Intentos restantes: ${this.intentosMaximos - this.intentosRealizados}</div>
            <input type="text" class="guess-input" maxlength="${this.numeroSecreto.length}" placeholder="Ingresa tu número">
            <button class="submit-button enviarnumberle">ENVIAR</button>
            <div class="feedback-area"></div>
        `;
        
        // --- CONEXIÓN DE EVENTOS ---
        const submitButton = this.contenedorHTML.querySelector('.submit-button');
        const input = this.contenedorHTML.querySelector('.guess-input');

        submitButton.addEventListener('click', this.manejarEnvio.bind(this)); 
        
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.manejarEnvio();
            }
        });

        // Si el juego está bloqueado por intentos agotados, deshabilitamos el botón al renderizar
        if (this.intentosRealizados >= this.intentosMaximos) {
            submitButton.disabled = true;
        }
    }

    generarNumeroSecreto() {
        // Genera un número de 3 dígitos (001 a 999) como cadena.
        const numero = Math.floor(Math.random() * 999) + 1;
        return String(numero).padStart(3, '0');
    }

    resetearPuzzle() {
        this.intentosRealizados = 0;
        this.numeroSecreto = this.generarNumeroSecreto();
        this.renderizar(); // Redibujar la interfaz con un nuevo número
    }

    manejarEnvio() {
        const input = this.contenedorHTML.querySelector('.guess-input');
        const feedbackArea = this.contenedorHTML.querySelector('.feedback-area');
        const submitButton = this.contenedorHTML.querySelector('.submit-button');
        const intento = input.value;
        
        if (!intento || this.resuelto) return;

        this.intentosRealizados++;

        if (intento === this.numeroSecreto) {
            // Lógica de ACUERTO
            feedbackArea.innerHTML += `<div style="color: green;">¡Número Correcto en ${this.intentosRealizados} intentos!</div>`;
            submitButton.disabled = true;
            this.solucionar(this.puntuacionNumberle); 
        } else {
            // Lógica de PISTAS (Ahora por Posición [1], [2], [3])
            let feedback = `Intento ${this.intentosRealizados}: ${intento} - `;
            
            for (let i = 0; i < this.numeroSecreto.length; i++) {
                
                if (intento[i] === this.numeroSecreto[i]) {
                    // Correcto en Posición
                    feedback += '✔️ '; 
                } else if (this.numeroSecreto.includes(intento[i])) {
                    // Correcto, Posición Incorrecta
                    feedback += '➖ '; 
                } else {
                    // Incorrecto
                    feedback += '❌ '; 
                }
            }
            
            feedbackArea.innerHTML += `<div>${feedback}</div>`;
            
            // Lógica de intentos restantes y fallo de bomba
            
            this.contenedorHTML.querySelector('.puzzle-instructions').textContent = 
                `Intentos restantes: ${this.intentosMaximos - this.intentosRealizados}`;
            
            if (this.intentosRealizados >= this.intentosMaximos) {
                // Lógica de fallo de la bomba
                feedbackArea.innerHTML += `<div>🚨 Has agotado tus intentos. El número era ${this.numeroSecreto}.</div>`;
                submitButton.disabled = true;
                this.registrarFallo(); 
                setTimeout(() => this.resetearPuzzle(), 3000); 
            }
        }
        
        feedbackArea.scrollTo({
            top: feedbackArea.scrollHeight,
            behavior: 'smooth'
        });

        input.value = ''; 
    }
}