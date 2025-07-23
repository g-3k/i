import { getUserData, setUserData } from './firebase.js';
import QRCode from 'https://cdn.jsdelivr.net/npm/qrcode@1.5.1/build/qrcode.esm.js';

const alias = localStorage.getItem("alias");
const mensaje = document.getElementById("transfer-msg");
const inputDestino = document.getElementById("destinatario");
const inputMonto = document.getElementById("monto");
const canvasQR = document.getElementById("qr-canvas");
const btnTransferir = document.getElementById("btn-transferir");
const btnCrearQR = document.getElementById("btn-crear-qr");

function mostrarMensaje(txt, color = 'red') {
  mensaje.textContent = txt;
  mensaje.style.color = color;
}

// Realizar la transferencia
async function transferirCoins(destino, monto) {
  if (!alias || !destino || !monto) {
    mostrarMensaje("Faltan datos.");
    return;
  }

  if (destino === alias) {
    mostrarMensaje("No puedes transferirte monedas a ti mismo.");
    return;
  }

  const datosOrigen = await getUserData(alias);
  const datosDestino = await getUserData(destino);

  if (!datosOrigen) {
    mostrarMensaje("Tu cuenta no existe.");
    return;
  }

  if (!datosDestino) {
    mostrarMensaje("El destinatario no existe.");
    return;
  }

  if (datosOrigen.coins < monto) {
    mostrarMensaje("Saldo insuficiente.");
    return;
  }

  // Realizar transferencia
  await setUserData(alias, {
    ...datosOrigen,
    coins: datosOrigen.coins - monto,
  });

  await setUserData(destino, {
    ...datosDestino,
    coins: datosDestino.coins + monto,
  });

  mostrarMensaje(`¡Transferencia exitosa de ${monto} monedas a ${destino}!`, 'green');
}

// Si viene por URL
window.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const to = urlParams.get("to");
  const coins = parseInt(urlParams.get("coins"));

  if (to && coins > 0) {
    await transferirCoins(to, coins);
  }
});

// Evento botón "Transferir ahora"
btnTransferir?.addEventListener("click", () => {
  const destino = inputDestino.value.trim();
  const monto = parseInt(inputMonto.value);

  if (!destino || isNaN(monto) || monto <= 0) {
    mostrarMensaje("Datos inválidos.");
    return;
  }

  transferirCoins(destino, monto);
});

// Evento botón "Crear QR"
btnCrearQR?.addEventListener("click", () => {
  const destino = inputDestino.value.trim();
  const monto = parseInt(inputMonto.value);

  if (!destino || isNaN(monto) || monto <= 0) {
    mostrarMensaje("Datos inválidos para el QR.");
    return;
  }

  const enlaceQR = `${window.location.origin}/index/transfer?to=${encodeURIComponent(destino)}&coins=${monto}`;
  QRCode.toCanvas(canvasQR, enlaceQR, { width: 200 }, (err) => {
    if (err) {
      mostrarMensaje("Error generando el QR.");
      return;
    }
    mostrarMensaje("QR generado con éxito.", "green");
  });
});
