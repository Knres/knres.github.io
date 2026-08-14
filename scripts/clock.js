'use strict';

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

    const fechaHora = new Date(year, month - 1, day, h, m, s);
    const fechaHoraISO = fechaHora.toISOString();

    elementoTiempo.dateTime = fechaHoraISO;
    elementoTiempo.textContent = fecha + ' ' + hora;
}

document.addEventListener('DOMContentLoaded', () => {
    updateClock();
    setInterval(updateClock, 1000);
});