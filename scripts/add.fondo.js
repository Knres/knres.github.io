'use strict';

import { getCookie } from './import.cookies.js';

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


        let htmlFondo = await respuesta.text();
        // Comprobar si existe la cookie audioSaludo (reproducido)

        if (getCookie('audioSaludo')) {
            // Si existe -> ya se ha reproducido hoy (no importar)
            // por lo que lo eliminaremos de htmlFondo
            htmlFondo = htmlFondo.replace(
                /<audio[^>]*id=["']audiosaludo["'][^>]*>[\s\S]*?<\/audio>/i,
                ''
            );
            // /<audio Buscar comienzo por <audio
            // [^>]*id=["']audiosaludo["'] Buscar id="audiosaludo" o id='audiosaludo'
            // [^>]*> Buscar el resto de atributos hasta >
            // [\s\S]*?<\/audio> Buscar cualquier cosa hasta </audio>
            // i -> case insensitive (ignorar mayúsculas y minúsculas)
        }

        contenedor.outerHTML = htmlFondo;
    } catch (error) {
        console.error(error);
    } finally {
        window.dispatchEvent(new Event('fondo:cargado'));
    }
}

document.addEventListener('DOMContentLoaded', addFondo, { once: true });