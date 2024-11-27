import { Router } from "express";
import pool from "../database.js";
import multerConfig from "./multer-config.js"; // Ruta donde creaste la configuración de multer

const router = Router();

// Renderizar el formulario para añadir una novedad
router.get("/add-novedad", (req, res) => {
  res.render("novedades/add-novedad");
});

// Función de validación para los datos de la novedad
const validateNovedad = ({ novedad, descripcion, descripcionLarga }) => {
  const errors = [];

  // Validación del título de la novedad
  if (!novedad || novedad.length > 60) {
    errors.push("El título no puede superar los 60 caracteres.");
  }

  // Validación de la descripción breve
  if (!descripcion || descripcion.length > 70) {
    errors.push("La descripción no puede superar los 70 caracteres.");
  }

  // Validación de la descripción larga
  if (!descripcionLarga || descripcionLarga.length < 90) {
    errors.push("La descripción larga debe tener al menos 90 caracteres.");
  }

  return errors; // Devolvemos los errores encontrados
};

// Ruta para añadir una nueva novedad
router.post(
  "/add-novedad",
  multerConfig.single("imagenUrl"),
  async (req, res) => {
    try {
      const { novedad, descripcion, descripcionLarga } = req.body;

      // Validación de los datos del formulario
      const validationErrors = validateNovedad({
        novedad,
        descripcion,
        descripcionLarga,
      });

      // Si hay errores, respondemos con un código 400 y los mensajes de error
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      // Si se subió una imagen, se guarda la URL correspondiente
      const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null;

      // Crear un nuevo objeto con la novedad
      const newNovedad = { novedad, descripcion, descripcionLarga, imagenUrl };

      // Insertar la novedad en la base de datos
      await pool.query("INSERT INTO novedades SET ?", [newNovedad]);

      // Redirigir a la vista de novedades
      res.redirect("/novedades");
    } catch (err) {
      // En caso de error, respondemos con un mensaje de error
      res.status(500).json({ message: err.message });
    }
  }
);

// Mostrar todas las novedades
router.get("/novedades", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM novedades");
    res.render("novedades/novedades", { novedades: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para renderizar el formulario de edición de una novedad
router.get("/edit-novedad/:idNovedad", async (req, res) => {
  try {
    const { idNovedad } = req.params;
    const [novedad] = await pool.query(
      "SELECT * FROM novedades WHERE idNovedad = ?",
      [idNovedad]
    );

    // Renderizamos el formulario de edición con los datos de la novedad
    res.render("novedades/edit-novedad", { novedad: novedad[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para actualizar una novedad
router.post(
  "/edit-novedad/:idNovedad",
  multerConfig.single("imagen"),
  async (req, res) => {
    try {
      const { novedad, descripcion, descripcionLarga, imagenActual } = req.body;
      const { idNovedad } = req.params;

      // Validación de los datos antes de actualizar
      const validationErrors = validateNovedad({
        novedad,
        descripcion,
        descripcionLarga,
      });
      if (validationErrors.length > 0) {
        return res.status(400).json({ errors: validationErrors });
      }

      // Si hay una nueva imagen, la usamos; si no, mantenemos la imagen actual
      const imagenUrl = req.file
        ? `/uploads/${req.file.filename}`
        : imagenActual;

      // Objeto con los datos actualizados
      const editNovedad = { novedad, descripcion, descripcionLarga, imagenUrl };

      // Actualizamos la novedad en la base de datos
      await pool.query("UPDATE novedades SET ? WHERE idNovedad = ?", [
        editNovedad,
        idNovedad,
      ]);

      // Redirigir después de la actualización
      res.redirect("/novedades");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Ruta para eliminar una novedad
router.get("/delete-novedad/:idNovedad", async (req, res) => {
  try {
    const { idNovedad } = req.params;

    // Eliminar la novedad de la base de datos
    await pool.query("DELETE FROM novedades WHERE idNovedad = ?", [idNovedad]);

    // Redirigir después de eliminar
    res.redirect("/novedades");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
