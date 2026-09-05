'use strict';

function crearEnlace(nombre, datos) {
	/*
	<a href="sourceUrl" target="_blank" rel="noopener noreferrer">{nombre}</a>
	*/
	const enlace = document.createElement('a');

	enlace.href = datos.sourceUrl;
	enlace.target = '_blank';
	enlace.rel = 'noopener noreferrer';
	enlace.textContent = nombre;

	return enlace;
}

function crearListaRecursos(recursos) {
	/* 
	<ul>
		<li><a></a></li>
		<li><a></a>
			<ul>
				<li><a></a></li>
				...
			</ul>
		</li>
		...
	</ul>
	*/
	const lista = document.createElement('ul');

	Object.entries(recursos).forEach(([nombre, datos]) => {
		if (nombre === 'sourceUrl') return;

		const elemento = document.createElement('li');

		if (datos.sourceUrl) {
			elemento.append(crearEnlace(nombre, datos));
		}

		const subrecursos = Object.fromEntries(
			Object.entries(datos).filter(([clave]) => clave !== 'sourceUrl')
		);

		if (Object.keys(subrecursos).length > 0) {
			elemento.append(crearListaRecursos(subrecursos));
		}

		lista.append(elemento);
	});

	return lista;
}

function crearSecciones(recursos) {
	/*
	<section class="categoria" id="categoria"> 
		<h2>categoria</h2> 
	</section>
	*/
	const fragmento = document.createDocumentFragment();

	Object.entries(recursos).forEach(([categoria, elementos]) => {
		const seccion = document.createElement('section');

		seccion.className = categoria;
		seccion.id = categoria;

		const titulo = document.createElement('h2');
		titulo.textContent = categoria.charAt(0).toUpperCase() + categoria.slice(1);

		seccion.append(titulo, crearListaRecursos(elementos));
		fragmento.append(seccion);
	});

	return fragmento;
}

async function listarRecursos() {
	/*
	  Se diferencia 2 tipos de niveles, 1er nivel y resto
	  1er nivel: categoría de recursos (ej. fuentes, imágenes, videos)
	  resto: recursos dentro de cada categoría (ej. fuente1, fuente2, imagen1, imagen2, video1, video2)
	  pudiendo tener subrecursos (ej. fuente1 -> subrecurso1, subrecurso2)
	*//* Ejemplo de estructura final
	<section class="nombre1erNivel" id="nombre1erNivel"> 
		<h2>nombre1erNivel</h2> <!-- para h2 cambiar primera letra a mayúscula -->
		<ul><li><a href="sourceUrl2erNivel" target="_blank" rel="noopener noreferrer">nombre2doNivel</a></li></ul>
		<ul><li><a href="sourceUrl2erNivel" target="_blank" rel="noopener noreferrer">nombre2doNivel</a>
			<ul><li><a href="sourceUrl3erNivel" target="_blank" rel="noopener noreferrer">nombre3erNivel</a></li></ul>
			<ul><li><a href="sourceUrl3erNivel" target="_blank" rel="noopener noreferrer">nombre3erNivel</a></li></ul>
		</li></ul>
	</section>
	*/
	const contenedor = document.getElementById('contenedorRecursos');

	if (!contenedor) return;

	try {
		const respuesta = await fetch('./data/resources.json');

		if (!respuesta.ok) {
			throw new Error(`No se pudo cargar los recursos: ${respuesta.status}`);
		}

		const recursos = await respuesta.json();

		contenedor.replaceChildren(crearSecciones(recursos));
		window.dispatchEvent(new Event('recursos:cargados'));
	} catch (error) {
		console.error(error);
	}
}

document.addEventListener('DOMContentLoaded', listarRecursos, { once: true });