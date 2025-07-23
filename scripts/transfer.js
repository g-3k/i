import { auth, db } from './firebase.js';
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.min.js';

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById('transfer-form');
  const btnQR = document.getElementById('crear-qr');
  const canvasQR = document.getElementById('qr-canvas');
  const errorMsg = document.getElementById('mensaje-error');

  let userAlias = '';
  let userSaldo = 0;

  auth.onAuthStateChanged(async (user) => {
    if (!user) return window.location.href = '/login.html';
    const doc = await db.collection("usuarios").doc(user.uid).get();
    if (!doc.exists) return;

    const data = doc.data();
    userAlias = data.alias;
    userSaldo = data.saldo;
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const destino = document.getElementById('destino').value;
    const monto = parseFloat(document.getElementById('monto').value);

    if (monto <= 0 || isNaN(monto)) {
      errorMsg.textContent = "Monto inválido";
      return;
    }

    if (monto > userSaldo) {
      errorMsg.textContent = "Saldo insuficiente";
      return;
    }

    try {
      // Restar al usuario actual
      const user = auth.currentUser;
      const userRef = db.collection("usuarios").doc(user.uid);
      await userRef.update({ saldo: userSaldo - monto });

      // Sumar al destino
      const query = await db.collection("usuarios").where("alias", "==", destino).get();
      if (query.empty) {
        errorMsg.textContent = "Usuario destino no encontrado";
        return;
      }

      const destinoDoc = query.docs[0];
      const destinoRef = db.collection("usuarios").doc(destinoDoc.id);
      const saldoDestino = destinoDoc.data().saldo || 0;
      await destinoRef.update({ saldo: saldoDestino + monto });

      alert("Transferencia realizada correctamente");
      location.reload();

    } catch (err) {
      console.error(err);
      errorMsg.textContent = "Error al transferir";
    }
  });

  btnQR.onclick = async () => {
    const destino = document.getElementById('destino').value;
    const monto = parseFloat(document.getElementById('monto').value);

    if (!destino || !monto || isNaN(monto)) {
      errorMsg.textContent = "Completa los datos correctamente para generar QR";
      return;
    }

    if (monto > userSaldo) {
      errorMsg.textContent = "No tienes saldo suficiente para generar este QR";
      return;
    }

    const datosQR = JSON.stringify({ origen: userAlias, destino, monto });
    try {
      await QRCode.toCanvas(canvasQR, datosQR, { width: 200 });
      errorMsg.textContent = "";
    } catch (err) {
      console.error("Error generando QR", err);
      errorMsg.textContent = "Error generando QR";
    }
  };
});
