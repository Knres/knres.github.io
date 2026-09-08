'use strict';

function verificarUrlErronea() {

    const urlErronea = document.getElementById('urlErronea');

    // Obtener la URL errónea de los parámetros de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const urlErroneaParam = urlParams.get('url');

    if (urlErroneaParam) {
        urlErronea.textContent = decodeURIComponent(urlErroneaParam);
    } else {
        urlErronea.textContent = window.location.href;
    }

}

document.addEventListener('DOMContentLoaded', () => {
    verificarUrlErronea();
});