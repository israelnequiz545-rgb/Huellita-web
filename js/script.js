function buscarAnimal() {

    const especie = document.getElementById("especie").value;
    const tamano = document.getElementById("tamano").value;
    const edad = document.getElementById("edad").value;

    const resultado = document.getElementById("resultado-busqueda");

    if (
        especie === "" &&
        tamano === "" &&
        edad === ""
    ) {

        resultado.textContent =
            "Selecciona al menos un filtro para realizar la búsqueda.";

        return;
    }

    let filtros = [];

    if (especie !== "") {
        filtros.push("especie");
    }

    if (tamano !== "") {
        filtros.push("tamaño");
    }

    if (edad !== "") {
        filtros.push("edad");
    }

    resultado.textContent =
        "Búsqueda realizada utilizando: " +
        filtros.join(", ") +
        ".";
}


function filtrarAnimales() {

    const especie = document.getElementById("filtro-especie").value;
    const tamano = document.getElementById("filtro-tamano").value;
    const edad = document.getElementById("filtro-edad").value;
    const sexo = document.getElementById("filtro-sexo").value;

    const animales = document.querySelectorAll(".animal-card");

    let encontrados = 0;

    animales.forEach(animal => {

        const coincideEspecie =
            especie === "" || animal.dataset.especie === especie;

        const coincideTamano =
            tamano === "" || animal.dataset.tamano === tamano;

        const coincideEdad =
            edad === "" || animal.dataset.edad === edad;

        const coincideSexo =
            sexo === "" || animal.dataset.sexo === sexo;

        if (
            coincideEspecie &&
            coincideTamano &&
            coincideEdad &&
            coincideSexo
        ) {

            animal.style.display = "block";
            encontrados++;

        } else {

            animal.style.display = "none";

        }

    });


    document.getElementById("contador-animales").textContent =
        encontrados + (encontrados === 1
            ? " animalito"
            : " animalitos");


    const sinResultados =
        document.getElementById("sin-resultados");

    if (encontrados === 0) {
        sinResultados.style.display = "block";
    } else {
        sinResultados.style.display = "none";
    }

}
function solicitarAdopcion(animal) {

    alert(
        "Has seleccionado solicitar la adopción de " +
        animal +
        ". Pronto podrás continuar con el proceso de adopción."
    );

}
function filtrarReportes() {

    const tipo =
        document.getElementById("filtro-tipo").value;

    const especie =
        document.getElementById("filtro-especie-reporte").value;

    const zona =
        document.getElementById("filtro-zona").value
        .toLowerCase()
        .trim();


    const reportes =
        document.querySelectorAll(".reporte-card");

    let encontrados = 0;


    reportes.forEach(reporte => {

        const coincideTipo =
            tipo === "" ||
            reporte.dataset.tipo === tipo;

        const coincideEspecie =
            especie === "" ||
            reporte.dataset.especie === especie;

        const coincideZona =
            zona === "" ||
            reporte.dataset.zona.includes(zona);


        if (
            coincideTipo &&
            coincideEspecie &&
            coincideZona
        ) {

            reporte.style.display = "block";

            encontrados++;

        } else {

            reporte.style.display = "none";

        }

    });


    document.getElementById("contador-reportes").textContent =
        encontrados +
        (encontrados === 1
            ? " reporte"
            : " reportes");


    const sinResultados =
        document.getElementById(
            "sin-resultados-reportes"
        );


    if (encontrados === 0) {

        sinResultados.style.display = "block";

    } else {

        sinResultados.style.display = "none";

    }

}


function verReporte(animal) {

    alert(
        "Has seleccionado el reporte de " +
        animal +
        ".\n\n" +
        "Aquí podrás consultar más información " +
        "sobre el animal y los datos del reporte."
    );

}
function enviarMensaje(event) {

    event.preventDefault();

    const nombre =
        document.getElementById("nombre-contacto").value;

    alert(
        "Gracias por contactarnos, " +
        nombre +
        ".\n\n" +
        "Tu mensaje ha sido recibido. " +
        "Pronto nos pondremos en contacto contigo."
    );

    document.getElementById("nombre-contacto").value = "";
    document.getElementById("correo-contacto").value = "";
    document.getElementById("mensaje-contacto").value = "";

}
function verCampana(campana) {

    alert(
        "Has seleccionado la campaña: " +
        campana +
        ".\n\n" +
        "Aquí podrás consultar más información sobre esta actividad."
    );

}
function crearReporte(event) {

    event.preventDefault();

    const nombre =
        document.getElementById("nombre-reporte").value;

    const tipo =
        document.getElementById("tipo-reporte").value;

    alert(
        "El reporte de " +
        nombre +
        " ha sido creado correctamente.\n\n" +

        "Tipo de reporte: " +
        (tipo === "extraviado"
            ? "Animal extraviado"
            : "Animal encontrado") +
        "."
    );

    document.getElementById("tipo-reporte").value = "";
    document.getElementById("especie-reporte").value = "";
    document.getElementById("nombre-reporte").value = "";
    document.getElementById("zona-reporte").value = "";
    document.getElementById("fecha-reporte").value = "";
    document.getElementById("descripcion-reporte").value = "";
    document.getElementById("contacto-reporte").value = "";
    document.getElementById("imagen-reporte").value = "";

}