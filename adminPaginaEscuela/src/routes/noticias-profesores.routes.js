import { Router } from "express";
import pool from "../database.js";

const router = Router();

// Mostrar todas las noticias de profesores
router.get("/noticias-profesores", async (req, res) => {
  try {
    // Obtener todas las noticias de la base de datos
    const [noticiasProfes] = await pool.query(
      "SELECT * FROM noticiasProfesores"
    );
    res.render("noticias-profesores/noticias-profesores", { noticiasProfes });
  } catch (err) {
    // Si hay un error, responder con el mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Renderizar formulario para agregar una noticia
router.get("/add-noticia-profesor", (req, res) => {
  res.render("noticias-profesores/add-noticia-profesor");
});

// Función de validación para los datos de la noticia
const validateNoticia = ({ nombreNoticiaProfe, descripcionNoticiaProfe }) => {
  // Validación para el nombre de la noticia
  if (
    !nombreNoticiaProfe ||
    nombreNoticiaProfe.length < 5 ||
    nombreNoticiaProfe.length > 50 ||
    !/^[a-zA-Z\s]+$/.test(nombreNoticiaProfe)
  ) {
    return "El nombre de la noticia debe tener entre 5 y 50 caracteres y solo puede contener letras y espacios.";
  }

  // Validación para la descripción de la noticia
  if (
    !descripcionNoticiaProfe ||
    descripcionNoticiaProfe.length < 20 ||
    descripcionNoticiaProfe.length > 200
  ) {
    return "La descripción debe tener entre 20 y 200 caracteres.";
  }

  // Si todo es válido, no hay error
  return null;
};

// Ruta para agregar una noticia
router.post("/add-noticia-profesor", async (req, res) => {
  try {
    // Validar los datos del formulario
    const error = validateNoticia(req.body);
    if (error) {
      // Si hay error, devolver respuesta con el mensaje de error
      return res.status(400).json({ message: error });
    }

    // Si los datos son válidos, insertar la noticia en la base de datos
    await pool.query("INSERT INTO noticiasProfesores SET ?", [req.body]);
    // Redirigir a la lista de noticias
    res.redirect("/noticias-profesores");
  } catch (err) {
    // Si hay un error, responder con el mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Renderizar el formulario de edición de una noticia
router.get("/edit-noticia-profe/:idNoticiaProfe", async (req, res) => {
  try {
    const { idNoticiaProfe } = req.params;
    // Obtener la noticia que se va a editar
    const [noticia] = await pool.query(
      "SELECT * FROM noticiasProfesores WHERE idNoticiaProfe = ?",
      [idNoticiaProfe]
    );
    // Renderizar la vista de edición con los datos de la noticia
    res.render("noticias-profesores/edit-noticia-profe", {
      noticiasProfes: noticia[0],
    });
  } catch (err) {
    // Si hay un error, responder con el mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Actualizar una noticia
router.post("/edit-noticia-profe/:idNoticiaProfe", async (req, res) => {
  try {
    const { idNoticiaProfe } = req.params;
    const { nombreNoticiaProfe, descripcionNoticiaProfe } = req.body;

    // Validar los datos antes de actualizar
    const error = validateNoticia({
      nombreNoticiaProfe,
      descripcionNoticiaProfe,
    });
    if (error) {
      return res.status(400).json({ message: error });
    }

    // Si los datos son válidos, actualizar la noticia en la base de datos
    await pool.query(
      "UPDATE noticiasProfesores SET ? WHERE idNoticiaProfe = ?",
      [req.body, idNoticiaProfe]
    );
    // Redirigir a la lista de noticias
    res.redirect("/noticias-profesores");
  } catch (err) {
    // Si hay un error, responder con el mensaje de error
    res.status(500).json({ message: err.message });
  }
});

// Eliminar una noticia
router.get("/delete-noticia-profe/:idNoticiaProfe", async (req, res) => {
  try {
    const { idNoticiaProfe } = req.params;
    // Eliminar la noticia de la base de datos
    await pool.query(
      "DELETE FROM noticiasProfesores WHERE idNoticiaProfe = ?",
      [idNoticiaProfe]
    );
    // Redirigir a la lista de noticias
    res.redirect("/noticias-profesores");
  } catch (err) {
    // Si hay un error, responder con el mensaje de error
    res.status(500).json({ message: err.message });
  }
});

export default router;
