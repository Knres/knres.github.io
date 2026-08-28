'use strict';

import { checkConsentimientoCookies, aceptarCookies, deleteAllCookies } from './import.cookies.js';

function gestionarConsentimientoCookies() {
    const contenedor = document.getElementById('estadoConsentimientoCookies');
    
    if (!contenedor) return;

    const consentimiento = checkConsentimientoCookies();
    
    if (consentimiento === 'aceptado') {
        contenedor.innerHTML = `
            <p>
                <strong>Estado actual:</strong> Ha aceptado el uso de cookies.
            </p>
            <button type="button" id="botonRechazarConsentimiento" class="botonSecundario">
                Rechazar cookies
            </button>
        `;
        
        const botonRechazar = document.getElementById('botonRechazarConsentimiento');
        if (botonRechazar) {
            botonRechazar.addEventListener('click', () => {
                deleteAllCookies();
                gestionarConsentimientoCookies();
            });
        }
    } else { // no aceptado o rechazado
        contenedor.innerHTML = `
            <p>
                <strong>Estado actual:</strong> No ha aceptado el uso de cookies.
            </p>
            <button type="button" id="botonAceptarConsentimiento" class="botonPrincipal">
                Aceptar cookies
            </button>
        `;
        
        const botonAceptar = document.getElementById('botonAceptarConsentimiento');
        if (botonAceptar) {
            botonAceptar.addEventListener('click', () => {
                aceptarCookies();
                gestionarConsentimientoCookies();
            });
        }
    }
}   


document.addEventListener('DOMContentLoaded', gestionarConsentimientoCookies, { once: true });

// estos listen no tienen que esperar a que se cargue el DOM
window.addEventListener('consentimientoCookies:aceptado', gestionarConsentimientoCookies);
window.addEventListener('consentimientoCookies:rechazado', gestionarConsentimientoCookies);// no es necesario, porque si se puede rechazar, quiere decir que no estaba aceptado y no se produce ingun cambio en el estado, pero lo dejo por si acaso se cambia la logica en el futuro