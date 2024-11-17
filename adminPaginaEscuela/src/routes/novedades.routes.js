import { Router } from "express";
import pool from "../database.js";

const router = Router();

router.get("/add-novedad", (req, res) => {
  res.render("novedades/add-novedad");
});

router.post("/add-novedad", async (req, res) => {
  try {
    const { novedad, descripcion, descripcionLarga } = req.body;
    const newNovedad = {
      novedad,
      descripcion,
      descripcionLarga,
    };
    await pool.query("INSERT INTO novedades SET ?", [newNovedad]);
    res.redirect("/novedades");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/novedades", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM novedades");
    res.render("novedades/novedades", { novedades: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/edit-novedad/:idNovedad", async (req, res) => {
  try {
    const { idNovedad } = req.params;
    const [novedad] = await pool.query(
      "SELECT * FROM novedades WHERE idNovedad = ?",
      [idNovedad]
    );
    const novedadEdit = novedad[0];
    res.render("novedades/edit-novedad", { novedad: novedadEdit });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/edit-novedad/:idNovedad", async (req, res) => {
  try {
    const { novedad, descripcion, descripcionLarga } = req.body;
    const { idNovedad } = req.params;
    const editNovedad = { novedad, descripcion, descripcionLarga };
    await pool.query("UPDATE Novedades SET ? WHERE idNovedad = ?", [
      editNovedad,
      idNovedad,
    ]);
    res.redirect("/novedades");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/delete-novedad/:idNovedad", async (req, res) => {
  try {
    const { idNovedad } = req.params;
    await pool.query("DELETE FROM Novedades WHERE idNovedad = ?", [idNovedad]);
    res.redirect("/novedades");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
