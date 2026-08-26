'use strict';

async function addHeader() {
	const contenedor = document.getElementById('header');

	if (!contenedor) return;

	try {
		const respuesta = await fetch('./components/comp.header.html');

		if (!respuesta.ok) {
			throw new Error(`No se pudo cargar el header: ${respuesta.status}`);
		}

		contenedor.outerHTML = await respuesta.text();
		window.dispatchEvent(new Event('header:cargado'));
	} catch (error) {
		console.error(error);
	}
}

document.addEventListener('DOMContentLoaded', addHeader, { once: true });
