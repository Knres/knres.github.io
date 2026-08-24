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


/* TODO: Implementar la incrementación del loading con el estado de preparación real del entorno*/
function iniciarContadorLoading() {
    const duracionMs = 900;
    const inicio = performance.now();
    const intervaloActualizacion = 16; // Aprox 60 FPS

    const intervalo = setInterval(() => {
        const transcurrido = performance.now() - inicio;
        const porcentajeActual = Math.min((transcurrido / duracionMs) * 100, 100);

        actualizarLoading(porcentajeActual);

        if (porcentajeActual >= 100) {
            clearInterval(intervalo);
            window.dispatchEvent(new Event('loading:finalizado'));
        }
    }, intervaloActualizacion);
}

function iniciarLoading() {
    bloquearScroll();
    actualizarLoading(0);

    suscribirFinalizado();
    suscribirQuitado();

    iniciarContadorLoading();
}

/* ============================================================================================================
 * Inicialización
 * ==========================================================================================================*/
document.addEventListener('DOMContentLoaded', () => {
    iniciarLoading();
});
