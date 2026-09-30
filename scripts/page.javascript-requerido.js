'use strict';

function tienePagAnteriorValido() {
    if (!document.referrer || window.history.length <= 1) {
        return false;
    }

    try {
        const PagAnterior = new URL(document.referrer).origin;

        if (PagAnterior === window.location.origin) {
            return true;
        }

        return false;

    } catch {
        return false;
    }
}

function volverPaginaAnterior() {
    if (!tienePagAnteriorValido()) {
        window.location.replace('./');
        return;
    }

    window.history.back();
}

volverPaginaAnterior();