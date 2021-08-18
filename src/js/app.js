let pagina = 1;

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
    } else {
        elemento.classList.add('seleccionado');
    }
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