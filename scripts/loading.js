'use strict';

/* ============================================================================================================
 * Constantes y variables
 * ==========================================================================================================*/
const overlay = document.getElementById('loading');
const texto = document.querySelector('.loading-text');
const porcentaje = document.querySelector('.loading-percentage');
const barra = document.querySelector('.loading-bar');
const progreso = document.getElementById('loading-progress-rect');

const timeOutFinalizado = 1200; // Tiempo de espera para que la transición de finalización del loading se complete antes de quitarlo de la pantalla

const svgAnchoBase = 700; // Ancho base del SVG para calcular el ancho visible de la barra de progreso
let svgAnchoVisible = 0; // Ancho visible de la barra de progreso, calculado en función del porcentaje
let porcentajeEntero = 0; // Porcentaje entero del progreso, redondeado al número más cercano

let scrollBloqueado = false;
let loadingFinalizado = false;  // Finalizado: El contador de loading ha llegado al 100%
let loadingQuitado = false;     // Quitado: El loading a sido quitado de la pantalla y ya no se muestra

/* ============================================================================================================
 * Auxiliares
 * ==========================================================================================================*/ 
function getElementById(id) {
    return document.getElementById(id);
}

function bloquearScroll() {
    if (scrollBloqueado) return;
    scrollBloqueado = true;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
}

function reactivarScroll() {
    if (!scrollBloqueado) return;
    scrollBloqueado = false;

    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
}

/* ============================================================================================================
 * Sistema de Eventos
 * ==========================================================================================================*/
function suscribir(evento, estado, callback) {
    if (estado) {
        callback();
        return;
    }

    window.addEventListener(evento, callback, { once: true });
}

function suscribirFinalizado() {
    suscribir('loading:finalizado', loadingFinalizado, () => {
        if (loadingFinalizado) return;

        loadingFinalizado = true;

        if (overlay && texto && porcentaje && barra && progreso) {
            // transición de finalización del loading css

            overlay.classList.add('loading-finalizado');

        }

        reactivarScroll();

        setTimeout(() => {
            window.dispatchEvent(new Event('loading:quitado'));
        }, timeOutFinalizado);
    });
}

function suscribirQuitado() {
    suscribir('loading:quitado', loadingQuitado, () => {
        if (loadingQuitado) return;

        loadingQuitado = true;

        if (overlay) {
            overlay.remove();
        }
    });
}

/* ============================================================================================================
 * Lógica del Loading
 * ==========================================================================================================*/
function actualizarLoading(valor) {
    if (valor < 0) valor = 0;
    if (valor > 100) valor = 100;

    porcentajeEntero = Math.round(valor);
    svgAnchoVisible = (porcentajeEntero / 100) * svgAnchoBase;

    if (progreso) {
        progreso.setAttribute('width', String(svgAnchoVisible));
    }

    if (porcentaje) {
        porcentaje.textContent = porcentajeEntero + ' %';
    }

    if (texto) {
        texto.textContent = porcentajeEntero >= 100 ? 'FINALIZADO' : 'Cargando...';
    }
}



function comprobarRecursos() {
    const recursos = document.querySelectorAll('img, link[rel="stylesheet"], script, iframe');
    const totalRecursos = recursos.length; // Total de recursos a cargar
    let recursosCargados = 0;              // Contador de recursos cargados

    if (totalRecursos === 0) {
        actualizarLoading(100);
        window.dispatchEvent(new Event('loading:finalizado'));
        return;
    }

    function marcarRecursoCompletado() {
        recursosCargados++;
        
        let progresoActual = (recursosCargados / totalRecursos) * 100;
        actualizarLoading(progresoActual);

        if (recursosCargados === totalRecursos) {
            window.dispatchEvent(new Event('loading:finalizado'));
        }
    }

    function recursoYaCargado(recurso) {
        const tag = recurso.tagName.toLowerCase();

        if (tag === 'img') {
            return recurso.complete;
        }

        if (tag === 'script') {
            return !recurso.src || recurso.readyState === 'loaded' || recurso.readyState === 'complete' || performance.getEntriesByName(recurso.src).length > 0;
        }

        if (tag === 'link') {
            return !!recurso.sheet;
        }

        if (tag === 'iframe') {
            try {
                return !!recurso.contentDocument && recurso.contentDocument.readyState === 'complete';
            } catch (error) {
                // Cross-origin: no se puede inspeccionar; se espera al evento load/error.
                return false;
            }
        }

        return false;
    }

    recursos.forEach((recurso) => {
        if (recursoYaCargado(recurso)) {
            marcarRecursoCompletado();
        } else {
            recurso.addEventListener('load', marcarRecursoCompletado, { once: true });
            recurso.addEventListener('error', marcarRecursoCompletado, { once: true });
        }
    });

}

function iniciarLoading() {
    bloquearScroll();
    actualizarLoading(0);

    suscribirFinalizado();
    suscribirQuitado();

    comprobarRecursos();
}

/* ============================================================================================================
 * Inicialización
 * ==========================================================================================================*/
document.addEventListener('DOMContentLoaded', () => {
    iniciarLoading();
});
