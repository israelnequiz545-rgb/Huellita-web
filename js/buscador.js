import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const buscador =
    document.getElementById("busqueda-sitio");

const boton =
    document.getElementById("btn-buscar-sitio");

const paginas = [
    {
        nombre: "Inicio",
        palabras: ["inicio", "principal", "home"],
        url: "index.html"
    },

    {
        nombre: "Adopta",
        palabras: [
            "adopta",
            "adopción",
            "adopcion",
            "adoptar",
            "animales"
        ],
        url: "adopta.html"
    },

    {
        nombre: "Animales extraviados",
        palabras: [
            "extraviados",
            "extraviado",
            "perdidos",
            "perdido"
        ],
        url: "extraviados.html"
    },

    {
        nombre: "Campañas",
        palabras: [
            "campañas",
            "campanas",
            "campaña",
            "campana"
        ],
        url: "campanas.html"
    },

    {
        nombre: "Ayuda",
        palabras: [
            "ayuda",
            "ayudar",
            "información",
            "informacion"
        ],
        url: "ayuda.html"
    },

    {
        nombre: "Contacto",
        palabras: [
            "contacto",
            "contactar",
            "correo"
        ],
        url: "contacto.html"
    },

    {
        nombre: "Crear reporte",
        palabras: [
            "reporte",
            "reportar",
            "crear reporte"
        ],
        url: "crear-reporte.html"
    },

    {
        nombre: "Buzón",
        palabras: [
            "buzón",
            "buzon",
            "mensajes"
        ],
        url: "buzon.html"
    },

    {
        nombre: "Mi perfil",
        palabras: [
            "perfil",
            "mi perfil",
            "usuario"
        ],
        url: "perfil-usuario.html"
    },

    {
        nombre: "Mis solicitudes",
        palabras: [
            "solicitudes",
            "mis solicitudes"
        ],
        url: "mis-solicitudes.html"
    },

    {
        nombre: "Iniciar sesión",
        palabras: [
            "login",
            "iniciar sesión",
            "iniciar sesion",
            "entrar"
        ],
        url: "login.html"
    },

    {
        nombre: "Registrarse",
        palabras: [
            "registro",
            "registrarse",
            "crear cuenta"
        ],
        url: "registro.html"
    },

    {
        nombre: "Recuperar contraseña",
        palabras: [
            "recuperar contraseña",
            "recuperar contrasena",
            "contraseña",
            "contrasena"
        ],
        url: "recuperar.html"
    },

    {
        nombre: "Mapa del sitio",
        palabras: [
            "mapa",
            "mapa del sitio",
            "secciones"
        ],
        url: "mapa-sitio.html"
    }
];

function normalizar(texto) {

    return texto
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}

async function buscarSitio() {

    const textoOriginal =
        buscador.value.trim();

    if (!textoOriginal) {

        alert("⚠️ Escribe algo para buscar.");

        return;
    }


    const texto =
        normalizar(textoOriginal);


    for (const pagina of paginas) {

        const coincide =
    pagina.palabras.some((palabra) =>
        normalizar(palabra) === texto
    );

        if (coincide) {

            window.location.href =
                pagina.url;

            return;
        }
    }


    try {

        const referencia =
            collection(db, "animales");

        const resultado =
            await getDocs(referencia);


        let encontrado = null;


        resultado.forEach((documento) => {

            const animal =
                documento.data();


            const nombre =
                normalizar(animal.nombre || "");

            const especie =
                normalizar(animal.especie || "");

            const edad =
                normalizar(animal.edad || "");

            const sexo =
                normalizar(animal.sexo || "");

            const descripcion =
                normalizar(animal.descripcion || "");


           if (
    nombre === texto ||
    especie === texto ||
    edad === texto ||
    sexo === texto
) {

                if (!encontrado) {

                    encontrado = {
                        id: documento.id,
                        ...animal
                    };

                }

            }

        });

        if (encontrado) {

            window.location.href =
                `perfil-animal.html?id=${encontrado.id}`;

            return;
        }


       


window.location.href =
    `404.html?busqueda=${encodeURIComponent(textoOriginal)}`;

    } catch (error) {

        console.error(
            "Error al realizar la búsqueda:",
            error
        );

        alert(
            "❌ No se pudo realizar la búsqueda."
        );

    }

}




if (boton) {

    boton.addEventListener(
        "click",
        buscarSitio
    );

}



if (buscador) {

    buscador.addEventListener(
        "keydown",
        (event) => {

            if (event.key === "Enter") {

                buscarSitio();

            }

        }
    );

}