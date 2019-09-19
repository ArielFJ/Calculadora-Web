let pantalla = document.querySelector('textarea');

let botones = document.querySelectorAll('.boton');

let botonesArr = Array.from(botones);

desplegarLocalStorage();

for(boton of botonesArr){
    boton.addEventListener('click', cambiarPantalla);
}

document.getElementById('limpiar-btn').addEventListener('click', function(e){
    localStorage.clear();
    limpiarHistorial();
    desplegarLocalStorage();
})

let numeros = [];
let signos = [];

let haSidoCalculado = false;
let signoDeOperacion = false;

function cambiarPantalla(e){
    e.preventDefault();
    let entrada = String(e.target.value);   

    if(entrada == '+' || entrada == '-' || entrada == '*' || entrada == '/'){
        signos.push(entrada);
        numeros.push(pantalla.textContent);
        signoDeOperacion = true;
    }else if(entrada == '='){
        if(numeros.length > 0 && signos.length > 0){
            numeros.push(pantalla.textContent);
            pantalla.textContent = calcular(numeros, signos);
            if(localStorage.length > 12){
                eliminarPrimerElementoLS();
            }
            limpiarHistorial();
            desplegarLocalStorage();
            numeros = [];
            signos = [];
            haSidoCalculado = true;
        }
    }else if( entrada == 'C' || entrada == 'CE'){
        pantalla.textContent = '';
        numeros = [];
        signos = [];
    }
    else if(entrada == '%'){

    }
    else{
        if(haSidoCalculado){
            pantalla.textContent = '';
            haSidoCalculado = false;
        }
        if(signoDeOperacion){
            pantalla.textContent = '';
            signoDeOperacion = false;
        }
        
        pantalla.textContent = pantalla.textContent + entrada;
    }

}

let resultado = 0;

function calcular(numeros, signos){
    for(let i = 0; i < signos.length; i++){
        if(i == 0){
            resultado = numeros[0];
        }

        switch(signos[i]){
            case '+':
                resultado = Number(resultado) + Number(numeros[i + 1]);
                break;
            case '-':
                resultado = resultado - numeros[i + 1];
                break;
            case '*':
                resultado = resultado * numeros[i + 1];
                break;
            case '/':
                resultado = resultado / numeros[i + 1];
                break;
            default:
                break;

        }
    }
    localStorage.setItem(intercalarOperacion(numeros, signos), resultado);
    
    return resultado;
}


function intercalarOperacion(numeros, signos){
    let operacion = [];
    for(let i = 0; i < numeros.length; i++){
        operacion.push(numeros[i]);
        if(i < signos.length){
            operacion.push(signos[i]);
        }
    }
    return operacion;
}

function desplegarLocalStorage(){
    
    for(let i = 0; i < localStorage.length; i++){
        let llave = localStorage.key(i);
        let valor = localStorage.getItem(llave);
        let clave = llave.replace(/,/g,' ');

        let parrafo = document.createElement('p');

        parrafo.align = 'center';
        parrafo.style.fontSize = '24px';
        parrafo.className = 'parrafo';
        parrafo.appendChild(document.createTextNode(clave+' = '+valor));

        //console.log(parrafo);
        document.querySelector('#historial').appendChild(parrafo);
    }

}

function limpiarHistorial(){
    let parrafos = document.getElementsByClassName('parrafo');
    let parrafosArr = Array.from(parrafos);
    parrafosArr.forEach(function(parrafo){
        parrafo.remove();
    })
}

function eliminarPrimerElementoLS(){
    localStorage.removeItem(localStorage.key(0));
}