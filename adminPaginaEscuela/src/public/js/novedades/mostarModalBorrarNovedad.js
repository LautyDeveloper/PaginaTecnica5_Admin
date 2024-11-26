document.addEventListener("DOMContentLoaded", () => {
  const deleteButtons = document.querySelectorAll(".btn-delete");
  const modal = document.getElementById("deleteModal");
  const confirmDelete = document.getElementById("confirmDelete");
  const cancelDelete = document.getElementById("cancelDelete");

  let selectedId = null;

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      e.preventDefault();
      selectedId = button.dataset.id;
      modal.style.display = "flex";
    });
  });

  confirmDelete.addEventListener("click", () => {
    if (selectedId) {
      window.location.href = `/delete-novedad/${selectedId}`;
    }
  });

  cancelDelete.addEventListener("click", () => {
    modal.style.display = "none";
    selectedId = null;
  });

  // Cerrar el modal al hacer clic fuera de él
  window.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.style.display = "none";
      selectedId = null;
    }
  });
});
