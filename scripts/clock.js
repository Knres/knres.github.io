'use strict';

let relojIniciado = false;

function updateClock() {
    const now = new Date();
    // Fecha
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const fecha = `${day}/${month}/${year}`;

    // Hora
    const h = now.getHours();
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    const hora = `${h}:${m}:${s}`;
    //const hora = now.toLocaleTimeString('es-ES');

    // Buscar el elemento <time> en el DOM con id="fecha-hora"
    const elementoTiempo = document.getElementById('clock');
    if (!elementoTiempo) return;

    //const fechaHora = new Date(year, month - 1, day, h, m, s);
    //const fechaHoraISO = fechaHora.toISOString();

    //elementoTiempo.dateTime = fechaHoraISO;
    elementoTiempo.dateTime = now.toISOString();
    
    //elementoTiempo.textContent = now.toLocaleString(navigator.language);
    elementoTiempo.textContent = fecha + ' ' + hora;
}

function actualizarAnyo() {
    const elementoAño = document.getElementById('anyoCopyright');

    if (!elementoAño) return;

    const añoActual = new Date().getFullYear();

    elementoAño.dateTime = String(añoActual);
    elementoAño.textContent = añoActual;
}

function iniciarReloj() {
    updateClock();

    if (relojIniciado) return;

    relojIniciado = true;
    setInterval(updateClock, 1000);
}

/* tanto el cargado del header como el footer ya tienen document.addEventListener('DOMContentLoaded', ...)*/
window.addEventListener('header:cargado', iniciarReloj);
window.addEventListener('footer:cargado', actualizarAnyo);