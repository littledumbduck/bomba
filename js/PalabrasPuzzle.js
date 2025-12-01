import { Puzzle } from './puzzle.js';

export class PalabrasPuzzle extends Puzzle {
    constructor(manager, contenedorHTML) {
        super(manager, contenedorHTML); 
        this.palabras = ["CPU", "RAM", "GPU", "Placa base", "Torre", "Internet", "TCP/IP", "Java", "Javascript", "C", "String", "int", "Boolean", "Constructor", "Método"];
        this.palabrasIntroducidas = [];
        this.palabraSeleccionada = '';
        this.palabrasMaximas = 10;
        this.contadorPalabras = 0;
        this.renderizar();
    }

    renderizar() {
        // Llamamos al método
        this.insertarPalabraNueva();
    
        // Dibujar Contenedores
        this.contenedorHTML.innerHTML = `
            <div class="palabras-title">¿Está la palabra repetida?</div>
            <div class="palabras-display">${this.palabraSeleccionada}</div>
            <div class="progreso-display">${this.contadorPalabras} / ${this.palabrasMaximas}</div>
`; // Usa this.palabraSeleccionada
    
        // Botón de palabra repetida
        const repetida = document.createElement('button');
        repetida.classList.add('boton-palabra-repetida');
        repetida.textContent = 'Repetida';
        repetida.addEventListener('click', this.comprobarPalabraRepetida.bind(this));
        this.contenedorHTML.appendChild(repetida); 

        // Botón de palabra nueva
        const nueva = document.createElement('button');
        nueva.classList.add('boton-palabra-nueva');
        nueva.textContent = 'Nueva';
        nueva.addEventListener('click', this.comprobarPalabraNueva.bind(this)); 

        this.contenedorHTML.appendChild(nueva); 
    }

    insertarPalabraNueva() {
        // Generar la palabra y asignarla a la propiedad de la clase
        this.palabraSeleccionada = this.palabras[
            Math.floor(Math.random() * this.palabras.length)
        ];
    }

    // LÓGICA DE COMPROBACIÓN

    comprobarPalabraRepetida() {
        // Si la palabra es repetida
        
        // funcion find() para buscar la palabra sin tener que usar un for
        const palabraExistia = this.palabrasIntroducidas.find(p => p === this.palabraSeleccionada);
    
        if (palabraExistia) {
            // Está repetida
            this.palabrasIntroducidas.push(this.palabraSeleccionada);
            this.contadorPalabras++;
            if (this.contadorPalabras >= this.palabrasMaximas) {
                this.solucionar();
                return;
            }
            this.renderizar();
        } else {
            // No está repetida
            this.registrarFallo();
            this.resetearPuzzle();
        }
    }

    comprobarPalabraNueva() {
        // funcion find() para buscar la palabra sin tener que usar un for
        const palabraExistia = this.palabrasIntroducidas.find(p => p === this.palabraSeleccionada);
    
        if (palabraExistia) {
            // La palabra sí existe y se falla
            this.registrarFallo();
            this.resetearPuzzle();
        } else {
            // La palabra no existe, entonces se acierta
            this.palabrasIntroducidas.push(this.palabraSeleccionada);
            this.contadorPalabras++;
            if (this.contadorPalabras >= this.palabrasMaximas) {
                this.solucionar();
                return;
            }
            this.renderizar();
            
        }
    }

    // --- RESET Y UTILIDAD ---

    resetearPuzzle() {
        // Limpiamos el array de palabras para el reintento
        this.palabrasIntroducidas = []; 
        this.contadorPalabras = 0;
        
        // Mostramos el mensaje de fallo y el botón de reintentar
        this.contenedorHTML.innerHTML = `<div class="palabras-fallo">¡Has fallado! ¿Reintentar?</div>`;
        
        const botonReintentar = document.createElement('button');
        botonReintentar.classList.add('boton-palabra-repetida');
        botonReintentar.textContent = 'Repetir';
        
        // Al hacer clic en "Repetir", se vuelve a dibujar el juego.
        botonReintentar.addEventListener('click', this.renderizar.bind(this));
        
        this.contenedorHTML.appendChild(botonReintentar);
    }
}