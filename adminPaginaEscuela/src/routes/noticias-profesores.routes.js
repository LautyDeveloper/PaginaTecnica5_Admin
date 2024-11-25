import { Router } from "express";
import pool from "../database.js";

const router = Router();

// Mostrar noticias de profesores
router.get("/noticias-profesores", async (req, res) => {
  try {
    const [noticiasProfes] = await pool.query(
      "SELECT * FROM noticiasProfesores"
    );
    res.render("noticias-profesores/noticias-profesores", { noticiasProfes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Renderizar formulario para agregar una noticia
router.get("/add-noticia-profesor", (req, res) =>
  res.render("noticias-profesores/add-noticia-profesor")
);

// Añadir una nueva noticia de profesor
router.post("/add-noticia-profesor", async (req, res) => {
  try {
    await pool.query("INSERT INTO noticiasProfesores SET ?", [req.body]);
    res.redirect("/noticias-profesores");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Editar una noticia de profesor
router.get("/edit-noticia-profe/:idNoticiaProfe", async (req, res) => {
  try {
    const { idNoticiaProfe } = req.params;
    const [noticia] = await pool.query(
      "SELECT * FROM noticiasProfesores WHERE idNoticiaProfe = ?",
      [idNoticiaProfe]
    );
    res.render("noticias-profesores/edit-noticia-profe", {
      noticiasProfes: noticia[0],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Actualizar una noticia de profesor
router.post("/edit-noticia-profe/:idNoticiaProfe", async (req, res) => {
  try {
    const { idNoticiaProfe } = req.params;
    await pool.query(
      "UPDATE noticiasProfesores SET ? WHERE idNoticiaProfe = ?",
      [req.body, idNoticiaProfe]
    );
    res.redirect("/noticias-profesores");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Eliminar una noticia de profesor
router.get("/delete-noticia-profe/:idNoticiaProfe", async (req, res) => {
  try {
    const { idNoticiaProfe } = req.params;
    await pool.query(
      "DELETE FROM noticiasProfesores WHERE idNoticiaProfe = ?",
      [idNoticiaProfe]
    );
    res.redirect("/noticias-profesores");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
