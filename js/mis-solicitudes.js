import { auth, db } from "./firebase.js";

import {
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    collection,
    query,
    where,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


const cargando =
    document.getElementById("cargando-solicitudes");

const sinSolicitudes =
    document.getElementById("sin-solicitudes");

const lista =
    document.getElementById(
        "lista-solicitudes-usuario"
    );


async function cargarSolicitudes(usuario) {

    try {

        const referencia =
            collection(
                db,
                "solicitudes_adopcion"
            );


        const consulta =
            query(
                referencia,
                where(
                    "usuarioId",
                    "==",
                    usuario.uid
                )
            );


        const resultado =
            await getDocs(
                consulta
            );

console.log(
    "🐾 UID DEL USUARIO:",
    usuario.uid
);

console.log(
    "📋 SOLICITUDES ENCONTRADAS:",
    resultado.size
);
        cargando.style.display =
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


                const tarjeta =
                    document.createElement(
                        "article"
                    );


                tarjeta.className =
                    "solicitud-usuario";


                let estadoClase =
                    "pendiente";

                let estadoTexto =
                    "🟡 Pendiente";


                if (
                    solicitud.estado ===
                    "aceptada"
                ) {

                    estadoClase =
                        "aceptada";

                    estadoTexto =
                        "🟢 Aceptada";

                }


                if (
                    solicitud.estado ===
                    "rechazada"
                ) {

                    estadoClase =
                        "rechazada";

                    estadoTexto =
                        "🔴 Rechazada";

                }


                let fecha =
                    "Fecha no disponible";


                if (
                    solicitud.fecha &&
                    typeof solicitud.fecha.toDate ===
                    "function"
                ) {

                    fecha =
                        solicitud.fecha
                            .toDate()
                            .toLocaleDateString(
                                "es-MX",
                                {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric"
                                }
                            );

                }


                tarjeta.innerHTML = `

                    <div class="solicitud-usuario-icono">
                        🐾
                    </div>

                    <div class="solicitud-usuario-contenido">

                        <h2>
                            ${solicitud.nombreAnimal || "Animal"}
                        </h2>

                        <p>
                            Solicitud de adopción
                        </p>

                        <span
                            class="estado-solicitud-usuario ${estadoClase}"
                        >
                            ${estadoTexto}
                        </span>

                        <small>
                            📅 ${fecha}
                        </small>

                    </div>

                `;


                lista.appendChild(
                    tarjeta
                );

            }
        );


    } catch (error) {

        console.error(
            "Error al cargar las solicitudes:",
            error
        );


        cargando.textContent =
            "❌ No se pudieron cargar tus solicitudes.";

    }

}


onAuthStateChanged(
    auth,
    (usuario) => {

        if (!usuario) {

            cargando.textContent =
                "🔐 Inicia sesión para consultar tus solicitudes.";

            return;
        }


        cargarSolicitudes(
            usuario
        );

    }
);