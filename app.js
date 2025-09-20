const tablero = document.getElementById("tablero");
const tiempoEl = document.getElementById("tiempo");
const intentosEl = document.getElementById("intentos");
const mejorTiempoEl = document.getElementById("MejorTiempo");
const mejorIntentosEl = document.getElementById("MejorIntento");
const botonIniciar = document.getElementById("iniciar");

let dificultadSeleccionada = null; // se asigna al elegir en el menú

// Estado del juego
let primeraCarta = null;
let segundaCarta = null;
let tableroBloqueado = false;
let intentos = 0;
let aciertos = 0; 
let totalParejas = 0;
let temporizador = null;
let segundos = 0;

// Récords
let mejorTiempo = localStorage.getItem("mejorTiempo");
let mejorIntentos = localStorage.getItem("mejorIntentos");
if (mejorTiempo) mejorTiempoEl.textContent = mejorTiempo + " seg";
if (mejorIntentos) mejorIntentosEl.textContent = mejorIntentos;

// Lista de imágenes
const frutas = [
    "recursos/banana.png",
    "recursos/durazno.png",
    "recursos/fresa.png",
    "recursos/kiwi.jpg",
    "recursos/mango.png",
    "recursos/pepino.png",
    "recursos/pina.png",
    "recursos/uva.png",
    "recursos/coco.jpeg",
    "recursos/manzana.png",
    "recursos/melon.jpeg",
    "recursos/pera.png",
    "recursos/sandia.jpg",
    "recursos/mandarina.png",
    "recursos/papaya.png",
    "recursos/guayaba.jpg",
    "recursos/lulo.png",
    "recursos/guanabana.jpg",
    "recursos/granadilla.jpg",
    "recursos/maracuya.png",
    "recursos/naranja.jpg",
    "recursos/limon.png",
    "recursos/lima.png",
    "recursos/toronja.jpg",
    "recursos/ciruela.jpg",
    "recursos/cereza.png",
    "recursos/frambuesa.jpg",
    "recursos/arandano.png",
    "recursos/mora.jpg",
    "recursos/higo.jpg",
    "recursos/tamarindo.png",
    "recursos/zapote.png",
    "recursos/caqui.png",
    "recursos/carambola.jpg",
    "recursos/pitahaya.jpg",
    "recursos/rambutan.jpg",
    "recursos/mangostino.jpg",
    "recursos/tomate.png",
    "recursos/zanahoria.png",
    "recursos/papa.jpg",
    "recursos/yuca.jpg",
    "recursos/batata.jpg",
    "recursos/cebolla.jpg",
    "recursos/ajo.jpg",
    "recursos/lechuga.jpg",
    "recursos/coliflor.jpg",
    "recursos/espinaca.jpg",
    "recursos/acelga.png",
    "recursos/brocoli.jpg",
    "recursos/calabaza.jpg"
];

// Selección de dificultad
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach(link => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        navLinks.forEach(l => l.classList.remove("active"));
        link.classList.add("active");
        dificultadSeleccionada = parseInt(link.dataset.dificultad);
    });
});

// Botón iniciar
botonIniciar.addEventListener("click", () => {
    if (!dificultadSeleccionada) {
        alert("Selecciona una dificultad antes de iniciar.");
        return;
    }
    iniciarJuego(dificultadSeleccionada);
});

function iniciarJuego(tamano) {
    // Reinicio
    tablero.innerHTML = "";
    intentos = 0;
    aciertos = 0;
    intentosEl.textContent = 0;
    tiempoEl.textContent = 0;
    clearInterval(temporizador);
    segundos = 0;
    primeraCarta = segundaCarta = null;
    tableroBloqueado = false;

    // Número de cartas
    let numCartas = tamano * tamano;
    if (numCartas % 2 !== 0) numCartas--;
    totalParejas = numCartas / 2;

    // Imágenes y duplicado
    const seleccionadas = shuffle(frutas).slice(0, totalParejas);
    const cartasArray = shuffle([...seleccionadas, ...seleccionadas]);

    // Grid dinámico
    tablero.style.gridTemplateColumns = `repeat(${tamano}, minmax(60px, 1fr))`;

    // Crear cartas
    cartasArray.forEach(src => {
        const carta = document.createElement("button");
        carta.type = "button";
        carta.className = "card";
        carta.dataset.image = src;
        carta.innerHTML = `
      <div class="inner">
        <div class="front"><img src="${src}" alt="fruta"></div>
        <div class="back" aria-hidden="true"></div>
      </div>
    `;
        carta.addEventListener("click", voltearCarta);
        tablero.appendChild(carta);
    });

    // Temporizador
    temporizador = setInterval(() => {
        segundos++;
        tiempoEl.textContent = segundos;
    }, 1000);
}

function voltearCarta(e) {
    if (tableroBloqueado) return;
    const carta = e.currentTarget;
    if (carta === primeraCarta || carta.classList.contains("matched")) return;

    carta.classList.add("flip");

    if (!primeraCarta) {
        primeraCarta = carta;
        return;
    }

    segundaCarta = carta;
    tableroBloqueado = true;
    intentos++;
    intentosEl.textContent = intentos;

    comprobarPareja();
}

function comprobarPareja() {
    const img1 = primeraCarta.dataset.image;
    const img2 = segundaCarta.dataset.image;

    if (img1 === img2) {
        primeraCarta.classList.add("matched");
        segundaCarta.classList.add("matched");
        primeraCarta.removeEventListener("click", voltearCarta);
        segundaCarta.removeEventListener("click", voltearCarta);
        resetTurno();
        aciertos++;
        if (aciertos === totalParejas) terminarJuego();
    } else {
        setTimeout(() => {
            primeraCarta.classList.remove("flip");
            segundaCarta.classList.remove("flip");
            resetTurno();
        }, 800);
    }
}

function resetTurno() {
    [primeraCarta, segundaCarta] = [null, null];
    tableroBloqueado = false;
}

function terminarJuego() {
    clearInterval(temporizador);
    setTimeout(() => {
        alert(`🎉 ¡Juego terminado! Tiempo: ${segundos} seg, Intentos: ${intentos}`);
    }, 200);

    if (!mejorTiempo || segundos < Number(mejorTiempo)) {
        mejorTiempo = segundos;
        localStorage.setItem("mejorTiempo", mejorTiempo);
        mejorTiempoEl.textContent = mejorTiempo + " seg";
    }
    if (!mejorIntentos || intentos < Number(mejorIntentos)) {
        mejorIntentos = intentos;
        localStorage.setItem("mejorIntentos", mejorIntentos);
        mejorIntentosEl.textContent = mejorIntentos;
    }
}

// Mezcla aleatoria
function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
