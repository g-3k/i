import { getUserData, updateUserCoins } from './firebase.js';

document.addEventListener("DOMContentLoaded", async () => {
  const user = await getUserData();
  const saldoText = document.getElementById("saldo-actual");
  const estado = document.getElementById("estado");
  const qrImg = document.getElementById("qr-img");

  if (!user) {
    saldoText.textContent = "Error al cargar datos de usuario.";
    return;
  }

  saldoText.textContent = `Saldo actual: ${user.coins} monedas`;

  document.getElementById("btn-transferir").addEventListener("click", async () => {
    const destinatario = document.getElementById("destinatario").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!destinatario || isNaN(cantidad) || cantidad <= 0) {
      estado.textContent = "Por favor, completa los campos correctamente.";
      return;
    }

    if (user.coins < cantidad) {
      estado.textContent = "Saldo insuficiente.";
      return;
    }

    const enlace = `https://g-3k.github.io/index/transfer?to=${encodeURIComponent(destinatario)}&coins=${cantidad}`;

    // Descontar del saldo actual
    const nuevoSaldo = user.coins - cantidad;
    const exito = await updateUserCoins(user.uid, nuevoSaldo);
    
    if (exito) {
      saldoText.textContent = `Nuevo saldo: ${nuevoSaldo} monedas`;
      estado.textContent = "Transferencia generada (enlace o QR listo).";
    } else {
      estado.textContent = "Error al actualizar saldo.";
    }
  });

  document.getElementById("btn-qr").addEventListener("click", () => {
    const destinatario = document.getElementById("destinatario").value.trim();
    const cantidad = parseInt(document.getElementById("cantidad").value);

    if (!destinatario || isNaN(cantidad) || cantidad <= 0) {
      estado.textContent = "Por favor, completa los campos correctamente.";
      return;
    }

    const enlace = `https://g-3k.github.io/index/transfer?to=${encodeURIComponent(destinatario)}&coins=${cantidad}`;
    const qrUrl = `https://quickchart.io/qr?text=${encodeURIComponent(enlace)}&size=200`;

    qrImg.src = qrUrl;
    qrImg.style.display = "block";
    estado.textContent = "QR generado con éxito.";
  });
});
