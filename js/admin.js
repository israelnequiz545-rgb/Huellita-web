import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    doc,
    getDoc,
    collection,
    getDocs,
    query,
    updateDoc,
    addDoc,
    serverTimestamp,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const cargando =
    document.getElementById("cargando-admin");

const panel =
    document.getElementById("panel-admin");

const cerrarSesion =
    document.getElementById("btn-cerrar-sesion");

const btnSolicitudes =
    document.getElementById("btn-solicitudes");

const adminOpciones =
    document.getElementById("admin-opciones");

const seccionSolicitudes =
    document.getElementById("seccion-solicitudes");

const btnRegresar =
    document.getElementById("btn-regresar-admin");

const cargandoSolicitudes =
    document.getElementById("cargando-solicitudes");

const sinSolicitudes =
    document.getElementById("sin-solicitudes");

const listaSolicitudes =
    document.getElementById("lista-solicitudes");

const btnChatAdmin =
    document.getElementById("btn-chat-admin");

const seccionChatAdmin =
    document.getElementById("seccion-chat-admin");

const listaChatsAdmin =
    document.getElementById("lista-chats-admin");

const btnRegresarChatAdmin =
    document.getElementById("btn-regresar-chat-admin");


onAuthStateChanged(
    auth,
    async (usuario) => {

        if (!usuario) {

            window.location.href =
                "login.html";

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

                alert(
                    "No se encontró tu información de usuario."
                );

                window.location.href =
                    "index.html";

                return;
            }

            const datos =
                documento.data();

            if (
                datos.rol !==
                "admin"
            ) {

                alert(
                    "No tienes permisos para acceder al panel de administración."
                );

                window.location.href =
                    "index.html";

                return;
            }

            /* MOSTRAR PANEL */

            cargando.style.display =
                "none";

            panel.style.display =
                "block";

        } catch (error) {

            console.error(
                "Error al verificar administrador:",
                error
            );

            cargando.textContent =
                "❌ Ocurrió un error al verificar los permisos.";

        }

    }
);


if (btnSolicitudes) {

    btnSolicitudes.addEventListener(
        "click",
        () => {

            adminOpciones.style.display =
                "none";

            seccionSolicitudes.style.display =
                "block";

            seccionChatAdmin.style.display =
                "none";

            cargarSolicitudes();

        }
    );

}


if (btnRegresar) {

    btnRegresar.addEventListener(
        "click",
        () => {

            seccionSolicitudes.style.display =
                "none";

            seccionChatAdmin.style.display =
                "none";

            adminOpciones.style.display =
                "grid";

        }
    );

}


if (btnChatAdmin) {

    btnChatAdmin.addEventListener(
        "click",
        () => {

            adminOpciones.style.display =
                "none";

            seccionSolicitudes.style.display =
                "none";

            seccionChatAdmin.style.display =
                "block";

            cargarChatsAdmin();

        }
    );

}



if (btnRegresarChatAdmin) {

    btnRegresarChatAdmin.addEventListener(
        "click",
        () => {

            seccionChatAdmin.style.display =
                "none";

            adminOpciones.style.display =
                "grid";

        }
    );

}


