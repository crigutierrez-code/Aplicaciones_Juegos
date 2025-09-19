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

function manejarLetra(letra){
    
    const letraMin = letra.toLowerCase();
    if (usadas.has(letraMin)) return;
        usadas.add(letraMin);

    document.querySelectorAll("#letras button")
    .forEach(b=>{if (b.textContent === letra) b.disabled = true;});

    if(Palabra.includes(letraMin)){
        for(let i=0; i<Palabra.length; i++){
            if(Palabra[i]===letraMin) oculta[i]=letraMin;
        }

        palabra.textContent= oculta.join(" ");
        if(!oculta.includes("_")){
            fin(true);
        }
    }else{
        fallos++;
        cambiarImagen(fallos);
        if(fallos===MAX_F){
            fin(false);
        }
    }
    guardarPartida();
}

function fin(ganado){
    document.querySelectorAll("#letras button").forEach(b=>b.disabled=true);
    msg.textContent= ganado? "¡Felicidades, ganaste!": `¡Lo siento, perdiste! La palabra era: ${Palabra}`;
    msg.className= ganado? "ganaste":"perdiste";
    sessionStorage.removeItem("ahorcado");
}

function guardarPartida(){
    sessionStorage.setItem("ahorcado", JSON.stringify({Palabra, oculta: oculta.join(""),usadas: [...usadas] , fallos}));
}

function cargarPartida(){
  const raw = sessionStorage.getItem('ahorcado');
  if(!raw) return;
  try{
    const g = JSON.parse(raw);
    palabra = g.palabra;
    oculta  = g.oculta.split('');
    usadas  = new Set(g.usadas);
    fallos  = g.fallos;
    palabra.textContent = oculta.join(' ');
    cambiarImagen(fallos);
    for(let i=65;i<=90;i++){
      const letra=String.fromCharCode(i);
      if(usadas.has(letra)){
        const btn=[...letras.children].find(b=>b.textContent===letra);
        if(btn) btn.disabled=true;
      }
    }
  }catch(e){
    sessionStorage.removeItem('ahorcado');
  }
}
 
reset.onclick= ()=>{sessionStorage.removeItem("ahorcado"); iniciar();};
iniciar();
