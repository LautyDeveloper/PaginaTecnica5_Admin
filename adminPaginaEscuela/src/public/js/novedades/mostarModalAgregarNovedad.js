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

    const form = e.target;
    const novedad = form.novedad.value.trim();
    const descripcion = form.descripcion.value.trim();
    const descripcionLarga = form.descripcionLarga.value.trim();

    // Validaciones en el frontend
    if (!novedad || novedad.length > 60) {
      toggleModal("Error", "El título no puede superar los 60 caracteres.");
      return;
    }
    if (!descripcion || descripcion.length > 70) {
      toggleModal(
        "Error",
        "La descripción no puede superar los 70 caracteres."
      );
      return;
    }
    if (!descripcionLarga || descripcionLarga.length < 90) {
      toggleModal(
        "Error",
        "La descripción larga debe tener al menos 90 caracteres."
      );
      return;
    }

    // Enviar los datos al backend
    const formData = new FormData(form);

    try {
      const response = await fetch("/add-novedad", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        toggleModal("Éxito", "La novedad se ha añadido correctamente.");
        setTimeout(() => (window.location.href = "/novedades"), 2000);
      } else {
        const error = await response.json();
        toggleModal(
          "Error",
          error.errors ? error.errors.join("\n") : "Ocurrió un error."
        );
      }
    } catch (err) {
      toggleModal("Error", "No se pudo conectar con el servidor.");
    }
  });
