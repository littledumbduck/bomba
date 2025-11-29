export class Puzzle {
    constructor(manager, contenedorHTML) {
        this.manager = manager;
        this.resuelto = false;
        this.contenedorHTML = contenedorHTML;
    }

    renderizar() {
        this.contenedorHTML.innerHTML = '<p>No se hizo bien el overread</p>';
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