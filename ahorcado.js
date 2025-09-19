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

function iniciar(){
    Palabra= PALABRAS[Math.floor(Math.random()*PALABRAS.length)]
    oculta= Array(Palabra.length).fill("_");
    usadas= new Set();
    fallos=0;
    palabra.textContent= oculta.join(" ");
    msg.textContent= "";
    msg.className="";
    letras.innerHTML="";
    for(let i=65; i<90; i++){
        const btn= document.createElement("button");
        btn.textContent= String.fromCharCode(i);
        btn.onclick= ()=> manejarLetra(btn.textContent);
        letras.appendChild(btn);
    }
    cambiarImagen(0);
}
