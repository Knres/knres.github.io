'use strict';

/* ============================================================================================================
 * Recuperación de elementos del DOM
 * ==========================================================================================================*/
const overlay = document.getElementById('loading');
const texto = document.querySelector('.loading-text');
const porcentaje = document.querySelector('.loading-percentage');
const barra = document.querySelector('.loading-bar');
const progreso = document.getElementById('loading-progress-rect');

/* ============================================================================================================
 * Configuración 
 * ==========================================================================================================*/
const svgAnchoBase = 700; // Ancho base del SVG para calcular el ancho visible de la barra de progreso
const porcentajeRecursos = 95;
// Porcentaje máximo que pueden alcanzar los recursos.
// El 5 % restante se reserva para las comprobaciones finales.

/* ============================================================================================================
 * Estado
 * ==========================================================================================================*/
let porcentajeEntero = 0; // Porcentaje entero del progreso, redondeado al número más cercano
let scrollBloqueado = false;
let loadingFinalizado = false;  // El progreso ha llegado al 100 %
let loadingQuitado = false;     // El overlay ha sido eliminado del DOM

/* ============================================================================================================
 * Funciones de Scroll
 * ==========================================================================================================*/ 
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

        actualizarLoading(100);
        reactivarScroll();


        if (!overlay) {
            window.dispatchEvent(new Event('loading:quitado'));
            return;
        }
        overlay.classList.add('loading-finalizado');


        /*
         * Esperamos a que termine la transición CSS.
         *
         * CSS:
         * opacity: 1 → 0
         * duración: 1s
        */
        const finalizarTransicion = (event) => {
            if (event.propertyName !== 'opacity') return;

            window.dispatchEvent(new Event('loading:quitado'));
        };


        overlay.addEventListener(
            'transitionend',
            finalizarTransicion,
            { once: true }
        );
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
 * Actualización del Loading
 * ==========================================================================================================*/
function actualizarLoading(valor) {
    if (valor < 0) valor = 0;
    if (valor > 100) valor = 100;

    porcentajeEntero = Math.round(valor);
    
    // Ancho visible de la barra de progreso, calculado en función del porcentaje
    const svgAnchoVisible = (porcentajeEntero / 100) * svgAnchoBase;


    if (progreso) {
        progreso.setAttribute('width', String(svgAnchoVisible));
    }

    if (porcentaje) {
        porcentaje.textContent = porcentajeEntero + ' %';
    }
    

    if (texto) {
        let textoInformativo = "Cargando..." 
        
        // cargando fuentes -> 0-25%
        // cargando imágenes -> 25-50%
        // cargando audio -> 50-65%
        // cargando videos -> 50-75%
        // cargando renderizado -> 75-porcentajeRecursos%
        if (porcentajeEntero < 25) {
            textoInformativo = "Cargando fuentes...";
        } else if (porcentajeEntero >= 25 && porcentajeEntero < 50) {
            textoInformativo = "Cargando imágenes...";
        } else if (porcentajeEntero >= 50 && porcentajeEntero < 65) {
            textoInformativo = "Cargando audios...";
        } else if (porcentajeEntero >= 65 && porcentajeEntero < 75) {
            textoInformativo = "Cargando videos...";
        } else if (porcentajeEntero >= 75 && porcentajeEntero < porcentajeRecursos) {
            textoInformativo = "Cargando renderizado...";
        }

        texto.textContent = porcentajeEntero >= 100 ? 'FINALIZADO' : textoInformativo;
    }
}


/* ============================================================================================================
 * Esperar recursos/renderizado
 * ==========================================================================================================*/
function esperarImagenes() {
    const images = Array.from(document.images);

    if (images.length === 0) {
        return Promise.resolve();
    }

    const promesas = images.map((img) => {
        if (img.complete) {
            return Promise.resolve();
        }
        
        return new Promise((resolve) => {
            img.addEventListener('load', resolve, { once: true });
            img.addEventListener('error', resolve, { once: true });
        });
    });

    return Promise.all(promesas);
}

function esperarFuentes() {
    if (!document.fonts) {
        return Promise.resolve();
    }

    return document.fonts.ready;
}

function esperarFondo() {
    return new Promise((resolve) => {
        window.addEventListener('fondo:cargado', resolve, { once: true });
    });
}

function esperarAudios() {
    const audios = Array.from(document.querySelectorAll('audio'));

    if (audios.length === 0) {
        return Promise.resolve();
    }

    const promesas = audios.map((audio) => {
        if (audio.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            return Promise.resolve();
        }

        return new Promise((resolve) => {
            const finalizar = () => {
                limpiar();
                resolve();
            };

            const limpiar = () => {
                audio.removeEventListener('loadeddata', finalizar);
                audio.removeEventListener('error', finalizar);
            };

            audio.addEventListener('loadeddata', finalizar, { once: true });
            audio.addEventListener('error', finalizar, { once: true });
        });
    });

    return Promise.all(promesas);
}

function esperarVideos() {
    const videos = Array.from(document.querySelectorAll('video'));

    if (videos.length === 0) {
        return Promise.resolve();
    }

    const promesas = videos.map((video) => {
        //if (video.readyState >= 3) { return Promise.resolve(); }
        /*
         * Si ya tenemos datos suficientes para mostrar
         * el primer frame, no necesitamos esperar más.
        */
        if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
            return Promise.resolve();
        }


        return new Promise((resolve) => {
            const finalizar = () => {
                limpiar();
                resolve();
            }

            const limpiar = () => {
                video.removeEventListener('loadeddata', finalizar); // usar loadeddata en lugar de canplaythrough, listo visiblemente pero no necesariamente cargado completamente
                video.removeEventListener('error', finalizar);
            }

            video.addEventListener('loadeddata', finalizar, { once: true });
            video.addEventListener('error', finalizar, { once: true });
        });
    });

    return Promise.all(promesas);
}

function esperarRenderizado() {
    return new Promise((resolve) => {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // esperamos dos frames para asegurarnos de que el renderizado se haya completado
                resolve();
            });
        });
    });
}

async function prepararEntorno() {
    actualizarLoading(0);
    /*
     * Recursos: 
     * Fuentes -> 25%
     * Imágenes -> 50%
     * Audios -> 65%
     * Videos -> 75%
     * Renderizado -> porcentajeRecursos% (85 o 95% por ejemplo)
    */

    const fondoCargado = esperarFondo();

    await esperarFuentes();
    actualizarLoading(25);

    await fondoCargado;
    // esperando recursos del fonto antes de comenzar el loading

    await esperarImagenes();
    actualizarLoading(50);

    await esperarAudios();
    actualizarLoading(65);

    await esperarVideos();
    actualizarLoading(75);

    await esperarRenderizado();
    actualizarLoading(porcentajeRecursos);

    await esperarRenderizado();
    actualizarLoading(100);

    window.dispatchEvent(new Event('loading:finalizado'));
}

function iniciarLoading() {
    bloquearScroll();
    actualizarLoading(0);

    suscribirFinalizado();
    suscribirQuitado();

    prepararEntorno();
}

/* ============================================================================================================
 * Inicialización
 * ==========================================================================================================*/
document.addEventListener('DOMContentLoaded', () => {
    iniciarLoading();
}, { once: true });
