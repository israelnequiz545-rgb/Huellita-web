import { db } from "./firebase.js";

import {
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";


async function cargarAnimales() {

    try {

        const consulta = await getDocs(
            collection(db, "animales")
        );

        const contenedor =
            document.querySelector(".grid-animales");

        const contador =
            document.getElementById("contador-animales");

        const sinResultados =
            document.getElementById("sin-resultados");


        contenedor.innerHTML = "";


        consulta.forEach((documento) => {

            const animal = documento.data();

            const idAnimal = documento.id;


            const tarjeta =
                document.createElement("article");

            tarjeta.classList.add("animal-card");


            tarjeta.dataset.especie =
                animal.especie;

            tarjeta.dataset.tamano =
                animal.tamano;

            tarjeta.dataset.edad =
                animal.edad;

            tarjeta.dataset.sexo =
                animal.sexo;


            tarjeta.innerHTML = `

                <div class="animal-foto">

                    <img
                        src="${animal.imagen || 'img/default.jpg'}"
                        alt="${animal.nombre}">

                    <span class="etiqueta-adopcion">
                        En adopción
                    </span>

                </div>


                <div class="animal-info">

                    <h3>
                        ${animal.nombre}
                    </h3>


                    <p class="datos">

                        🐾 ${animal.especie}
                        · ${animal.sexo}
                        · ${animal.edad}

                    </p>


                    <div class="caracteristicas">

                        <span>
                            ${animal.tamano}
                        </span>

                        <span>
                            ${animal.descripcion}
                        </span>

                    </div>


                    <a
                        href="perfil-animal.html?id=${idAnimal}"
                        class="btn-card">

                        Ver perfil

                    </a>

                </div>

            `;


            contenedor.appendChild(tarjeta);

        });


        contador.textContent =
            consulta.size + " animalitos";


        if (consulta.size === 0) {

            sinResultados.style.display =
                "block";

        } else {

            sinResultados.style.display =
                "none";

        }


    } catch (error) {

        console.error(
            "Error al cargar los animales:",
            error
        );

    }

}


cargarAnimales();