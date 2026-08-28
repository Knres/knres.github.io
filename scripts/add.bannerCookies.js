'use strict';

import { checkConsentimientoCookies, aceptarCookies, deleteAllCookies, eliminarBannerCookies } from './import.cookies.js';

async function addBannerCookies() {
    const contenedor = document.getElementById('bannerCookies');
    const consentimiento = checkConsentimientoCookies();
    
    if (!contenedor) {
        return;
    }

    if (consentimiento) {
        // si ya hay consentimiento, no hace falta cargar el banner
        contenedor.remove();
        return;
    }

    try {
        const respuesta = await fetch('./components/comp.bannerCookies.html');

        if (!respuesta.ok) {
            throw new Error(`No se pudo cargar el banner de cookies: ${respuesta.status}`);
        }

        contenedor.outerHTML = await respuesta.text();

        if (respuesta.ok) {
            botonAceptarCookies();
            botonRechazarCookies();
        }
    } catch (error) {
        console.error(error);
    } finally {
        window.dispatchEvent(new Event('bannerCookies:cargado'));
    }
}

function botonAceptarCookies() {
    const boton = document.getElementById('botonAceptarCookies');
    if (!boton) {
        return;
    }

    boton.addEventListener('click', () => {
        aceptarCookies();

        const botonRechazar = document.getElementById('botonRechazarCookies');
        if (botonRechazar) {
            botonRechazar.removeEventListener('click', deleteAllCookies);
        }

        eliminarBannerCookies();
    });
}

function botonRechazarCookies() {
    const boton = document.getElementById('botonRechazarCookies');
    if (!boton) {
        return;
    }

    boton.addEventListener('click', () => {
        deleteAllCookies();

        const botonAceptar = document.getElementById('botonAceptarCookies');
        if (botonAceptar) {
            botonAceptar.removeEventListener('click', aceptarCookies);
        }

        eliminarBannerCookies();
    });
}


document.addEventListener('DOMContentLoaded', () => {
    addBannerCookies();
}, { once: true });