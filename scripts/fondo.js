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
    const video = document.getElementById('fondovideo');
    
    if (!video) return;

    video.play().catch((error) => {
        console.error('Error al reproducir el video de fondo:', error);
    });
}

function reproducirAudioSaludo() {
    const audio = document.getElementById('audiosaludo');

    if (!audio) return;

    // autoplay -> error.name === 'NotAllowedError'
    audio.play().catch((error) => {
        if (error.name === 'NotAllowedError') {
            const reproducirConInteraccion = (event) => {
                if (event.type === 'keydown'){
                    const teclasIgnoradas = ['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab'];
                    if (teclasIgnoradas.includes(event.key)) return;
                }
                

                if (audio.paused) {
                    audio.play().then(() => {
                        // eliminar listeners tras reproducir el audio
                        window.removeEventListener('pointerdown', reproducirConInteraccion);
                        window.removeEventListener('keydown', reproducirConInteraccion);

                        audio.addEventListener('ended', () => {
                            // eliminar del dom tras terminar de reproducir el audio
                            audio.remove();
                        }, { once: true });

                    }).catch((errorAlReproducir) => {
                        console.error('Error al reproducir el audio de saludo después de la interacción del usuario:', errorAlReproducir);
                    });
                }
            };

            window.addEventListener('pointerdown', reproducirConInteraccion, { once: true });
            window.addEventListener('keydown', reproducirConInteraccion);// no { once: true } hay teclas no validas
            return;
        }

        console.error('Error al reproducir el audio de saludo:', error);
    });
}

window.addEventListener('loading:finalizado', () => {
    reproducirFondoVideo();
    reproducirAudioSaludo();
}, { once: true });
