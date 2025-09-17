const img= document.getElementById("img");
const palabra= document.getElementById("palabra");
const msg= document.getElementById("msg");
const letras= document.getElementById("letras");
const reset= document.getElementById("reset");

const PALABRAS=["javascript","java","python","html","css","react","angular","vue","node","express"];
const MAX_F =6;

let Palabra, oculta, usadas, fallos;

function cambiarImagen(fallos){
    img.src=`img/ahorcado${fallos}.png`;
}

function iniciar(){
    Palabra= PALABRAS[Math.floor(Math.random()*PALABRAS.length)]
    oculta= Array(Palabra.length).fill("_");
    usadas= new setInterval();
    fallos=0;
    palabra.textContent= oculta.join(" ");
    msg.textContent= "";
    msg.className="";
    letras.innerHTML="";
    for(let i=65; i<90; i++){
        const btn= document.createElement("button");
        btn.textContent= String.fromCharCode(i);
        btn.onclick= manejarLetra(btn.textContent);
        letras.appendChild(btn);
    }
    cambiarImagen(0);
    cargaPartida();
}

function manejarLetra(letra){
    if(usadas.has(letra)) return;
    usadas.add(letra);

    document.querySelectorAll("#letras button").forEach(b=>{if(b.textContent===letra) b.disabled=true;});

    if(Palabra.includes(letra)){
        for(let i=0; i<Palabra.length; i++){
            if(Palabra[i]===letra) oculta[i]=letra;
        }
    }

    palabra.textContent= oculta.join(" ");
    if(!oculta.includes("_")){
        fin(true);
    }else{
        fallos++;
        cambiarImagen(fallos);
        if(fallos===MAX_F){
            fin(false);
        }
        guardarPartida();
    }

    function fin(ganado){
        document.querySelectorAll("#letras button").forEach(b=>b.disabled=true);
        msg.textContent= ganado? "¡Felicidades, ganaste!":"¡Lo siento, perdiste! La palabra era: ${Palabra}";
        
    }
}
