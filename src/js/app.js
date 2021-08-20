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

    // Validacion de objeto
    if(Object.values(cita).includes('')) {
    const noServicios = document.createElement('P');
    noServicios.textContent= 'Faltan datos de servicios, hora, fecha o nombre';

    noServicios.classList.add('invalidar-cita');

    //agregar el resumen Div
    resumenDiv.appendChild(noServicios);

    }   
}