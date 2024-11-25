const modal = document.getElementById("responseModal");
const closeModalButton = document.getElementById("closeModalButton");

const toggleModal = (title, body) => {
  const modalTitle = document.getElementById("responseModalTitle");
  const modalBody = document.getElementById("responseModalBody");
  modalTitle.textContent = title;
  modalBody.textContent = body;
  modal.style.display = "block";
};

const hideModal = () => (modal.style.display = "none");

closeModalButton.addEventListener("click", () => {
  hideModal();
  window.location.href = "/novedades";
});

document
  .getElementById("add-novedad-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();

    const form = e.target; // El formulario completo
    const formData = new FormData(form); // Obtiene todos los datos, incluida la imagen

    try {
      const response = await fetch("/add-novedad", {
        method: "POST",
        body: formData, // Enviar FormData directamente
      });

      if (response.ok) {
        toggleModal("Éxito", "La novedad se ha añadido correctamente.");
        setTimeout(() => (window.location.href = "/novedades"), 2000);
      } else {
        const error = await response.json();
        toggleModal(
          "Error",
          error.message || "Ocurrió un error al añadir la novedad."
        );
      }
    } catch (err) {
      toggleModal("Error", "No se pudo conectar con el servidor.");
    }
  });
