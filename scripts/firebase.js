// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2U5TWDc6JR2XFelPC6h5eZO0q1OSUx20",
  authDomain: "steficoin.firebaseapp.com",
  projectId: "steficoin",
  storageBucket: "steficoin.firebasestorage.app",
  messagingSenderId: "184374448124",
  appId: "1:184374448124:web:5d35562aea23b463dcac79",
  databaseURL: "https://steficoin-default-rtdb.firebaseio.com"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);

// ✅ Función para obtener datos de un usuario por alias
export async function getUserData(alias) {
  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `usuarios/${alias}`));
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener datos del usuario:", error);
    return null;
  }
}

// ✅ Función para guardar los datos actualizados
export async function updateUserData(alias, data) {
  const userRef = ref(db, `usuarios/${alias}`);
  try {
    await set(userRef, data);
    return true;
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return false;
  }
}
