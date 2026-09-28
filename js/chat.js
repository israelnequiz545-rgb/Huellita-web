import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    getDoc,
    doc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const mensajesContenedor =
    document.getElementById("chat-mensajes");

const formulario =
    document.getElementById("form-chat");

const inputMensaje =
    document.getElementById("mensaje-chat");

const mensajeEstado =
    document.getElementById("mensaje-chat-estado");


let usuarioActual = null;



onAuthStateChanged(auth, (usuario) => {

    if (!usuario) {

        mensajeEstado.textContent =
            "🔐 Debes iniciar sesión para utilizar el chat.";

        formulario.style.display = "none";

        return;
    }


    usuarioActual = usuario;

    formulario.style.display = "flex";

    cargarMensajes(usuario.uid);

});



function cargarMensajes(usuarioId) {

    const consulta = query(
        collection(db, "chat_mensajes"),
        where("usuarioId", "==", usuarioId)
    );


    onSnapshot(
        consulta,
        (snapshot) => {

            mensajesContenedor.innerHTML = "";


            if (snapshot.empty) {

                mostrarChatVacio();

                return;
            }


            const mensajes = [];


            snapshot.forEach((documento) => {

                mensajes.push({
                    id: documento.id,
                    ...documento.data()
                });

            });


            // Ordenar mensajes por fecha

            mensajes.sort((a, b) => {

                const fechaA =
                    a.fecha?.toMillis
                        ? a.fecha.toMillis()
                        : 0;

                const fechaB =
                    b.fecha?.toMillis
                        ? b.fecha.toMillis()
                        : 0;

                return fechaA - fechaB;

            });


            mensajes.forEach((mensaje) => {

                mostrarMensaje(mensaje);

            });


            mensajesContenedor.scrollTop =
                mensajesContenedor.scrollHeight;

        },

        (error) => {

            console.error(
                "Error al cargar mensajes:",
                error
            );

            mensajeEstado.textContent =
                "❌ Error al cargar el chat.";

        }
    );

}




function mostrarChatVacio() {

    mensajesContenedor.innerHTML = `

        <div class="chat-vacio">

            🐾

            <h3>
                ¡Hola!
            </h3>

            <p>
                Escribe un mensaje y nuestro equipo
                podrá ayudarte.
            </p>

        </div>

    `;

}




function mostrarMensaje(mensaje) {

    const elemento =
        document.createElement("div");


    if (mensaje.remitente === "usuario") {

        elemento.className =
            "chat-mensaje usuario";

    } else {

        elemento.className =
            "chat-mensaje admin";

    }


    let hora = "";


    if (mensaje.fecha?.toDate) {

        const fecha =
            mensaje.fecha.toDate();


        hora =
            fecha.toLocaleTimeString(
                "es-MX",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }


    const nombre =
        mensaje.remitente === "usuario"
            ? "Tú"
            : "Huellita";


    elemento.innerHTML = `

        <strong>
            ${nombre}
        </strong>

        <br>

        ${mensaje.mensaje}

        <small>
            ${hora}
        </small>

    `;


    mensajesContenedor.appendChild(
        elemento
    );

}



formulario.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();


        if (!usuarioActual) {

            mensajeEstado.textContent =
                "🔐 Debes iniciar sesión.";

            return;
        }


        const texto =
            inputMensaje.value.trim();


        if (!texto) {

            return;

        }


        try {

            // Obtener usuario de Firestore

            const usuarioDoc =
                await getDoc(
                    doc(
                        db,
                        "usuarios",
                        usuarioActual.uid
                    )
                );


            let nombre =
                usuarioActual.email;


            if (usuarioDoc.exists()) {

                const datos =
                    usuarioDoc.data();

                nombre =
                    datos.nombre ||
                    usuarioActual.email;

            }


          

            await addDoc(
                collection(
                    db,
                    "chat_mensajes"
                ),
                {

                    usuarioId:
                        usuarioActual.uid,

                    nombreUsuario:
                        nombre,

                    correo:
                        usuarioActual.email,

                    mensaje:
                        texto,

                    remitente:
                        "usuario",

                    fecha:
                        serverTimestamp()

                }
            );



            inputMensaje.value = "";

            mensajeEstado.textContent = "";


        } catch (error) {

            console.error(
                "ERROR AL ENVIAR:",
                error
            );


            mensajeEstado.textContent =
                "❌ No se pudo enviar el mensaje.";

        }

    }
);