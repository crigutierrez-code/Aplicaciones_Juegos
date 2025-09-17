// Referencias al DOM
const formularioTarea = document.getElementById("formularioTarea");
const fechaTarea = document.getElementById("fechaTarea");
const descripcionTarea = document.getElementById("descripcionTarea");
const listaTareas = document.getElementById("listaTareas");
const buscarEntrada = document.getElementById("buscarEntrada");
const contadorPendientes = document.getElementById("contadorPendientes");
const contadorCompletadas = document.getElementById("contadorCompletadas");

// Cargar tareas guardadas
let tareas = JSON.parse(localStorage.getItem("tareas")) || [];

// Función para mostrar tareas
function mostrarTareas(filtro = "") {
  listaTareas.innerHTML = "";
  let pendientes = 0;
  let completadas = 0;

  tareas
    .filter(tarea => tarea.descripcion.toLowerCase().includes(filtro.toLowerCase()))
    .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
    .forEach((tarea, indice) => {
      const li = document.createElement("li");
      li.classList.add("tarea-item");
      if (tarea.completada) li.classList.add("completada");

      li.innerHTML = `
        <span>${tarea.fecha} - ${tarea.descripcion}</span>
        <div class="botones-tarea">
          <button class="completar-btn">${tarea.completada ? "Pendiente" : "Completar"}</button>
          <button class="eliminar-btn">Eliminar</button>
        </div>
      `;

      // Eventos botones
      li.querySelector(".completar-btn").addEventListener("click", () => alternarCompleta(indice));
      li.querySelector(".eliminar-btn").addEventListener("click", () => eliminarTarea(indice));

      listaTareas.appendChild(li);

      if (tarea.completada) completadas++;
      else pendientes++;
    });

  contadorPendientes.textContent = pendientes;
  contadorCompletadas.textContent = completadas;
}

// Agregar nueva tarea
formularioTarea.addEventListener("submit", e => {
  e.preventDefault();
  const nuevaTarea = {
    fecha: fechaTarea.value,
    descripcion: descripcionTarea.value,
    completada: false
  };
  tareas.push(nuevaTarea);
  guardarTareas();
  formularioTarea.reset();
});

// Cambiar estado de tarea (pendiente/completada)
function alternarCompleta(indice) {
  tareas[indice].completada = !tareas[indice].completada;
  guardarTareas();
}

// Eliminar tarea
function eliminarTarea(indice) {
  tareas.splice(indice, 1);
  guardarTareas();
}

// Guardar en localStorage
function guardarTareas() {
  localStorage.setItem("tareas", JSON.stringify(tareas));
  mostrarTareas(buscarEntrada.value);
}

// Filtrar tareas
buscarEntrada.addEventListener("input", e => {
  mostrarTareas(e.target.value);
});

// Inicializar
mostrarTareas();
