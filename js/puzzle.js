export class Puzzle {
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
            this.contenedorHTML.innerHTML = '¡Desactivado!'; // Indicador visual de éxito
            this.contenedorHTML.style.backgroundColor = 'green';
        }
    }

    registrarFallo () {
        this.manager.manejarFallo();
    }

}