async function cargarSolicitudes() {

    cargandoSolicitudes.style.display =
        "block";

    sinSolicitudes.style.display =
        "none";

    listaSolicitudes.innerHTML =
        "";

    try {

        /* AQUÍ ESTABA EL ERROR */

        const consulta =
            query(
                collection(
                    db,
                    "solicitudes_adopcion"
                )
            );

        const resultado =
            await getDocs(
                consulta
            );

        cargandoSolicitudes.style.display =
            "none";

        if (resultado.empty) {

            sinSolicitudes.style.display =
                "block";

            return;
        }

        resultado.forEach(
            (documento) => {

                const solicitud =
                    documento.data();

                const idSolicitud =
                    documento.id;

                let estado =
                    solicitud.estado ||
                    "pendiente";

                let textoEstado =
                    "⏳ Pendiente";

                if (
                    estado ===
                    "aceptada"
                ) {

                    textoEstado =
                        "✅ Aceptada";

                }

                if (
                    estado ===
                    "rechazada"
                ) {

                    textoEstado =
                        "❌ Rechazada";

                }

                const tarjeta =
                    document.createElement(
                        "article"
                    );

                tarjeta.className =
                    "solicitud-card";

                tarjeta.innerHTML = `

                    <div class="solicitud-cabecera">

                        <div class="solicitud-animal">

                            <div class="solicitud-animal-icono">
                                🐾
                            </div>

                            <div>

                                <h3>
                                    ${solicitud.nombreAnimal || "Animal"}
                                </h3>

                                <span>
                                    Solicitud de adopción
                                </span>

                            </div>

                        </div>

                        <span
                            class="estado-solicitud ${estado}">

                            ${textoEstado}

                        </span>

                    </div>


                    <div class="solicitud-datos">

                        <div class="solicitud-dato">

                            <strong>
                                👤 Solicitante
                            </strong>

                            <span>
                                ${solicitud.nombreUsuario || "Usuario"}
                            </span>

                        </div>


                        <div class="solicitud-dato">

                            <strong>
                                📧 Correo
                            </strong>

                            <span>
                                ${solicitud.correo || "No disponible"}
                            </span>

                        </div>

                    </div>


                    <div class="solicitud-mensaje">

                        <strong>
                            💬 Mensaje del solicitante
                        </strong>

                        <p>
                            ${solicitud.mensaje || "Sin mensaje"}
                        </p>

                    </div>


                    <div class="solicitud-botones">

                        <button
                            class="btn-aceptar-solicitud"
                            data-id="${idSolicitud}"
                            ${estado !== "pendiente" ? "disabled" : ""}>

                            ✅ Aceptar solicitud

                        </button>


                        <button
                            class="btn-rechazar-solicitud"
                            data-id="${idSolicitud}"
                            ${estado !== "pendiente" ? "disabled" : ""}>

                            ❌ Rechazar solicitud

                        </button>

                    </div>

                `;

                listaSolicitudes.appendChild(
                    tarjeta
                );

            }
        );

        activarBotonesSolicitudes();

    } catch (error) {

        console.error(
            "Error al cargar solicitudes:",
            error
        );

        cargandoSolicitudes.textContent =
            "❌ No se pudieron cargar las solicitudes.";

    }

}


function activarBotonesSolicitudes() {

    const botonesAceptar =
        document.querySelectorAll(
            ".btn-aceptar-solicitud"
        );

    const botonesRechazar =
        document.querySelectorAll(
            ".btn-rechazar-solicitud"
        );

    botonesAceptar.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    cambiarEstadoSolicitud(
                        boton.dataset.id,
                        "aceptada"
                    );

                }
            );

        }
    );


    botonesRechazar.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    cambiarEstadoSolicitud(
                        boton.dataset.id,
                        "rechazada"
                    );

                }
            );

        }
    );

}


