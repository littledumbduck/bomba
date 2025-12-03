import { Puzzle } from './puzzle.js';

export class ClickPuzzle extends Puzzle {
    constructor(manager, contenedorHTML) {
        super(manager, contenedorHTML);
        this.dibujoPuzzle = []; 
        this.tiempoResolver = 15; 
        this.tiempoMemoria = 10; 
        this.casillasActivas = 15; 
        this.alturaArray = 5; 
        this.anchoArray = 5;
        this.renderizar();
    }

    renderizar() {
        this.contenedorHTML.innerHTML = `
            <div class="clickpuzzle-instrucciones">
                Haz clic en el botón para desactivar el módulo.
            </div>
            `;

        const botonEmpezar = document.createElement('button');
        botonEmpezar.classList.add('boton-clickpuzzle');
        botonEmpezar.textContent = 'Comenzar Memoria';
        botonEmpezar.addEventListener('click', this.comenzarPuzzle.bind(this)); 
        
        // Añadir el botón al DOM
        this.contenedorHTML.appendChild(botonEmpezar); 
    }

    // --- MÉTODOS DE UTILIDAD DE MATRIZ ---
    inicializarMatriz() {
        this.dibujoPuzzle = []; 
        for (let i = 0; i < this.alturaArray; i++) {
            // Crea una fila de tamaño 'anchoArray' llena de 0s
            this.dibujoPuzzle[i] = new Array(this.anchoArray).fill(0); 
        }
    }

    rellenarCasillas() {
        this.inicializarMatriz();
        let casillasLlenadas = 0;
        
        while (casillasLlenadas < this.casillasActivas) { 
            const fila = Math.floor(Math.random() * this.alturaArray);
            const columna = Math.floor(Math.random() * this.anchoArray);
            if (this.dibujoPuzzle[fila][columna] !== 1) {
                this.dibujoPuzzle[fila][columna] = 1; // 1 = Botón ACTIVO (a clickear)
                casillasLlenadas++;
            }
        }
    }

    // --- MÉTODOS DE FLUJO DEL JUEGO ---

    comenzarPuzzle() {
        this.rellenarCasillas(); // Genera la matriz de 1s y 0s
        this.contenedorHTML.innerHTML = ''; // Limpia el botón de inicio
        const tabla = document.createElement('table');
        tabla.classList.add('clickpuzzle-tabla');
        
        for (let i = 0; i < this.alturaArray; i++) {
            const fila = document.createElement('tr');
            for (let j = 0; j < this.anchoArray; j++) {
                const celda = document.createElement('td');
                const boton = document.createElement('button');
                
                // Le damos una clase general y una de estado
                boton.classList.add('puzzle-celda');
                
                if (this.dibujoPuzzle[i][j] === 1) {
                    boton.classList.add('boton-activo-memoria');
                    boton.addEventListener('click', this.manejarClick.bind(this, i, j, true));
                } else {
                    boton.classList.add('boton-inactivo-memoria');
                    boton.addEventListener('click', this.manejarClick.bind(this, i, j, false));
                }
                
                boton.dataset.fila = i;
                boton.dataset.columna = j;
                
                celda.appendChild(boton);
                fila.appendChild(celda);
            }
            tabla.appendChild(fila);
        }
        this.contenedorHTML.appendChild(tabla);
        
        // 1. INICIAMOS EL TEMPORIZADOR DE MEMORIA
        this.controlarTiempoMemoria(); 
    }

    controlarTiempoMemoria() {
        // Bloqueamos los botones para que no se pueda clickear durante 10 segundos
        this.contenedorHTML.querySelectorAll('.puzzle-celda').forEach(b => b.disabled = true);
        
        // Ocultamos las casillas activas después del tiempo de memoria
        setTimeout(() => {
            
            this.contenedorHTML.querySelectorAll('.puzzle-celda').forEach(b => b.disabled = false);

        }, this.tiempoMemoria * 1000); // MILISEGUNDOS que tarda en ocultarse las casillas y empezar a interactuar
    }


    manejarClick(fila, columna, esActivo) {
        // Usamos el selector de atributo para encontrar el botón correcto
        const boton = this.contenedorHTML.querySelector(`button[data-fila="${fila}"][data-columna="${columna}"]`);
        
        if (esActivo) {
            // ACIERTO
            this.dibujoPuzzle[fila][columna] = -1; // Marcamos como clicado
            boton.disabled = true;
            boton.style.opacity = 1; // Confirmación visual: se enciende permanentemente
            this.casillasActivas--;
            
            if (this.casillasActivas === 0) {
                this.solucionar();
            }
        } else {
            // FALLO (Pulsó un botón inactivo)
            this.contenedorHTML.innerHTML = `
                <div class="puzzle-title">¡FALLASTE! Pulsaste una casilla incorrecta.</div>
            `;
            // Lógica de registro
            this.contenedorHTML.style.backgroundColor = 'red';
            this.registrarFallo();
            
            // Conectar el botón de REINTENTAR
            const retryButton = document.createElement('button');
            retryButton.classList.add('action-button-retry');
            retryButton.textContent = 'REINTENTAR';
            retryButton.addEventListener('click', this.resetearPuzzle.bind(this));
            
            this.contenedorHTML.appendChild(retryButton);
        }
    }
    
    resetearPuzzle() {
        this.dibujoPuzzle = []; 
        this.casillasActivas = 15;
        this.contenedorHTML.style.backgroundColor = ''; 
        this.renderizar(); // Volvemos a dibujar el botón de START
    }
    
    // El método de inicialización de matriz ahora es auxiliar
    inicializarMatriz() {
        this.dibujoPuzzle = []; 
        for (let i = 0; i < this.alturaArray; i++) {
            this.dibujoPuzzle[i] = new Array(this.anchoArray).fill(0);
        }
    }
}