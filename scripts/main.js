import { db } from './firebase.js';
import { ref, get, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

document.getElementById('login-form').addEventListener('submit', async e => {
  e.preventDefault();
  const username = e.target[0].value;
  const password = e.target[1].value;

  const dbRef = ref(db);
  try {
    const snapshot = await get(child(dbRef, `estudiantes/${username}`));
    if (snapshot.exists()) {
      const data = snapshot.val();
      if (data.password === password) {
        localStorage.setItem('user', JSON.stringify({ username }));
        window.location.href = "home.html";
      } else {
        document.getElementById("error-msg").textContent = "Contraseña incorrecta.";
      }
    } else {
      document.getElementById("error-msg").textContent = "Usuario no encontrado.";
    }
  } catch (error) {
    console.error(error);
    document.getElementById("error-msg").textContent = "Error al conectarse con Firebase.";
  }
});
