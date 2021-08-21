let pagina = 1;

const cita = {
    nombre: '',
    fecha: '',
    hora: '',
    servicios: []
}

document.addEventListener('DOMContentLoaded', function() {
    iniciarApp();
});

function iniciarApp () {
    mostrarServicios();

    // Resalta el DIV actual segun el tab que presiona
    mostrarSeccion();
    // Oculta o muestra una seccion segun el tab
    cambiarSeccion();

    //Paginacion anterior y siguiente
    paginaSiguiente();

    paginaAnterior();

    //comprobar pagina actual para ocultar o mostrar paginacion
    botonesPaginador();

    //Muestra el resumen de la cita o mensaje de error
    mostrarResumen();

    // Almacena el nombre de la cita
    nombreCita();

    //Almacena la fecha
    fechaCita();

    // deshabilita dias pasados
    deshabilitarFechaAnterior();

    //Almacena la hora de la cita
    horaCita();
}

function mostrarSeccion() {
    // Eliminar mostrar-seccion 
    const seccionAnterior = document.querySelector('.mostrar-seccion');
    if ( seccionAnterior ) {
        seccionAnterior.classList.remove('mostrar-seccion');
    }
    
    const seccionActual = document.querySelector(`#paso-${pagina}`);
    seccionActual.classList.add('mostrar-seccion');

    //Elimina clase actual de tab anterior
    const tabAnterior = document.querySelector('.tabs .actual');
    if ( tabAnterior ) {
        tabAnterior.classList.remove('actual');
    }


    // Resaltar tab actual
    const tab = document.querySelector(`[data-paso="${pagina}"]`);
    tab.classList.add('actual');
}

function cambiarSeccion() {
    const enlaces = document.querySelectorAll('.tabs button')

    enlaces.forEach( enlace => {
        enlace.addEventListener('click', e=> {
            e.preventDefault();

            pagina = parseInt(e.target.dataset.paso);
            // llamar a mostrar seccion
            mostrarSeccion();

            botonesPaginador();
        })
    })
}

async function mostrarServicios() {
    try {
        const resultado = await fetch('./servicios.json');
        const db = await resultado.json();

        const { servicios } = db;

        //Generar HTML
        servicios.forEach( servicio => {
            const { id, nombre, precio } = servicio;

            // DOM scripting
            // Generar nombre
            const nombreServicio = document.createElement('P');
            nombreServicio.textContent = nombre;
            nombreServicio.classList.add('nombre-servicio');
            
            //generar precio
            const precioServicio = document.createElement('P');
            precioServicio.textContent = `$ ${precio}`;
            precioServicio.classList.add('precio-servicio');
            
            //Generar div
            const servicioDiv = document.createElement('DIV');
            servicioDiv.classList.add('servicio');
            servicioDiv.dataset.idServicio = id;

            //Seleccionar un servicio para la cita
            servicioDiv.onclick = seleccionarServicio;

            //Colocar precio y nombre al div
            servicioDiv.appendChild(nombreServicio);
            servicioDiv.appendChild(precioServicio);
            
            //Colcoarlo en HTML
            document.querySelector('#servicios').appendChild(servicioDiv);
        })
    } catch (error) {
        
    }
}

function seleccionarServicio(e) {

    let elemento;
    // Seleccionar el div 
    if(e.target.tagName === 'P') {
        elemento = e.target.parentElement;
    }else {
        elemento = e.target;
    }

    if(elemento.classList.contains('seleccionado')) {
        elemento.classList.remove('seleccionado');

        const id = parseInt( elemento.dataset.idServicio);

        eliminarServicio(id);
    } else {
        elemento.classList.add('seleccionado');

        const servicioObj = {
            id: parseInt( elemento.dataset.idServicio),
            nombre: elemento.firstElementChild.textContent,
            precio: elemento.firstElementChild.nextElementSibling.textContent
        }
        // console.log(servicioObj);
        agregarServicio(servicioObj);
    }
}

function eliminarServicio(id) {
    const { servicios } = cita;
    cita.servicios = servicios.filter( servicio => servicio.id !== id);

    console.log(cita);
}

function agregarServicio(servicioObj) {
    const { servicios } = cita;
    cita.servicios = [...servicios, servicioObj];

    console.log(cita);
   
    // console.log('agregando...');
}

function paginaSiguiente () {
    const paginaSiguiente = document.querySelector('#siguiente');
    paginaSiguiente.addEventListener('click', () =>{
        pagina++;

        console.log(pagina);

        botonesPaginador();
    });
}
function paginaAnterior () {
    const paginaAnterior = document.querySelector('#anterior');
    paginaAnterior.addEventListener('click', () =>{
        pagina--;

        console.log(pagina);

        botonesPaginador();
    });
}

function botonesPaginador () {
    const paginaSiguiente = document.querySelector('#siguiente');
    const paginaAnterior = document.querySelector('#anterior');

    if(pagina === 1 ) {
        paginaAnterior.classList.add('ocultar');
    } else if (pagina === 3) {
        paginaSiguiente.classList.add('ocultar');
        paginaAnterior.classList.remove('ocultar');

        mostrarResumen(); //estamos en pag 3, entonces carga la cita
    } else {
        paginaAnterior.classList.remove('ocultar');
        paginaSiguiente.classList.remove('ocultar');    
    }

    mostrarSeccion();
}

