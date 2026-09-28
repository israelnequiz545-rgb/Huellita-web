import { auth, db } from "./firebase.js";

import {
    doc,
    getDoc,
    addDoc,
    collection
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


let idAnimal = null;
let nombreAnimal = "";
let usuarioActual = null;



const botonAdoptar =
    document.getElementById("btn-adoptar");

const modal =
    document.getElementById("modal-adopcion");

const cerrarModal =
    document.getElementById("cerrar-modal");

const cancelarAdopcion =
    document.getElementById("cancelar-adopcion");

const formulario =
    document.getElementById("form-adopcion");

const nombreModal =
    document.getElementById("modal-nombre-animal");

const mensajeResultado =
    document.getElementById(
        "mensaje-adopcion-resultado"
    );



const modalLogin =
    document.getElementById("modal-login");

const cerrarModalLogin =
    document.getElementById(
        "cerrar-modal-login"
    );

const loginNombreAnimal =
    document.getElementById(
        "login-nombre-animal"
    );


async function cargarPerfil() {

    try {

        const parametros =
            new URLSearchParams(
                window.location.search
            );


        idAnimal =
            parametros.get("id");


        if (!idAnimal) {

            document.getElementById(
                "cargando"
            ).textContent =
                "No se encontró el animal.";

            return;
        }


        const referencia =
            doc(
                db,
                "animales",
                idAnimal
            );


        const documento =
            await getDoc(
                referencia
            );


        if (!documento.exists()) {

            document.getElementById(
                "cargando"
            ).textContent =
                "El animal no existe.";

            return;
        }


        const animal =
            documento.data();


        nombreAnimal =
            animal.nombre;


        document.getElementById(
            "cargando"
        ).style.display = "none";


        document.getElementById(
            "perfil-animal"
        ).style.display = "grid";



        const imagen =
            document.getElementById(
                "imagen-animal"
            );


        if (animal.imagen) {

            imagen.src =
                animal.imagen;

        }


        imagen.alt =
            animal.nombre;


        document.getElementById(
            "nombre-animal"
        ).textContent =
            animal.nombre;


        document.getElementById(
            "descripcion-animal"
        ).textContent =
            animal.descripcion || "";


        document.getElementById(
            "especie-animal"
        ).textContent =
            animal.especie || "";


        document.getElementById(
            "edad-animal"
        ).textContent =
            animal.edad || "";


        document.getElementById(
            "sexo-animal"
        ).textContent =
            animal.sexo || "";


        document.getElementById(
            "tamano-animal"
        ).textContent =
            animal.tamano || "";


        const estado =
            document.getElementById(
                "estado-animal"
            );


        if (
            animal.estado ===
            "disponible"
        ) {

            estado.textContent =
                "🟢 Disponible para adopción";


            botonAdoptar.style.display =
                "block";

        } else {

            estado.textContent =
                "🏠 Este animalito ya encontró un hogar";


            botonAdoptar.style.display =
                "none";

        }


        document.title =
            "Perfil de " +
            animal.nombre +
            " | Huellita";


        

        if (nombreModal) {

            nombreModal.textContent =
                animal.nombre;

        }


        if (loginNombreAnimal) {

            loginNombreAnimal.textContent =
                animal.nombre;

        }


    } catch (error) {

        console.error(
            "Error al cargar el perfil:",
            error
        );


        document.getElementById(
            "cargando"
        ).textContent =
            "Ocurrió un error al cargar el perfil.";

    }

}


onAuthStateChanged(
    auth,
    (usuario) => {

        usuarioActual =
            usuario;

    }
);


botonAdoptar.addEventListener(
    "click",
    () => {


        /* NO HAY SESIÓN */

        if (!usuarioActual) {

            if (loginNombreAnimal) {

                loginNombreAnimal.textContent =
                    nombreAnimal;

            }


            modalLogin.classList.add(
                "activo"
            );


            return;
        }


        /* SÍ HAY SESIÓN */

        mensajeResultado.textContent =
            "";


        formulario.reset();


        modal.classList.add(
            "activo"
        );

    }
);

cerrarModal.addEventListener(
    "click",
    () => {

        modal.classList.remove(
            "activo"
        );

    }
);


cancelarAdopcion.addEventListener(
    "click",
    () => {

        modal.classList.remove(
            "activo"
        );

    }
);



modal.addEventListener(
    "click",
    (event) => {

        if (
            event.target === modal
        ) {

            modal.classList.remove(
                "activo"
            );

        }

    }
);



cerrarModalLogin.addEventListener(
    "click",
    () => {

        modalLogin.classList.remove(
            "activo"
        );

    }
);


modalLogin.addEventListener(
    "click",
    (event) => {

        if (
            event.target === modalLogin
        ) {

            modalLogin.classList.remove(
                "activo"
            );

        }

    }
);



formulario.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        /* COMPROBAR SESIÓN */

        if (!usuarioActual) {

            modal.classList.remove(
                "activo"
            );


            modalLogin.classList.add(
                "activo"
            );


            return;
        }


        const mensaje =
            document.getElementById(
                "mensaje-adopcion"
            ).value.trim();


        if (!mensaje) {

            mensajeResultado.textContent =
                "⚠️ Escribe un mensaje antes de enviar.";

            return;
        }


        try {

            const referenciaUsuario =
                doc(
                    db,
                    "usuarios",
                    usuarioActual.uid
                );


            const documentoUsuario =
                await getDoc(
                    referenciaUsuario
                );


            let nombreUsuario =
                "Usuario";


            if (
                documentoUsuario.exists()
            ) {

                const datosUsuario =
                    documentoUsuario.data();


                nombreUsuario =
                    datosUsuario.nombre ||
                    "Usuario";

            }

            await addDoc(
                collection(
                    db,
                    "solicitudes_adopcion"
                ),
                {

                    usuarioId:
                        usuarioActual.uid,

                    nombreUsuario:
                        nombreUsuario,

                    correo:
                        usuarioActual.email,

                    animalId:
                        idAnimal,

                    nombreAnimal:
                        nombreAnimal,

                    mensaje:
                        mensaje,

                    estado:
                        "pendiente",

                    fecha:
                        new Date()

                }
            );


            mensajeResultado.textContent =
                "✅ ¡Solicitud enviada correctamente!";


            const botonEnviar =
                formulario.querySelector(
                    ".btn-enviar-adopcion"
                );


            botonEnviar.disabled =
                true;


           

            setTimeout(
                () => {

                    modal.classList.remove(
                        "activo"
                    );


                    formulario.reset();


                    botonEnviar.disabled =
                        false;


                    mensajeResultado.textContent =
                        "";

                },
                1800
            );


        } catch (error) {

            console.error(
                "Error al enviar solicitud:",
                error
            );


            mensajeResultado.textContent =
                "❌ No se pudo enviar la solicitud.";

        }

    }
);
cargarPerfil();