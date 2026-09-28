import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    collection,
    getDocs,
    query,
    where,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";



async function cargarMensajes(usuario) {

    const lista =
        document.getElementById("lista-mensajes");

    const cargando =
        document.getElementById("cargando-mensajes");

    const sinMensajes =
        document.getElementById("sin-mensajes");


    try {

        const referencia =
            collection(
                db,
                "buzon"
            );


        const consulta =
            query(
                referencia,
                where(
                    "usuarioId",
                    "==",
                    usuario.uid
                ),
                orderBy(
                    "fecha",
                    "desc"
                )
            );


        const resultado =
            await getDocs(
                consulta
            );


        cargando.style.display =
            "none";


        if (resultado.empty) {

            sinMensajes.style.display =
                "block";

            return;
        }


        resultado.forEach(
            (documento) => {

                const mensaje =
                    documento.data();


                const tarjeta =
                    document.createElement(
                        "article"
                    );


                tarjeta.className =
                    "mensaje-buzon";


                tarjeta.innerHTML = `

                    <div class="mensaje-icono">
                        📩
                    </div>

                    <div class="mensaje-contenido">

                        <h3>
                            ${mensaje.titulo || "Mensaje"}
                        </h3>

                        <p>
                            ${mensaje.mensaje || ""}
                        </p>

                        <span>
                            ${mensaje.tipo || "Información"}
                        </span>

                    </div>

                `;


                lista.appendChild(
                    tarjeta
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar el buzón:",
            error
        );


        cargando.textContent =
            "No se pudieron cargar los mensajes.";

    }

}


onAuthStateChanged(
    auth,
    (usuario) => {

        if (!usuario) {

            document.getElementById(
                "cargando-mensajes"
            ).textContent =
                "🔐 Inicia sesión para consultar tu buzón.";

            return;
        }

        console.log(
            "🐾 UID DEL USUARIO EN BUZÓN:",
            usuario.uid
        );

        console.log(
            "📧 CORREO DEL USUARIO:",
            usuario.email
        );

        cargarMensajes(
            usuario
        );

    }
);