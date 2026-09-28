import { auth, db } from "./firebase.js";

import {
    createUserWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    setDoc
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const formulario =
    document.getElementById("form-registro");


formulario.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const nombre =
            document.getElementById("nombre").value;

        const correo =
            document.getElementById("correo").value;

        const contrasena =
            document.getElementById("contrasena").value;

        const mensaje =
            document.getElementById("mensaje-registro");


        try {

  

            const usuario =
                await createUserWithEmailAndPassword(
                    auth,
                    correo,
                    contrasena
                );


           

            await setDoc(
                doc(
                    db,
                    "usuarios",
                    usuario.user.uid
                ),
                {

                    nombre:
                        nombre,

                    correo:
                        correo,

                    rol:
                        "usuario",

                    fechaRegistro:
                        new Date()

                }
            );


            mensaje.textContent =
                "✅ Cuenta creada correctamente.";


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 1500);


        } catch (error) {

            console.error(
                "Error al registrar usuario:",
                error
            );


            mensaje.textContent =
                "❌ No se pudo crear la cuenta.";

        }

    }
);