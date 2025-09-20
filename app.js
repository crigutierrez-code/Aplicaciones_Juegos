// Referencias al DOM
const formularioTarea = document.getElementById("formularioTarea");
const fechaTarea = document.getElementById("fechaTarea");
const descripcionTarea = document.getElementById("descripcionTarea");
const listaTareas = document.getElementById("listaTareas");
const buscarEntrada = document.getElementById("buscarEntrada");
const contadorPendientes = document.getElementById("contadorPendientes");
const contadorCompletadas = document.getElementById("contadorCompletadas");

// IndexedDB
let db;
const request = indexedDB.open("TareasDB", 1);

request.onupgradeneeded = function (e) {
  db = e.target.result;
  const store = db.createObjectStore("tareas", { keyPath: "id", autoIncrement: true });
  store.createIndex("fecha", "fecha", { unique: false });
  store.createIndex("descripcion", "descripcion", { unique: false });
  store.createIndex("completada", "completada", { unique: false });
};

request.onsuccess = function (e) {
  db = e.target.result;
  mostrarTareas();
};

request.onerror = function (e) {
  console.error("Error al abrir IndexedDB:", e.target.errorCode);
};

// Función para mostrar tareas
function mostrarTareas(filtro = "") {
  listaTareas.innerHTML = "";
  let pendientes = 0;
  let completadas = 0;

  const transaction = db.transaction(["tareas"], "readonly");
  const store = transaction.objectStore("tareas");
  const request = store.getAll();

  request.onsuccess = function () {
    let tareas = request.result;

    tareas
      .filter(t => t.descripcion.toLowerCase().includes(filtro.toLowerCase()))
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .forEach(tarea => {
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

        li.querySelector(".completar-btn").addEventListener("click", () => alternarCompleta(tarea.id, tarea.completada));
        li.querySelector(".eliminar-btn").addEventListener("click", () => eliminarTarea(tarea.id));

        listaTareas.appendChild(li);

        if (tarea.completada) completadas++;
        else pendientes++;
      });

    contadorPendientes.textContent = pendientes;
    contadorCompletadas.textContent = completadas;
  };    
}

// Agregar nueva tarea
formularioTarea.addEventListener("submit", e => {
  e.preventDefault(); 

  // Validación: evitar campos vacíos
  if (!descripcionTarea.value.trim()) {
    alert("Por favor completa todos los campos antes de agregar la tarea.");
    return; 
  }

  const nuevaTarea = {
    fecha: fechaTarea.value,
    descripcion: descripcionTarea.value,
    completada: false
  };

  const transaction = db.transaction(["tareas"], "readwrite");
  const store = transaction.objectStore("tareas");
  store.add(nuevaTarea);

  transaction.oncomplete = () => {
    mostrarTareas();
    formularioTarea.reset();
  };
});

// Cambiar estado de tarea (pendiente/completada)
function alternarCompleta(id, estadoActual) {
  const transaction = db.transaction(["tareas"], "readwrite");
  const store = transaction.objectStore("tareas");
  const request = store.get(id);

  request.onsuccess = function () {
    const tarea = request.result;
    tarea.completada = !estadoActual;
    store.put(tarea);
  };

  transaction.oncomplete = () => mostrarTareas(buscarEntrada.value);
}

// Eliminar tarea
function eliminarTarea(id) {
  const transaction = db.transaction(["tareas"], "readwrite");
  const store = transaction.objectStore("tareas");
  store.delete(id);

  transaction.oncomplete = () => mostrarTareas(buscarEntrada.value);
}

// Filtrar tareas
buscarEntrada.addEventListener("input", e => {
  mostrarTareas(e.target.value);
});
