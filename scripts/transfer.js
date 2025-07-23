import { db } from './firebase.js';
import { ref, get, update, child } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

const user = JSON.parse(localStorage.getItem("user"));
if (!user || !user.username) {
  window.location.href = "index.html";
}

const dbRef = ref(db);
const estado = document.getElementById("estado");
const saldoEl = document.getElementById("saldo-actual");

let saldoActual = 0;

// Obtener saldo actual
get(child(dbRef, `estudiantes/${user.username}`)).then(snapshot => {
  if (snapshot.exists()) {
    saldoActual = snapshot.val().coins || 0;
    saldoEl.textContent = `Saldo actual: ${saldoActual} steficoins`;
  } else {
    estado.textContent = "Error al obtener datos del usuario.";
  }
});

// Botón transferir
document.getElementById("btn-transferir").addEventListener("click", async () => {
  const destinatario = document.getElementById("destinatario").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value);

  estado.textContent = "";

  if (!destinatario || isNaN(cantidad) || cantidad <= 0) {
    estado.textContent = "Por favor, ingresa un destinatario y una cantidad válida.";
    return;
  }

  if (destinatario === user.username) {
    estado.textContent = "No puedes transferirte monedas a ti mismo.";
    return;
  }

  try {
    const [emisorSnap, receptorSnap] = await Promise.all([
      get(child(dbRef, `estudiantes/${user.username}`)),
      get(child(dbRef, `estudiantes/${destinatario}`))
    ]);

    if (!receptorSnap.exists()) {
      estado.textContent = "El destinatario no existe.";
      return;
    }

    const emisorData = emisorSnap.val();
    const receptorData = receptorSnap.val();

    if (cantidad > emisorData.coins) {
      estado.textContent = "No tienes suficientes steficoins.";
      return;
    }

    // Actualizar saldos
    const nuevosDatos = {};
    nuevosDatos[`estudiantes/${user.username}/coins`] = emisorData.coins - cantidad;
    nuevosDatos[`estudiantes/${destinatario}/coins`] = (receptorData.coins || 0) + cantidad;

    await update(dbRef, nuevosDatos);

    estado.textContent = `✅ Transferencia completada: enviaste ${cantidad} a ${destinatario}.`;
    saldoActual -= cantidad;
    saldoEl.textContent = `Saldo actual: ${saldoActual} steficoins`;

    document.getElementById("destinatario").value = "";
    document.getElementById("cantidad").value = "";
  } catch (err) {
    console.error(err);
    estado.textContent = "Ocurrió un error al realizar la transferencia.";
  }
});

// Botón Generar QR
document.getElementById("btn-qr").addEventListener("click", () => {
  const destinatario = document.getElementById("destinatario").value.trim();
  const cantidad = parseInt(document.getElementById("cantidad").value);

  if (!destinatario || isNaN(cantidad) || cantidad <= 0) {
    estado.textContent = "Completa un destinatario y cantidad válida para generar el QR.";
    return;
  }

  const datosQR = JSON.stringify({
    tipo: "transferencia",
    de: user.username,
    a: destinatario,
    cantidad
  });

  const qrImg = document.getElementById("qr-img");
  QRCode.toDataURL(datosQR)
    .then(url => {
      qrImg.src = url;
      qrImg.style.display = "block";
    })
    .catch(err => {
      console.error(err);
      estado.textContent = "Error generando el código QR.";
    });
});
