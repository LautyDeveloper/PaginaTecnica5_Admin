import { Router } from "express";
import pool from "../database.js";

const router = Router();

// Mostrar equipo directivo
router.get("/equipo-directivo", async (req, res) => {
  try {
    const [equipoDirectivo] = await pool.query("SELECT * FROM equipodirectivo");
    res.render("equipo-directivo/equipo-directivo", { equipoDirectivo });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Renderizar formulario para añadir un miembro
router.get("/add-equipo-directivo", (req, res) =>
  res.render("equipo-directivo/add-equipo-directivo")
);

// Añadir miembro al equipo directivo
router.post("/add-equipo-directivo", async (req, res) => {
  try {
    await pool.query("INSERT INTO equipodirectivo SET ?", [req.body]);
    res.redirect("/equipo-directivo");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Renderizar formulario para editar un miembro
router.get("/edit-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { idDirectivo } = req.params;
    const [equipoDirectivo] = await pool.query(
      "SELECT * FROM equipodirectivo WHERE idDirectivo = ?",
      [idDirectivo]
    );
    res.render("equipo-directivo/edit-equipo-directivo", {
      equipoDirectivo: equipoDirectivo[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Editar un miembro del equipo directivo
router.post("/edit-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { idDirectivo } = req.params;
    await pool.query("UPDATE equipodirectivo SET ? WHERE idDirectivo = ?", [
      req.body,
      idDirectivo,
    ]);
    res.redirect("/equipo-directivo");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar un miembro del equipo directivo
router.get("/delete-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { idDirectivo } = req.params;
    await pool.query("DELETE FROM equipodirectivo WHERE idDirectivo = ?", [
      idDirectivo,
    ]);
    res.redirect("/equipo-directivo");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