async function cambiarEstadoSolicitud(
    idSolicitud,
    nuevoEstado
) {

    try {

        /* OBTENER SOLICITUD */

        const referenciaSolicitud =
            doc(
                db,
                "solicitudes_adopcion",
                idSolicitud
            );

        const documentoSolicitud =
            await getDoc(
                referenciaSolicitud
            );

        if (!documentoSolicitud.exists()) {

            alert(
                "❌ No se encontró la solicitud."
            );

            return;
        }

        const solicitud =
            documentoSolicitud.data();


        /* ACTUALIZAR ESTADO */

        await updateDoc(
            referenciaSolicitud,
            {
                estado:
                    nuevoEstado
            }
        );


        /* CREAR MENSAJE PARA USUARIO */

        let titulo =
            "";

        let mensaje =
            "";

        if (
            nuevoEstado ===
            "aceptada"
        ) {

            titulo =
                "🎉 Solicitud de adopción aceptada";

            mensaje =
                `¡Buenas noticias! Tu solicitud para adoptar a ${solicitud.nombreAnimal || "este animalito"} ha sido aceptada. Pronto podrás recibir más información sobre el proceso de adopción.`;

        } else {

            titulo =
                "Solicitud de adopción";

            mensaje =
                `Tu solicitud para adoptar a ${solicitud.nombreAnimal || "este animalito"} ha sido rechazada. Gracias por tu interés en ayudar a un animalito.`;

        }


        /* ENVIAR AL BUZÓN */

        await addDoc(
            collection(
                db,
                "buzon"
            ),
            {

                usuarioId:
                    solicitud.usuarioId,

                titulo:
                    titulo,

                mensaje:
                    mensaje,

                tipo:
                    "Adopción",

                leido:
                    false,

                fecha:
                    serverTimestamp()

            }
        );


        /* AVISO */

        alert(
            nuevoEstado === "aceptada"
                ? "✅ Solicitud aceptada y mensaje enviado al usuario."
                : "❌ Solicitud rechazada y mensaje enviado al usuario."
        );


        /* RECARGAR */

        cargarSolicitudes();


    } catch (error) {

        console.error(
            "Error al actualizar solicitud:",
            error
        );

        alert(
            "❌ No se pudo actualizar la solicitud."
        );

    }

}



function cargarChatsAdmin() {

    listaChatsAdmin.innerHTML =
        "💬 Cargando mensajes...";


    /*
     * No usamos orderBy aquí para evitar
     * problemas de índices de Firestore.
     */

    const consulta =
        query(
            collection(
                db,
                "chat_mensajes"
            )
        );


    onSnapshot(
        consulta,
        (resultado) => {

            listaChatsAdmin.innerHTML =
                "";


            if (resultado.empty) {

                listaChatsAdmin.innerHTML = `

                    <div class="sin-solicitudes">

                        <div class="sin-solicitudes-icono">
                            💬
                        </div>

                        <h3>
                            No hay mensajes
                        </h3>

                        <p>
                            Todavía no hay mensajes de usuarios.
                        </p>

                    </div>

                `;

                return;
            }

            const mensajes = [];


            resultado.forEach(
                (documento) => {

                    mensajes.push({

                        id:
                            documento.id,

                        ...documento.data()

                    });

                }
            );


            mensajes.sort(
                (a, b) => {

                    const fechaA =
                        a.fecha?.toMillis
                            ? a.fecha.toMillis()
                            : 0;

                    const fechaB =
                        b.fecha?.toMillis
                            ? b.fecha.toMillis()
                            : 0;

                    return fechaA - fechaB;

                }
            );


            mensajes.forEach(
                (mensaje) => {

                    const tarjeta =
                        document.createElement(
                            "article"
                        );

                    tarjeta.className =
                        "solicitud-card";


                    let fecha =
                        "";


                    if (
                        mensaje.fecha?.toDate
                    ) {

                        fecha =
                            mensaje.fecha
                                .toDate()
                                .toLocaleString(
                                    "es-MX"
                                );

                    }


                    tarjeta.innerHTML = `

                        <div class="solicitud-cabecera">

                            <div class="solicitud-animal">

                                <div class="solicitud-animal-icono">
                                    💬
                                </div>

                                <div>

                                    <h3>
                                        ${mensaje.nombreUsuario || "Usuario"}
                                    </h3>

                                    <span>
                                        ${mensaje.correo || ""}
                                    </span>

                                </div>

                            </div>

                        </div>


                        <div class="solicitud-mensaje">

                            <strong>
                                💬 Mensaje
                            </strong>

                            <p>
                                ${mensaje.mensaje || ""}
                            </p>

                        </div>


                        <small>
                            ${fecha}
                        </small>


                        <button
                            class="btn-responder-chat"
                            data-usuario="${mensaje.usuarioId}"
                            data-nombre="${mensaje.nombreUsuario || "Usuario"}">

                            💬 Responder

                        </button>

                    `;


                    listaChatsAdmin.appendChild(
                        tarjeta
                    );

                }
            );


            activarBotonesChat();

        },


        (error) => {

            console.error(
                "Error al cargar chats:",
                error
            );

            listaChatsAdmin.innerHTML =
                "❌ No se pudieron cargar los mensajes.";

        }
    );

}

