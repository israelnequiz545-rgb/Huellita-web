// Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.3.0/firebase-app.js";

import {
    getAuth
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-auth.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-firestore.js";

import {
    getStorage
} from "https://www.gstatic.com/firebasejs/12.3.0/firebase-storage.js";


// CONFIGURACION DE FIREBASE

const firebaseConfig = {

    apiKey: "AIzaSyDyNDMj6hM02-OzgLs66x1AI1MZnLhKQDM",

    authDomain: "huellita-24612.firebaseapp.com",

    projectId: "huellita-24612",

    storageBucket: "huellita-24612.firebasestorage.app",

    messagingSenderId: "701601666698",

    appId: "1:701601666698:web:b660712d26ff021512ff73",

    measurementId: "G-8G1G35J6FV"

};



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

const storage = getStorage(app);



export {
    app,
    auth,
    db,
    storage
};