//Esta variable guarda el text area donde se despliegan los números
let pantalla = document.querySelector('textarea');

//Este es el arreglo que contiene todos los botones de la calculadora
let botones = document.querySelectorAll('.boton');
let botonesArr = Array.from(botones);

//Este ciclo añade el evento a todos los botones
for(boton of botonesArr){
    boton.addEventListener('click', cambiarPantalla);
}

//Añade el evento de limpiar el historial
document.getElementById('limpiar-btn').addEventListener('click', function(e){
    localStorage.clear();
    limpiarHistorial();
    desplegarLocalStorage();
})

//Despliega los datos en el Local Storage apenas cargar la página
desplegarLocalStorage();

//Variables usadas para almacenar los datos entrados por el usuario
let numeros = [];
let signos = [];

//Variables usadas para controlar la forma en la que interactúan los botones en conjunto
let haSidoCalculado = false;
let signoDeOperacion = false;

//Variables usadas para calcular todo y mostrar el resultado
let operador1;
let operador2;
let resultado = 0;

//Función principal que maneja todos los inputs
function cambiarPantalla(e){

    e.preventDefault();

    //El valor del text area
    let entrada = e.target.value;   

    //Si la entrada es un signo de operacion
    if(entrada == '+' || entrada == '-' || entrada == '*' || entrada == '/'){

        //Agrega al arreglo de números lo que haya en pantalla
        numeros.push(pantalla.textContent);

        //Solo entrara aquí si en el arreglo números hay dos o más términos
        if(numeros.length >= 2){ 
            
            //Realiza los cálculos y actualiza el resultado en pantalla, como en una calculadora real
            resultado = calcular(operador1, signos[signos.length - 1],operador2);
            pantalla.textContent = resultado;
        }

        //Introduce el signo de operacion en el arreglo de signos
        signos.push(entrada);

        //Al cambiar esto a true, cuando se vuelvan a introducir números, se iniciará como si no hubiese nada en la pantalla
        //De lo contrario, los números seguirían adiriéndose a los que ya hay en pantalla
        signoDeOperacion = true;

        //Se asigna el valor que haya en pantalla a la variable, para usarla posteriormente en este mismo método
        operador1 = pantalla.textContent;

    }else if(entrada == '='){

        //Introduce el último de los números necesarios para el cálculo de la operación
        numeros.push(pantalla.textContent);

        if(numeros.length >= 2){ 
            
            //Realiza los cálculos y actualiza el resultado en pantalla, como en una calculadora real
            resultado = calcular(operador1, signos[signos.length - 1],operador2);
            pantalla.textContent = resultado;

            //Crea un string combinando los números, los signos y el resultado 
            let dato = `${arregloAOperacion(intercalarOperacion(numeros, signos))} = ${resultado}`;

            //Guarda el string en el Local Storage
            guardarLS(dato);

        }else{
            //En caso de que no se hayan ingresado más de un término, este término individual también
            //se guardará en el Local Storage
            if(pantalla.textContent !== ''){
                guardarLS(pantalla.textContent);
            }
        }

        //Se actualiza el historial
        limpiarHistorial();
        desplegarLocalStorage();

        //Se limpian los arreglos de almacenamiento de datos y el resultado vuelve a 0
        numeros = [];
        signos = [];
        resultado = 0;

        //Al cambiar esto a true, cuando se vuelvan a introducir números, se iniciará como si no hubiese nada en la pantalla
        //De lo contrario, los números seguirían adiriéndose a los que ya hay en pantalla
        haSidoCalculado = true;
        
    }else if( entrada == 'C' || entrada == 'CE'){

        //Estos botones limpian la pantalla de la calculadora, y todo lo que haya en memoria
        pantalla.textContent = '';
        numeros = [];
        signos = [];
        resultado = 0;
    }
    else{   //Este controla la entrada de números

        //Si anteriormente se pulsó un signo o el botón igual, la pantalla se limpiará
        //permitiendo que se inicie una nueva operación
        if(haSidoCalculado){
            pantalla.textContent = '';
            haSidoCalculado = false;
        }
        if(signoDeOperacion){
            pantalla.textContent = '';
            signoDeOperacion = false;
        }
        
        //Se va actualizando la pantalla con los números que vaya introduciendo el usuario
        pantalla.textContent = pantalla.textContent + entrada;

        //Se guarda al final el valor en esta variable para posteriormente calcular
        operador2 = pantalla.textContent;        
    }

}

