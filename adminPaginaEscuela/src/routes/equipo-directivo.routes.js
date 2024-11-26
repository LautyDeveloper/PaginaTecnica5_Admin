import { Router } from "express";
import pool from "../database.js";

const router = Router();

// Mostrar equipo directivo
router.get("/equipo-directivo", async (req, res) => {
  try {
    // Se obtiene todo el equipo directivo desde la base de datos
    const [equipoDirectivo] = await pool.query("SELECT * FROM equipodirectivo");

    // Se renderiza la vista con los datos del equipo
    res.render("equipo-directivo/equipo-directivo", { equipoDirectivo });
  } catch (err) {
    // Si ocurre un error, se responde con un mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Renderizar formulario para añadir un miembro
router.get("/add-equipo-directivo", (req, res) =>
  // Renderiza la vista para añadir un nuevo miembro al equipo
  res.render("equipo-directivo/add-equipo-directivo")
);

// Validación de datos del directivo
const validateDirectivo = ({ Nombre, Apellido, Cargo }) => {
  const errors = [];

  // Validación para Nombre
  if (!Nombre || Nombre.trim().length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres.");
  } else if (Nombre.length > 50) {
    errors.push("El nombre no puede superar los 50 caracteres.");
  } else if (!/^[a-zA-Z\s]+$/.test(Nombre)) {
    errors.push("El nombre solo puede contener letras y espacios.");
  }

  // Validación para Apellido
  if (!Apellido || Apellido.trim().length < 2) {
    errors.push("El apellido debe tener al menos 2 caracteres.");
  } else if (Apellido.length > 50) {
    errors.push("El apellido no puede superar los 50 caracteres.");
  } else if (!/^[a-zA-Z\s]+$/.test(Apellido)) {
    errors.push("El apellido solo puede contener letras y espacios.");
  }

  // Validación para Cargo
  if (!Cargo || Cargo.trim().length < 3) {
    errors.push("El cargo debe tener al menos 3 caracteres.");
  } else if (Cargo.length > 100) {
    errors.push("El cargo no puede superar los 100 caracteres.");
  }

  return errors; // Devuelve los errores encontrados (si los hay)
};

// Añadir miembro al equipo directivo
router.post("/add-equipo-directivo", async (req, res) => {
  try {
    // Se validan los datos enviados desde el formulario
    const validationErrors = validateDirectivo(req.body);
    if (validationErrors.length > 0) {
      // Si hay errores, se devuelve una respuesta con los errores
      return res.status(400).json({ message: validationErrors.join(" ") });
    }

    // Si las validaciones pasan, se inserta el nuevo miembro en la base de datos
    await pool.query("INSERT INTO equipodirectivo SET ?", [req.body]);

    // Redirige a la página principal del equipo directivo
    res.redirect("/equipo-directivo");
  } catch (err) {
    // En caso de error, se responde con un mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Renderizar formulario para editar un miembro
router.get("/edit-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { idDirectivo } = req.params;

    // Se obtiene el miembro del equipo directivo a editar usando su ID
    const [equipoDirectivo] = await pool.query(
      "SELECT * FROM equipodirectivo WHERE idDirectivo = ?",
      [idDirectivo]
    );

    // Se renderiza la vista de edición con los datos del miembro
    res.render("equipo-directivo/edit-equipo-directivo", {
      equipoDirectivo: equipoDirectivo[0],
    });
  } catch (err) {
    // En caso de error, se responde con un mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Editar un miembro del equipo directivo
router.post("/edit-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { idDirectivo } = req.params;
    const { Nombre, Apellido, Cargo } = req.body;

    // Se validan los datos del miembro a editar
    const validationErrors = validateDirectivo({ Nombre, Apellido, Cargo });
    if (validationErrors.length > 0) {
      // Si hay errores, se devuelve una respuesta con los errores
      return res.status(400).json({ errors: validationErrors });
    }

    // Se prepara la actualización de los datos
    const updatedDirectivo = { Nombre, Apellido, Cargo };

    // Se actualizan los datos del miembro en la base de datos
    await pool.query("UPDATE equipodirectivo SET ? WHERE idDirectivo = ?", [
      updatedDirectivo,
      idDirectivo,
    ]);

    // Redirige a la página principal del equipo directivo
    res.redirect("/equipo-directivo");
  } catch (err) {
    // En caso de error, se responde con un mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Eliminar un miembro del equipo directivo
router.get("/delete-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { idDirectivo } = req.params;

    // Se elimina el miembro del equipo directivo usando su ID
    await pool.query("DELETE FROM equipodirectivo WHERE idDirectivo = ?", [
      idDirectivo,
    ]);

    // Redirige a la página principal del equipo directivo
    res.redirect("/equipo-directivo");
  } catch (err) {
    // En caso de error, se responde con un mensaje de error
    res.status(500).json({ message: err.message });
  }
});

export default router;
