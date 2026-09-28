import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword,
    sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";


const formulario =
    document.getElementById("form-login");

const mensaje =
    document.getElementById("mensaje-login");


formulario.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        const correo =
            document.getElementById("correo").value.trim();

        const contrasena =
            document.getElementById("contrasena").value;


        try {

            await signInWithEmailAndPassword(
                auth,
                correo,
                contrasena
            );


            mensaje.textContent =
                "✅ Sesión iniciada correctamente.";

            mensaje.style.color = "#2e7d32";


            setTimeout(() => {

                window.location.href =
                    "index.html";

            }, 1000);


        } catch (error) {

            console.error(error);


            mensaje.textContent =
                "❌ Correo o contraseña incorrectos.";

            mensaje.style.color = "#c0392b";

        }

    }
);

const btnRecuperar =
    document.getElementById("btn-recuperar");

const formRecuperar =
    document.getElementById("form-recuperar");

const btnEnviarRecuperacion =
    document.getElementById("btn-enviar-recuperacion");

const mensajeRecuperacion =
    document.getElementById("mensaje-recuperacion");

btnRecuperar.addEventListener("click", (event) => {

    event.preventDefault();

    formRecuperar.style.display = "block";

});


btnEnviarRecuperacion.addEventListener(
    "click",
    async () => {

        const correo =
            document.getElementById("correo-recuperar")
                .value
                .trim();


        if (!correo) {

            mensajeRecuperacion.textContent =
                "❌ Ingresa tu correo electrónico.";

            mensajeRecuperacion.style.color =
                "#c0392b";

            return;
        }


        try {

            await sendPasswordResetEmail(
                auth,
                correo
            );


            mensajeRecuperacion.textContent =
                "✅ Te enviamos un enlace para recuperar tu contraseña. Revisa tu correo.";

            mensajeRecuperacion.style.color =
                "#2e7d32";


        } catch (error) {

            console.error(error);


            mensajeRecuperacion.textContent =
                "❌ No se pudo enviar el correo. Verifica que esté registrado.";

            mensajeRecuperacion.style.color =
                "#c0392b";

        }

    }
);