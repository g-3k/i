// Importación de módulos de Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  child,
  set
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB2U5TWDc6JR2XFelPC6h5eZO0q1OSUx20",
  authDomain: "steficoin.firebaseapp.com",
  projectId: "steficoin",
  storageBucket: "steficoin.firebasestorage.app",
  messagingSenderId: "184374448124",
  appId: "1:184374448124:web:5d35562aea23b463dcac79",
  databaseURL: "https://steficoin-default-rtdb.firebaseio.com"
};

// Inicialización de Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// 🔍 Buscar usuario por alias (receptor)
export async function getUserData(aliasBuscado) {
  const snapshot = await get(ref(db, 'estudiantes'));
  if (snapshot.exists()) {
    const estudiantes = snapshot.val();
    for (const id in estudiantes) {
      const user = estudiantes[id];
      if (user.alias === aliasBuscado) {
        return { ...user, _id: id };
      }
    }
  }
  return null;
}

// 💾 Actualizar datos de un usuario por su ID
export async function updateUserData(userId, data) {
  const userRef = ref(db, `estudiantes/${userId}`);
  try {
    await set(userRef, data);
    return true;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return false;
  }
}