//Esta función va realizando los cálculos, retorna el resultado
//Recibe dos operadores y un signo de operación
function calcular(operador1, entrada, operador2){
    let resultado;
    switch(entrada){
        case '+':
            resultado = parseFloat(operador1) + parseFloat(operador2);
            break;
        case '-':
            resultado = operador1 - operador2;
            break;
        case '*':
            resultado = operador1 * operador2;
            break;
        case '/':
            resultado = operador1 / operador2;
            break;
        default:
            break;
    }

    return resultado;
}

//Esta función coloca signos al lado de números, en el orden en que fueron ingresados
//Recibe dos arreglos y retorna uno de los dos arreglos combinados
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

//Esta función despliega los datos guardados en el Local Storage
function desplegarLocalStorage(){
    
    //Almacena un arreglo con los datos del LS
    let arreglo = obtenerDatosLS();

    if(arreglo !== null){
        for(let i = 0; i < arreglo.length; i++){

            //Crea un párrafo HTML
            let parrafo = document.createElement('p');

            //Estilos para el párrafo
            parrafo.align = 'center';
            parrafo.style.fontSize = '24px';

            //Clase del párrafo
            parrafo.className = 'parrafo';

            //Define el texto que llevará el párrafo
            parrafo.appendChild(document.createTextNode(arreglo[i]));
            
            //Añade el párrafo al DOM
            document.querySelector('#historial').appendChild(parrafo);
        }
    }
}

//Retorna un arreglo con los datos del LS
function obtenerDatosLS(){
    let arreglo;

    //Si el local storage está vacío retorna un arreglo vacío
    if(localStorage.length < 0){
        arreglo = [];
    }else{

        //Recibe un string del Local Storage y lo convierte en objeto,
        //en este caso un arreglo, con la función JSON.parse 
        arreglo = JSON.parse(localStorage.getItem('operaciones'));
    }
    return arreglo;
}

//Elimina los párrafos del Historial
function limpiarHistorial(){
    let parrafos = document.getElementsByClassName('parrafo');
    let parrafosArr = Array.from(parrafos);
    parrafosArr.forEach(function(parrafo){
        parrafo.remove();
    })
}

//Elimina el primer elemento del Local Storage
function eliminarPrimerElementoLS(arreglo){
    return arreglo.splice(0,1);
}

//Transforma del formato de Arreglo a uno de operación matemática entendible
//Recibe el arreglo a transformar y retorna el string
// Ej: ["1","+","2"] ===> 1+2
function arregloAOperacion(arreglo){
    //Lleva un arreglo a String con JSON.stringify
    //Principalmente se usa para la transmisión de datos por internet
    let operacion = JSON.stringify(arreglo);
    let opFinal = '';
    for(letra of operacion){
        if(!(letra === '"' || letra === '[' || letra === ']' || letra === ',')){
            opFinal = opFinal + letra;
        }
    }
    return opFinal;
}

//Guarda en el Local Storage
//Recibe el dato a guardar
function guardarLS(dato){
    let arreglo;

    //Si el local Storage está vacío, crea el arreglo a guardar vacío
    if(obtenerDatosLS() === null){
        arreglo = [];
    }else{

        //Si no, lo crea con lo que haya en el Local Storage
        arreglo = obtenerDatosLS();
    }

    //Si el arreglo excede los 12 elementos, borra el primero desde el Local Storage
    if(arreglo.length > 11){
        eliminarPrimerElementoLS(arreglo);
    }

    //Introduce el dato pasado por parámetro al arreglo
    arreglo.push(dato);

    //Lleva al arreglo al Local Storage, convirtiéndolo antes en string
    localStorage.setItem('operaciones', JSON.stringify(arreglo));
}