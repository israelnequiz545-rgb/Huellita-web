import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const usuarioMenu =
    document.getElementById("usuario-menu");

const usuarioBoton =
    document.getElementById("usuario-boton");

const nombreUsuario =
    document.getElementById("nombre-usuario");

const nombreMenu =
    document.getElementById("usuario-nombre-menu");

const correoMenu =
    document.getElementById("usuario-correo-menu");

const btnCerrarSesion =
    document.getElementById("btn-cerrar-sesion");

const enlaceAdministrador =
    document.getElementById("enlace-administrador");


if (usuarioBoton) {

    usuarioBoton.addEventListener(
        "click",
        () => {

            usuarioMenu.classList.toggle(
                "activo"
            );

        }
    );

}


onAuthStateChanged(
    auth,
    async (usuario) => {

        if (!usuario) {

            if (nombreUsuario) {
                nombreUsuario.textContent =
                    "Iniciar sesión";
            }

            if (nombreMenu) {
                nombreMenu.textContent =
                    "Iniciar sesión";
            }

            if (correoMenu) {
                correoMenu.textContent =
                    "Accede a tu cuenta";
            }

            if (btnCerrarSesion) {
                btnCerrarSesion.style.display =
                    "none";
            }

            if (enlaceAdministrador) {
                enlaceAdministrador.style.display =
                    "none";
            }

            return;
        }


        console.log(
            "🔥 Usuario conectado:",
            usuario.email
        );

        console.log(
            "🔥 UID:",
            usuario.uid
        );


        try {

            const referencia =
                doc(
                    db,
                    "usuarios",
                    usuario.uid
                );


            const documento =
                await getDoc(
                    referencia
                );


            if (!documento.exists()) {

                console.log(
                    "❌ No existe el documento del usuario"
                );

                return;
            }


            const datos =
                documento.data();


            console.log(
                "🔥 DATOS FIRESTORE:",
                datos
            );

            console.log(
                "🔥 ROL:",
                datos.rol
            );



            const nombre =
                datos.nombre ||
                "Mi cuenta";


            if (nombreUsuario) {

                nombreUsuario.textContent =
                    nombre;

            }


            if (nombreMenu) {

                nombreMenu.textContent =
                    nombre;

            }


            if (correoMenu) {

                correoMenu.textContent =
                    usuario.email;

            }



            if (
                datos.rol ===
                "admin"
            ) {

                console.log(
                    "👑 USUARIO ADMINISTRADOR DETECTADO"
                );


                if (enlaceAdministrador) {

                   enlaceAdministrador.style.display =
    "block";



console.log(
    "🔥 ENLACE ADMIN MOSTRADO:",
    enlaceAdministrador
);
                } else {

                    console.log(
                        "❌ NO SE ENCONTRÓ EL ENLACE ADMINISTRADOR EN EL HTML"
                    );

                }

            } else {

                console.log(
                    "👤 USUARIO NORMAL"
                );


                if (enlaceAdministrador) {

                    enlaceAdministrador.style.display =
                        "none";

                }

            }



            if (btnCerrarSesion) {

                btnCerrarSesion.style.display =
                    "block";

            }


        } catch (error) {

            console.error(
                "❌ Error al cargar usuario:",
                error
            );

        }

    }
);



if (btnCerrarSesion) {

    btnCerrarSesion.addEventListener(
        "click",
        async () => {

            try {

                await signOut(auth);

                window.location.href =
                    "index.html";

            } catch (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

            }

        }
    );

}