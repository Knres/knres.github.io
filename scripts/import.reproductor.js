'use strict';

export function formatearTiempo(segundos) {
    if (!Number.isFinite(segundos)) return '00:00';

    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = Math.floor(segundos % 60);

    return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
}

export function actualizarTiempo(estado) {
    const { medio, progreso, tiempo } = estado;
    const porcentaje = medio.duration ? (medio.currentTime / medio.duration) * 100 : 0;

    progreso.value = String(porcentaje);
    tiempo.textContent = `${formatearTiempo(medio.currentTime)} / ${formatearTiempo(medio.duration)}`;
}

export function actualizarBotonReproducir(estado) {
    const { medio, botonReproducir, esVideo } = estado;
    const tipoMedio = esVideo ? 'vídeo' : 'audio';

    botonReproducir.textContent = medio.paused ? 'Reproducir' : 'Pausar';
    botonReproducir.setAttribute(
        'aria-label',
        medio.paused ? `Reproducir ${tipoMedio}` : `Pausar ${tipoMedio}`
    );
}

export function actualizarBotonSilenciar(estado) {
    const { medio, botonSilenciar } = estado;

    botonSilenciar.textContent = medio.muted ? 'Activar sonido' : 'Silenciar';
    botonSilenciar.setAttribute('aria-pressed', String(medio.muted));
}

export function controlarTecla(event, estado, controlarTeclaEspecifica) {
    if (
        event.target instanceof Element &&
        event.target.matches('button, input, textarea, select, [contenteditable="true"]')
    ) return;

    switch (event.key.toLowerCase()) {
        case ' ':
        case 'k':
            event.preventDefault();
            estado.alternarReproduccion();
            break;
        case 'arrowleft':
            event.preventDefault();
            estado.medio.currentTime = Math.max(0, estado.medio.currentTime - 5);
            break;
        case 'arrowright':
            event.preventDefault();
            estado.medio.currentTime = Math.min(
                estado.medio.duration || 0,
                estado.medio.currentTime + 5
            );
            break;
        case 'm':
            event.preventDefault();
            estado.alternarSilencio();
            break;
        default:
            controlarTeclaEspecifica?.(event);
    }
}
