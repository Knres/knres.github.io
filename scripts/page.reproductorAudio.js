'use strict';

import {
    actualizarBotonReproducir,
    actualizarBotonSilenciar,
    actualizarTiempo,
    controlarTecla
} from './import.reproductor.js';

function obtenerElementos() {
    return {
        reproductor: document.querySelector('.audio-player'),
        medio: document.getElementById('audio-principal'),
        botonReproducir: document.getElementById('audio-play'),
        botonSilenciar: document.getElementById('audio-mute'),
        botonRepetir: document.getElementById('audio-repeat'),
        progreso: document.getElementById('audio-progress'),
        volumen: document.getElementById('audio-volume'),
        tiempo: document.getElementById('audio-time'),
        esVideo: false
    };
}

function elementosCompletos(elementos) {
    return elementos.reproductor &&
        elementos.medio &&
        elementos.botonReproducir &&
        elementos.botonSilenciar &&
        elementos.botonRepetir &&
        elementos.progreso &&
        elementos.volumen &&
        elementos.tiempo;
}

function alternarReproduccion(elementos) {
    const { medio } = elementos;

    if (medio.paused) {
        medio.play().catch((error) => {
            console.error('No se pudo reproducir el audio:', error);
        });
    } else {
        medio.pause();
    }
}

function alternarSilencio(elementos) {
    elementos.medio.muted = !elementos.medio.muted;
    actualizarBotonSilenciar(elementos);
}

function alternarRepeticion(elementos) {
    const { medio, botonRepetir } = elementos;

    medio.loop = !medio.loop;
    botonRepetir.setAttribute('aria-pressed', String(medio.loop));
    botonRepetir.textContent = medio.loop ? 'Repetición activa' : 'Repetir';
}

function controlarTeclaAudio(event, elementos) {
    if (event.key.toLowerCase() === 'r') {
        event.preventDefault();
        alternarRepeticion(elementos);
    }
}

function suscribirEventos(elementos) {
    const { medio, botonReproducir, botonSilenciar, botonRepetir, progreso, volumen } = elementos;

    botonReproducir.addEventListener('click', () => alternarReproduccion(elementos));
    botonSilenciar.addEventListener('click', () => alternarSilencio(elementos));
    botonRepetir.addEventListener('click', () => alternarRepeticion(elementos));

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
        controlarTecla(event, elementos, () => controlarTeclaAudio(event, elementos));
    });
}

function iniciarReproductorAudio() {
    const elementos = obtenerElementos();

    if (!elementosCompletos(elementos)) return;

    suscribirEventos(elementos);
    actualizarBotonReproducir(elementos);
    actualizarBotonSilenciar(elementos);
    actualizarTiempo(elementos);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarReproductorAudio, { once: true });
} else {
    iniciarReproductorAudio();
}
