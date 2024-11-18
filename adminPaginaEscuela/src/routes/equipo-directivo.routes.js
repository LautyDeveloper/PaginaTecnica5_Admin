import { Router } from "express";
import pool from "../database.js";

const router = Router();

router.get("/equipo-directivo", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM equipodirectivo");
    res.render("equipo-directivo/equipo-directivo", {
      equipoDirectivo: result,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/add-equipo-directivo", async (req, res) => {
  res.render("equipo-directivo/add-equipo-directivo");
});

router.post("/add-equipo-directivo", async (req, res) => {
  try {
    const { Nombre, Apellido, Cargo } = req.body;
    const newEquipoDirectivo = { Nombre, Apellido, Cargo };
    await pool.query("INSERT INTO equipodirectivo SET ?", [newEquipoDirectivo]);
    res.redirect("/equipo-directivo");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/edit-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { idDirectivo } = req.params;
    const [equipoDirectivo] = await pool.query(
      "SELECT * FROM equipodirectivo WHERE idDirectivo = ?",
      [idDirectivo]
    );
    const equipoDirectivoEdit = equipoDirectivo[0];
    res.render("equipo-directivo/edit-equipo-directivo", {
      equipoDirectivo: equipoDirectivoEdit,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/edit-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { Nombre, Apellido, Cargo } = req.body;
    const { idDirectivo } = req.params;
    const equipoDirectivoEdit = {
      Nombre,
      Apellido,
      Cargo,
    };
    await pool.query("UPDATE equipodirectivo SET ? WHERE idNoticiaProfe = ?", [
      equipoDirectivoEdit,
      idDirectivo,
    ]);
    res.redirect("/equipo-directivo");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/delete-equipo-directivo/:idDirectivo", async (req, res) => {
  try {
    const { idDirectivo } = req.params;
    await pool.query(
      "DELETE FROM noticiasProfesores WHERE idNoticiaProfe = ?",
      [idDirectivo]
    );
    res.redirect("/equipo-directivo");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
