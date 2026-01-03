export class Puzzle {
    constructor(manager, contenedorHTML) {
        this.manager = manager;
        this.resuelto = false;
        this.contenedorHTML = contenedorHTML;
        this.bonificacion = 0;

        // Puntuaciones de los puzzles
        this.puntuacionNumberle = 3;
        this.puntuacionSimon = 4;
        this.puntuacionContador = 6;
        this.puntuacionPalabras = 5;
        this.puntuacionClick = 8;
    }

    renderizar() {
        this.contenedorHTML.innerHTML = '<p>No se hizo bien el override</p>';
    }

    solucionar(bonificacion) {
        this.bonificacion = bonificacion;
        if (!this.resuelto) {
            this.resuelto = true;
            this.manager.manejarAcierto(bonificacion);
            this.contenedorHTML.innerHTML = '<div class="desactivado">¡Desactivado!</div>'; // Indicador visual de éxito
            this.contenedorHTML.style.backgroundColor = 'green';
        }
    }

    registrarFallo () {
        this.manager.manejarFallo();
    }

}