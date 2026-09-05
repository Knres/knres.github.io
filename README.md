<a name="readme-top"></a>
<!--
<p align="right">(<a href="#readme-top">volver arriba</a>)</p>
-->

<div align="center">
    <a href="https://knres.github.io/" target="_blank" rel="noopener noreferrer">
        <img width="300px" src="./images/logo.webp" alt="Logo de Spider-Man: Brand New Day" />
    </a>
</div>


<details>
   <summary>Índice</summary>

</details>


# Pages
Este proyecto es un sitio web estático desarrollado en HTML, CSS y JavaScript, pensado para hacer pruebas y utilizada como página personal.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## 1. Estructura del proyecto
```text
./
├── README.md
├── TODO.md
├── .gitignore
│
├── index.html
├── 404.html
├── recursos.html
├── accesibilidad.html
├── cookies.html
│
├── components/
│   ├── comp.bannerCookies.html
│   ├── comp.fondo.html
│   ├── comp.footer.html
│   └── comp.header.html
│
├── styles/
│   ├── estilo.css
│   ├── fondo.css
│   └── loading.css
│
├── scripts/
│   ├── add.bannerCookies.js
│   ├── add.fondo.js
│   ├── add.footer.js
│   ├── add.header.js
│   │
│   ├── import.cookies.js
│   │
│   ├── page.cookies.js
│   │
│   ├── clock.js
│   ├── fondo.js
│   ├── loading.js
│   └── listarRecursos.js
│
├── data/
│   └── resources.json
│
├── fonts/
│   ├── anton-latin.woff2
│   └── inter-latin.woff2
│
├── images/
│   ├── favicon.ico
│   ├── favicon.png
│   ├── loading.svg
│   └── logo.webp
│
├── audios/
│   ├── ohaiyogozaimasu.mp3
│   └── ohaiyogozaimasu.wav
│
├── videos/
│   ├── atri.mp4
│   └── atri.webm
└──
```

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## 2. Stack técnico
   - HTML5
   - CSS3
   - JavaScript ES modules
   - JSON
   - Archivos estáticos para recursos multimedia
   - GitHub Pages como despliegue natural

   No hay framework ni compilación ni bundler.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## 3. Páginas
   - `index.html`: Es la página principal del sitio. 

   - `404.html`: Página de error 404.

   - `recursos.html`: Muestra información de los recursos utilizados en el proyecto, leyendo la estructura del archivo JSON ubicado en `data/resources.json` y renderizándola dinámicamente con JavaScript.

   - `accesibilidad.html`: Incluye una declaración de accesibilidad con enfoque en WCAG, semántica HTML, contraste, uso de teclado y opciones de estilo accesible.

   - `cookies.html`: Es la página de política de cookies, relacionada con el banner y con la gestión de consentimiento.

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## 4. Componentes de Páginas
   Estos componentes se importaran a las páginas con los scripts de `scripts/add.*`.
   
   - `components/comp.header.html`: cabecera de todas las páginas

   - `components/comp.footer.html`: pie de página de todas las páginas

   - `components/comp.fondo.html`: estructura del fondo

   - `components/comp.bannerCookies.html`: banner de consentimientos de cookies

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>

## 5. Scripts
   ### 5.1. Add
   Scripts para importar componentes a las páginas
   - `scripts/add.header.js`: inyecta el header
   - `scripts/add.footer.js`: inyecta el footer
   - `scripts/add.fondo.js`: inyecta el fondo
   - `scripts/add.bannerCookies.js`: inyecta el banner de aceptar o rechazar cookies

   ### 5.2. Import
   Scripts importables para ser reutilizados
   - `scripts/import.cookies.js`: almacenamiento, lectura y eliminación de cookies
   
   ### 5.3. Page
   scripts especificos de páginas
   - `scripts/page.recursos.js`: procesa el JSON de recursos y genera la lista en pantalla
   - `scripts/page.cookies.js`: consentir o quitar consentimiento de cookies

   ### 5.4. Otros
   - `scripts/loading.js`: controla la barra de progreso y el bloqueo del scroll durante carga
   - `scripts/fondo.js`: reproduce el video y audio al finalizar el loading
   - `scripts/clock.js`: muestra la hora y fecha

<p align="right">(<a href="#readme-top">volver arriba</a>)</p>
