const img= document.getElementById("img");
const palabra= document.getElementById("Palabra");
const msg= document.getElementById("msg");
const letras= document.getElementById("letras");
const reset= document.getElementById("reset");


const PALABRAS=["javascript","java","python","html","css","react","angular","vue","node","express"];
const MAX_F =6;

let Palabra, oculta, usadas, fallos;

function cambiarImagen(fallos){
    img.src = `recursos/ahorcado${fallos}.png`;
}
