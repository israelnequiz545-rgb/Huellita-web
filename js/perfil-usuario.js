import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const cargando =
    document.getElementById("cargando-perfil");

const datosPerfil =
    document.getElementById("datos-perfil");

const mensaje =
    document.getElementById("mensaje-perfil");

const nombre =
    document.getElementById("perfil-nombre");

const correo =
    document.getElementById("perfil-correo");

const rol =
    document.getElementById("perfil-rol");

const fecha =
    document.getElementById("perfil-fecha");


onAuthStateChanged(
    auth,
    async (usuario) => {

        if (!usuario) {

            cargando.textContent =
                "🔐 Debes iniciar sesión para ver tu perfil.";

            return;
        }


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

                cargando.textContent =
                    "No se encontró la información de tu perfil.";

                return;
            }


            const datos =
                documento.data();


            nombre.textContent =
                datos.nombre || "Sin nombre";


            correo.textContent =
                datos.correo ||
                usuario.email ||
                "Sin correo";


            if (datos.rol === "admin") {

                rol.textContent =
                    "Administrador";

            } else {

                rol.textContent =
                    "Usuario";

            }


            if (datos.fechaRegistro) {

                let fechaRegistro;

                if (
                    typeof datos.fechaRegistro.toDate ===
                    "function"
                ) {

                    fechaRegistro =
                        datos.fechaRegistro.toDate();

                } else {

                    fechaRegistro =
                        new Date(
                            datos.fechaRegistro
                        );

                }


                fecha.textContent =
                    fechaRegistro.toLocaleDateString(
                        "es-MX",
                        {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric"
                        }
                    );

            } else {

                fecha.textContent =
                    "No disponible";

            }


            cargando.style.display =
                "none";

            datosPerfil.style.display =
                "block";


        } catch (error) {

            console.error(
                "Error al cargar el perfil:",
                error
            );

            cargando.textContent =
                "❌ No se pudo cargar la información del perfil.";

        }

    }
);