function mostrarResumen() {
    //Destructuring
    const { nombre, fecha, hora, servicios } = cita;

    // Seleccionar el resumen
    const resumenDiv = document.querySelector('.contenido-resumen');

    // Limpia html 
    while( resumenDiv.firstChild ) {
        resumenDiv.removeChild(resumenDiv.firstChild);
    }

    // Validacion de objeto
    if(Object.values(cita).includes('')) {
    const noServicios = document.createElement('P');
    noServicios.textContent= 'Faltan datos de servicios, hora, fecha o nombre';

    noServicios.classList.add('invalidar-cita');

    //agregar el resumen Div
    resumenDiv.appendChild(noServicios);
    return;
    }  

    const headingCita = document.createElement('H3');
    headingCita.textContent = 'Resumen de Cita';

    // mostrar el resumen
    const nombreCita = document.createElement('P');
    nombreCita.innerHTML = `<span>Nombre: </span>${nombre}`;
    const fechaCita = document.createElement('P');
    fechaCita.innerHTML = `<span>Fecha: </span>${fecha}`;
    const horaCita = document.createElement('P');
    horaCita.innerHTML = `<span>Hora: </span>${hora}`;

    const serviciosCita = document.createElement('DIV');
    serviciosCita.classList.add('resumen-servicios');

    const headingServicios = document.createElement('H3');
    headingServicios.textContent = 'Resumen de Servicios';

    serviciosCita.appendChild(headingServicios);

    let cantidad = 0;

    //Iterar sobre el arreglo de servicios
    servicios.forEach( servicio => {

        const {nombre, precio} = servicio;
        const contenedorServicio = document.createElement('DIV');
        contenedorServicio.classList.add('contenedor-servicio');

        const textoServicio = document.createElement('P');
        textoServicio.textContent = nombre;
        
        const precioServicio = document.createElement('P');
        precioServicio.textContent = precio;
        precioServicio.classList.add('precio');

        const totalServicio = precio.split('$');

        cantidad += parseInt( totalServicio[1].trim());

        // Colocar texto y precio 
        contenedorServicio.appendChild(textoServicio);
        contenedorServicio.appendChild(precioServicio);

        serviciosCita.appendChild(contenedorServicio);
    } );

    resumenDiv.appendChild(headingCita);
    resumenDiv.appendChild(nombreCita);
    resumenDiv.appendChild(fechaCita);
    resumenDiv.appendChild(horaCita);

    resumenDiv.appendChild(serviciosCita);

    const cantidadPagar = document.createElement('P');
    cantidadPagar.classList.add('total');
    cantidadPagar.innerHTML = `<span>Total a Pagar: </span>$ ${cantidad}`;

    resumenDiv.appendChild(cantidadPagar);
}

function nombreCita() {
    const nombreinput = document.querySelector('#nombre');

    nombreinput.addEventListener('input', e => {
        const nombreTexto = e.target.value.trim();
        
        // validar texto
        if (nombreTexto === '' || nombreTexto.length < 3) {
            mostrarAlerta('Nombre no valido', 'error');
        } else {
            const alerta = document.querySelector('.alerta');
            if(alerta) {
                alerta.remove();
            }
            cita.nombre = nombreTexto;

        }
    });
}

function mostrarAlerta (mensaje, tipo) {
    // si hay una alerta no crear otra
    const alertaPrevia = document.querySelector('.alerta');
    if(alertaPrevia) {
        return;
    }

    const alerta = document.createElement('DIV');
    alerta.textContent = mensaje;
    alerta.classList.add('alerta');

    if(tipo === 'error') {
        alerta.classList.add('error');
    }
    // Agregar HTML
    const formulario = document.querySelector('.formulario');
    formulario.appendChild(alerta);

    //eliminar la alerta despues de 3 seg
    setTimeout(() => {
        alerta.remove();
    }, 3000);
}

function fechaCita() {
    const fechaInput = document.querySelector('#fecha');
    fechaInput.addEventListener('input', e => {

        const dia = new Date(e.target.value).getUTCDay();

        if([0, 6].includes(dia)) {
            e.preventDefault();
            fechaInput.value = '';
            mostrarAlerta('Fines de semana no son permitidios', 'error');
        } else {
            cita.fecha = fechaInput.value;

            console.log(cita);
        }
    });
}

function deshabilitarFechaAnterior() {
    const inputFecha = document.querySelector('#fecha');

    const fechaAhora = new Date();
    const year = fechaAhora.getFullYear();
    const mes = fechaAhora.getMonth() + 1;
    const dia = fechaAhora.getDate() + 1;
    const fechaDeshabilitar = `${year}-${mes}-${dia}`;

    inputFecha.min = fechaDeshabilitar;
}

function horaCita() {
    const inputHora = document.querySelector('#hora');
    inputHora.addEventListener('input', e => {
        console.log(e.target.value);

        const horaCita = e.target.value;
        const hora = horaCita.split(':');

        if(hora[0] < 10 || hora[0] > 18 ) {
            mostrarAlerta('Hora no valida', 'error');
            setTimeout(() => {
                inputHora.value = '';
            }, 3000);
        } else {
            cita.hora = horaCita;

            console.log(cita);
        }
    });
}