import { Router } from "express";
import pool from "../database.js";
import multerConfig from "./multer-config.js"; // Ruta donde creaste la configuración

const router = Router();

// Renderizar el formulario para añadir una novedad
router.get("/add-novedad", (req, res) => {
  res.render("novedades/add-novedad");
});

// Añadir una nueva novedad
router.post("/add-novedad", multerConfig.single("imagen"), async (req, res) => {
  try {
    const { novedad, descripcion, descripcionLarga } = req.body;
    const imagenUrl = req.file ? `/uploads/${req.file.filename}` : null; // Validar si hay una imagen subida

    const newNovedad = { novedad, descripcion, descripcionLarga, imagenUrl };
    await pool.query("INSERT INTO novedades SET ?", [newNovedad]);
    res.redirect("/novedades");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mostrar todas las novedades
router.get("/novedades", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM novedades");
    res.render("novedades/novedades", { novedades: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Editar una novedad
router.get("/edit-novedad/:idNovedad", async (req, res) => {
  try {
    const { idNovedad } = req.params;
    const [novedad] = await pool.query(
      "SELECT * FROM novedades WHERE idNovedad = ?",
      [idNovedad]
    );
    res.render("novedades/edit-novedad", { novedad: novedad[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar una novedad
router.post(
  "/edit-novedad/:idNovedad",
  multerConfig.single("imagen"),
  async (req, res) => {
    try {
      const { novedad, imagenActual, descripcion, descripcionLarga } = req.body;
      const { idNovedad } = req.params;
      const imagenUrl = req.file
        ? `/uploads/${req.file.filename}`
        : imagenActual;

      const editNovedad = { novedad, descripcion, descripcionLarga, imagenUrl };
      await pool.query("UPDATE novedades SET ? WHERE idNovedad = ?", [
        editNovedad,
        idNovedad,
      ]);
      res.redirect("/novedades");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Eliminar una novedad
router.get("/delete-novedad/:idNovedad", async (req, res) => {
  try {
    const { idNovedad } = req.params;
    await pool.query("DELETE FROM novedades WHERE idNovedad = ?", [idNovedad]);
    res.redirect("/novedades");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
