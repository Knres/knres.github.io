'use strict';

async function addFooter() {
	const contenedor = document.getElementById('footer');

	if (!contenedor) return;

	try {
		const respuesta = await fetch('./components/comp.footer.html');

		if (!respuesta.ok) {
			throw new Error(`No se pudo cargar el footer: ${respuesta.status}`);
		}

		contenedor.outerHTML = await respuesta.text();
		window.dispatchEvent(new Event('footer:cargado'));
	} catch (error) {
		console.error(error);
	}
}

document.addEventListener('DOMContentLoaded', addFooter, { once: true });
