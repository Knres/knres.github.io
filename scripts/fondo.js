'use strict';

/* 
 * Se necesita que el loading se haya finalizado para poder ejecutar el código de fondo.js, 
 * ya que este código depende de que el loading haya terminado para poder ejecutarse correctamente.
 * 
 * Por lo tanto, se suscribe al evento 'loading:finalizado' para que se ejecute el código de fondo.js 
 * una vez que el loading haya finalizado.
 * 
 * Esto asegura que el código de fondo.js se ejecute en el momento adecuado y no antes de que el loading haya terminado.
 */

function reproducirFondoVideo() {
    const video = document.getElementById('fondovideo') || document.getElementById('fondo-video');
    
    if (!video) return;

    video.play().catch((error) => {
        console.error('Error al reproducir el video de fondo:', error);
    });
}

window.addEventListener('loading:finalizado', () => {
    reproducirFondoVideo();
}, { once: true });
