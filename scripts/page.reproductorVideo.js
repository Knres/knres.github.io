'use strict';

import {
    actualizarBotonReproducir,
    actualizarBotonSilenciar,
    actualizarTiempo,
    controlarTecla
} from './import.reproductor.js';

function obtenerElementos() {
    return {
        reproductor: document.querySelector('.video-player'),
        medio: document.getElementById('video-principal'),
        botonReproducir: document.getElementById('video-play'),
        botonSilenciar: document.getElementById('video-mute'),
        botonPantallaCompleta: document.getElementById('video-fullscreen'),
        progreso: document.getElementById('video-progress'),
        volumen: document.getElementById('video-volume'),
        tiempo: document.getElementById('video-time'),
        esVideo: true
    };
}

function elementosCompletos(elementos) {
    return elementos.reproductor &&
        elementos.medio &&
        elementos.botonReproducir &&
        elementos.botonSilenciar &&
        elementos.botonPantallaCompleta &&
        elementos.progreso &&
        elementos.volumen &&
        elementos.tiempo;
}

function alternarReproduccion(elementos) {
    const { medio } = elementos;

    if (medio.paused) {
        medio.play().catch((error) => {
            console.error('No se pudo reproducir el vídeo:', error);
        });
    } else {
        medio.pause();
    }
}

function alternarSilencio(elementos) {
    elementos.medio.muted = !elementos.medio.muted;
    actualizarBotonSilenciar(elementos);
}

function alternarPantallaCompleta(elementos) {
    if (document.fullscreenElement) {
        document.exitFullscreen();
        return;
    }

    elementos.reproductor.requestFullscreen().catch((error) => {
        console.error('No se pudo activar la pantalla completa:', error);
    });
}

function controlarTeclaVideo(event, elementos) {
    if (event.key.toLowerCase() === 'f') {
        event.preventDefault();
        alternarPantallaCompleta(elementos);
    }
}

function suscribirEventos(elementos) {
    const { medio, botonReproducir, botonSilenciar, botonPantallaCompleta, progreso, volumen } = elementos;

    botonReproducir.addEventListener('click', () => alternarReproduccion(elementos));
    botonSilenciar.addEventListener('click', () => alternarSilencio(elementos));
    botonPantallaCompleta.addEventListener('click', () => alternarPantallaCompleta(elementos));
    medio.addEventListener('click', () => alternarReproduccion(elementos));

    medio.addEventListener('play', () => actualizarBotonReproducir(elementos));
    medio.addEventListener('pause', () => actualizarBotonReproducir(elementos));
    medio.addEventListener('timeupdate', () => actualizarTiempo(elementos));
    medio.addEventListener('durationchange', () => actualizarTiempo(elementos));
    medio.addEventListener('loadedmetadata', () => actualizarTiempo(elementos));

    progreso.addEventListener('input', () => {
        if (!medio.duration) return;
        medio.currentTime = (Number(progreso.value) / 100) * medio.duration;
    });

    volumen.addEventListener('input', () => {
        medio.volume = Number(volumen.value);
        medio.muted = medio.volume === 0;
        actualizarBotonSilenciar(elementos);
    });

    elementos.alternarReproduccion = () => alternarReproduccion(elementos);
    elementos.alternarSilencio = () => alternarSilencio(elementos);

    document.addEventListener('keydown', (event) => {
        controlarTecla(event, elementos, () => controlarTeclaVideo(event, elementos));
    });
}

function iniciarReproductorVideo() {
    const elementos = obtenerElementos();

    if (!elementosCompletos(elementos)) return;

    suscribirEventos(elementos);
    actualizarBotonReproducir(elementos);
    actualizarBotonSilenciar(elementos);
    actualizarTiempo(elementos);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarReproductorVideo, { once: true });
} else {
    iniciarReproductorVideo();
}
