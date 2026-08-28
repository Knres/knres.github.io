'use strict';

async function addFondo() {
    const contenedor = document.getElementById('fondo');

    if (!contenedor) {
        window.dispatchEvent(new Event('fondo:cargado'));
        // si no hay contenedor se dispara el evento para que no se quede bloqueado en loading
        // el loading espera el evento, a diferencia de header y footer que no lo hacen por ser mas ligeros
        return;
    }

    try {
        const respuesta = await fetch('./components/comp.fondo.html');

        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar el fondo: ${respuesta.status}`);
        }

        contenedor.outerHTML = await respuesta.text();
    } catch (error) {
        console.error(error);
    } finally {
        window.dispatchEvent(new Event('fondo:cargado'));
    }
}

document.addEventListener('DOMContentLoaded', addFondo, { once: true });