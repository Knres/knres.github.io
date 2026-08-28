# 📘 Tareas Actuales

---

## 📌 Estados

⬜ nueva
🟡 en_progreso  
✅ finalizada  

<!-- 


### ⬜ () 
- ⬜ Fecha propuesta: //2026
- ⬜ 
- 🟡
- ✅
- ✅ Fecha de cierre: //2026

---


-->
---

## 📝 Tareas

### ⬜ (style/*.ccs) Implemetacion de estilos alternativos 
- ⬜ Fecha propuesta: 28/08/2026
- ⬜ Implemetar estilos alternativos (
    modo noche, 
    modo claro, 
    modo personalizado, <-- dejar para el futuro
    alto contraste, 
    texto grande, 
    alto contraste + texto grande, 
    estilo impreso),
    uso de tipografias Arial&Roboto para mejorar la legibilidad en estilos como alto contraste o texto grande (o directamente sustituir las tipografias actuales)
- ⬜ en accesibilidad.html realizar la seleccion de estilo o personalización del estilo

---


### ✅ (script/loading.js) Modificar el orden de inicialización del loading para poder convertir fondo en modulos importables
- ⬜ Fecha propuesta: 26/08/2026
- ⬜ La inicialización de loading.js actual, si se importa fondo como modulo afectaria al loading, quitandose antes de tiempo, sin haverse cargado el videofondo... -> modificar el orden de inicialización del loading
- ✅ loading.js espera el evento `fondo:cargado` antes de las comprobaciones, si no se queda esperando en el 25%(despues de fuentes)
- ✅ Fecha de cierre: 28/08/2026


---

### ✅ (script/loading.js) Enlazar carga de recursos con el loading
- ⬜ Fecha propuesta: 24/08/2026
- ⬜ El loading no funciona como se esperaba, se quita la pantalla de loading antes de que se preparase todo el entorno.
- 🟡 Se ha sustituido la carca de recursos por un aumento progresivo
- ✅ Se ha modificado el loading para que el progreso sea por partes segun tipo de recursos Fuentes -> 25%, Imágenes -> 50%, Videos -> 75%, Renderizado -> porcentajeRecursos% (85 o 95% por ejemplo)
- ✅ Fecha de cierre: 26/08/2026

---