function activarBotonesChat() {

    const botones =
        document.querySelectorAll(
            ".btn-responder-chat"
        );


    botones.forEach(
        (boton) => {

            boton.addEventListener(
                "click",
                () => {

                    const usuarioId =
                        boton.dataset.usuario;

                    const nombre =
                        boton.dataset.nombre;


                    responderChat(
                        usuarioId,
                        nombre
                    );

                }
            );

        }
    );

}


const modalResponderChat =
    document.getElementById(
        "modal-responder-chat"
    );

const nombreUsuarioChat =
    document.getElementById(
        "nombre-usuario-chat"
    );

const respuestaChat =
    document.getElementById(
        "respuesta-chat"
    );

const errorRespuestaChat =
    document.getElementById(
        "error-respuesta-chat"
    );

const cerrarModalChat =
    document.getElementById(
        "cerrar-modal-chat"
    );

const cancelarRespuestaChat =
    document.getElementById(
        "cancelar-respuesta-chat"
    );

const enviarRespuestaChat =
    document.getElementById(
        "enviar-respuesta-chat"
    );


let usuarioChatSeleccionado =
    null;

let nombreChatSeleccionado =
    "";



function responderChat(
    usuarioId,
    nombre
) {

    usuarioChatSeleccionado =
        usuarioId;

    nombreChatSeleccionado =
        nombre;

    nombreUsuarioChat.textContent =
        `Responder a ${nombre}`;

    respuestaChat.value =
        "";

    errorRespuestaChat.textContent =
        "";

    modalResponderChat.style.display =
        "flex";

    respuestaChat.focus();

}


function cerrarModalResponderChat() {

    modalResponderChat.style.display =
        "none";

    respuestaChat.value =
        "";

    errorRespuestaChat.textContent =
        "";

    usuarioChatSeleccionado =
        null;

}




if (cerrarModalChat) {

    cerrarModalChat.addEventListener(
        "click",
        cerrarModalResponderChat
    );

}



if (cancelarRespuestaChat) {

    cancelarRespuestaChat.addEventListener(
        "click",
        cerrarModalResponderChat
    );

}



if (modalResponderChat) {

    modalResponderChat.addEventListener(
        "click",
        (event) => {

            if (
                event.target ===
                modalResponderChat
            ) {

                cerrarModalResponderChat();

            }

        }
    );

}




if (enviarRespuestaChat) {

    enviarRespuestaChat.addEventListener(
        "click",
        async () => {

            const respuesta =
                respuestaChat.value.trim();


            if (!respuesta) {

                errorRespuestaChat.textContent =
                    "Escribe una respuesta antes de enviarla.";

                respuestaChat.focus();

                return;
            }


            enviarRespuestaChat.disabled =
                true;

            enviarRespuestaChat.textContent =
                "Enviando...";


            try {

                await addDoc(
                    collection(
                        db,
                        "chat_mensajes"
                    ),
                    {

                        usuarioId:
                            usuarioChatSeleccionado,

                        nombreUsuario:
                            "Administrador",

                        correo:
                            "admin@huellita.com",

                        mensaje:
                            respuesta,

                        remitente:
                            "admin",

                        fecha:
                            serverTimestamp()

                    }
                );


                cerrarModalResponderChat();


                alert(
                    "✅ Respuesta enviada correctamente."
                );


            } catch (error) {

                console.error(
                    "Error al responder:",
                    error
                );

                errorRespuestaChat.textContent =
                    "❌ No se pudo enviar la respuesta.";

            }


            enviarRespuestaChat.disabled =
                false;

            enviarRespuestaChat.innerHTML =
                "💬 Enviar respuesta";

        }
    );

}


if (cerrarSesion) {

    cerrarSesion.addEventListener(
        "click",
        async () => {

            try {

                await signOut(
                    auth
                );

                window.location.href =
                    "login.html";

            } catch (error) {

                console.error(
                    "Error al cerrar sesión:",
                    error
                );

            }

        }
    );

}