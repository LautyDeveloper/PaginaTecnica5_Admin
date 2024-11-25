document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("confirmModal");
  const alertMessage = document.getElementById("alert-message");
  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");

  let novedadId = null;

  // Delegación de eventos para botones de eliminar
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      e.preventDefault();
      novedadId = e.target.dataset.id;
      modal.classList.remove("hidden");
    }
  });

  // Confirmar eliminación
  confirmDelete.addEventListener("click", async () => {
    if (novedadId) {
      try {
        const response = await fetch(`/delete-novedad/${novedadId}`, {
          method: "GET",
        });
        if (response.ok) {
          showAlert("Novedad eliminada con éxito");
          setTimeout(() => window.location.reload(), 400);
        } else {
          showAlert("Error al eliminar la novedad", true);
        }
      } catch (err) {
        console.error(err);
        showAlert("Error al eliminar la novedad", true);
      }
    }
    modal.classList.add("hidden");
  });

  // Cancelar eliminación
  cancelDelete.addEventListener("click", () => modal.classList.add("hidden"));

  // Función para mostrar alertas
  function showAlert(message, isError = false) {
    alertMessage.textContent = message;
    alertMessage.style.backgroundColor = isError ? "red" : "green";
    alertMessage.classList.remove("hidden");
    setTimeout(() => alertMessage.classList.add("hidden"), 5000);
  }
});
