const tablero = document.getElementById("tablero");
const tiempoEl = document.getElementById("tiempo");
const intentosEl = document.getElementById("intentos");
const mejorTiempoEl = document.getElementById("MejorTiempo");
const mejorIntentosEl = document.getElementById("MejorIntento");
const botonIniciar = document.getElementById("iniciar");
const dificultadSelect = document.getElementById("dificultad");

// Creación de las variables
let primeraCarta, segundaCarta;
let tableroBloqueado = false;
let intentos = 0;
let aciertos = 0;
let totalParejas = 0;
let temporizador;
let segundos = 0;

// Guardar récords en localStorage
let mejorTiempo = localStorage.getItem("mejorTiempo");
let mejorIntentos = localStorage.getItem("mejorIntentos");
if (mejorTiempo) mejorTiempoEl.textContent = mejorTiempo + " seg";
if (mejorIntentos) mejorIntentosEl.textContent = mejorIntentos;

// Iniciar juego
botonIniciar.addEventListener("click", iniciarJuego);

function iniciarJuego() {
    tablero.innerHTML = "";
    intentos = 0;
    aciertos = 0;
    intentosEl.textContent = 0;
    tiempoEl.textContent = 0;
    clearInterval(temporizador);
    segundos = 0;

    const tamano = parseInt(dificultadSelect.value);
    tablero.style.gridTemplateColumns = `repeat(${tamano}, 1fr)`;

    let numCartas = tamano * tamano;
    if (numCartas % 2 !== 0) numCartas--; // si es impar, quitamos 
    totalParejas = numCartas / 2;

    // Generar pares de emojis
    let emojis = ["🍎","🍌","🍇","🍓","🍒","🍑","🍉","🥝","🍍","🥥","🥑","🍆","🥕","🌽","🍅","🥔","🧄","🧅","🥦","🥬"];
    emojis = emojis.sort(() => 0.5 - Math.random()).slice(0, totalParejas);
    let cartasArray = [...emojis, ...emojis].sort(() => 0.5 - Math.random());

    // Crear cartas
    cartasArray.forEach(simbolo => {
        const carta = document.createElement("div");
        carta.classList.add("card");
        carta.innerHTML = `
            <div class="front">${simbolo}</div>
            <div class="back"></div>
        `;
        carta.addEventListener("click", voltearCarta);
        tablero.appendChild(carta);
    });

    // Iniciar temporizador
    temporizador = setInterval(() => {
        segundos++;
        tiempoEl.textContent = segundos;
    }, 1000);
}

function voltearCarta() {
    if (tableroBloqueado) return;
    if (this === primeraCarta) return;

    this.classList.add("flip");

    if (!primeraCarta) {
        primeraCarta = this;
        return;
    }

    segundaCarta = this;
    tableroBloqueado = true;
    intentos++;
    intentosEl.textContent = intentos;

    comprobarPareja();
}

function comprobarPareja() {
    let esPareja = primeraCarta.querySelector(".front").textContent === segundaCarta.querySelector(".front").textContent;

    if (esPareja) {
        deshabilitarCartas();
        aciertos++;
        if (aciertos === totalParejas) terminarJuego();
    } else {
        ocultarCartas();
    }
}

function deshabilitarCartas() {
    primeraCarta.removeEventListener("click", voltearCarta);
    segundaCarta.removeEventListener("click", voltearCarta);
    reiniciarTablero();
}

function ocultarCartas() {
    setTimeout(() => {
        primeraCarta.classList.remove("flip");
        segundaCarta.classList.remove("flip");
        reiniciarTablero();
    }, 1000);
}

function reiniciarTablero() {
    [primeraCarta, segundaCarta] = [null, null];
    tableroBloqueado = false;
}

function terminarJuego() {
    clearInterval(temporizador);
    setTimeout(()=>{
    alert(`🎉 ¡Juego terminado! Tiempo: ${segundos} seg, Intentos: ${intentos}`);
    },200)
    // Guardar récords
    if (!mejorTiempo || segundos < mejorTiempo) {
        mejorTiempo = segundos;
        localStorage.setItem("mejorTiempo", mejorTiempo);
        mejorTiempoEl.textContent = mejorTiempo + " seg";
    }
    if (!mejorIntentos || intentos < mejorIntentos) {
        mejorIntentos = intentos;
        localStorage.setItem("mejorIntentos", mejorIntentos);
        mejorIntentosEl.textContent = mejorIntentos;
    }
}
