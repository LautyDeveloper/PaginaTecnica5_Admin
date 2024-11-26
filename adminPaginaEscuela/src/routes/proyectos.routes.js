import { Router } from "express";
import pool from "../database.js";
import multer from "multer";
import path from "path";

const router = Router();

// Configuración de multer para manejar la subida de archivos
const storage = multer.memoryStorage(); // Almacena los archivos en memoria, en lugar de en el disco
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de tamaño (5MB)
  fileFilter: (req, file, cb) => {
    // Solo permitimos archivos PDF y DOCX
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true); // Si el archivo es válido, continuamos
    } else {
      return cb(new Error("Solo se permiten archivos .pdf, .doc, .docx"));
    }
  },
});

// Validación de los datos del proyecto
function validateProyecto(data, file) {
  const { proyectoNombre, descripcionProyecto, srcVideo } = data;

  // Validación del nombre del proyecto
  if (proyectoNombre.length < 5 || proyectoNombre.length > 50) {
    return "El nombre del proyecto debe tener entre 5 y 50 caracteres.";
  }
  if (!/^[a-zA-Z\s]+$/.test(proyectoNombre)) {
    return "El nombre del proyecto solo puede contener letras y espacios.";
  }

  // Validación de la descripción
  if (descripcionProyecto.length < 10 || descripcionProyecto.length > 255) {
    return "La descripción debe tener entre 10 y 255 caracteres.";
  }

  // Validación del enlace del video
  if (srcVideo && !/^https:\/\/(www\.)?youtube\.com\/.*$/.test(srcVideo)) {
    return "El enlace del video debe ser un enlace válido de YouTube.";
  }

  // Validación del archivo
  if (file) {
    const fileExtension = file.originalname.split(".").pop();
    if (!["docx", "pdf"].includes(fileExtension)) {
      return "Solo se permiten archivos .docx y .pdf.";
    }
  }

  return null; // Todo está bien si no se devuelve ningún error
}

// Ruta para obtener todos los proyectos
router.get("/proyectos", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM proyectos");
    res.render("proyectos/proyectos", { proyectos: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para mostrar el formulario de creación de un nuevo proyecto
router.get("/add-proyecto", (req, res) => {
  res.render("proyectos/add-proyecto");
});

// Ruta para manejar la creación de un proyecto
router.post("/add-proyecto", upload.single("archivoUrl"), async (req, res) => {
  try {
    const { proyectoNombre, descripcionProyecto, carrera, cursos, srcVideo } =
      req.body;
    const archivo = req.file; // Obtener el archivo subido

    // Validación de los datos y el archivo
    const validationError = validateProyecto(req.body, archivo);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    // Si las validaciones son correctas, guardamos el proyecto
    const nombreArchivo = archivo ? archivo.originalname : null;
    const newProyecto = {
      proyectoNombre,
      descripcionProyecto,
      carrera,
      cursos,
      archivo: archivo ? archivo.buffer : null,
      nombreArchivo,
      srcVideo,
    };

    await pool.query("INSERT INTO proyectos SET ?", [newProyecto]);
    res.redirect("/proyectos"); // Redirige a la lista de proyectos
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para obtener y mostrar el formulario de edición de un proyecto
router.get("/edit-proyecto/:idProyecto", async (req, res) => {
  try {
    const { idProyecto } = req.params;
    const [proyecto] = await pool.query(
      "SELECT * FROM proyectos WHERE idProyecto = ?",
      [idProyecto]
    );

    if (proyecto.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.render("proyectos/edit-proyecto", { proyecto: proyecto[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para manejar la edición de un proyecto
router.post(
  "/edit-proyecto/:idProyecto",
  upload.single("archivoUrl"),
  async (req, res) => {
    try {
      const { proyectoNombre, descripcionProyecto, carrera, cursos, srcVideo } =
        req.body;
      const { idProyecto } = req.params;
      const archivo = req.file; // Archivo subido

      // Validación de datos
      const validationError = validateProyecto(req.body, archivo);
      if (validationError) {
        return res.status(400).json({ message: validationError });
      }

      // Obtener el proyecto actual para mantener el archivo antiguo si no se sube uno nuevo
      const [proyectoActual] = await pool.query(
        "SELECT archivo, nombreArchivo FROM proyectos WHERE idProyecto = ?",
        [idProyecto]
      );

      const archivoBuffer = archivo
        ? archivo.buffer
        : proyectoActual[0].archivo;
      const nombreArchivo = archivo
        ? archivo.originalname
        : proyectoActual[0].nombreArchivo;

      const editProyecto = {
        proyectoNombre,
        descripcionProyecto,
        carrera,
        cursos,
        archivo: archivoBuffer,
        nombreArchivo,
        srcVideo,
      };

      // Actualizamos el proyecto en la base de datos
      await pool.query("UPDATE proyectos SET ? WHERE idProyecto = ?", [
        editProyecto,
        idProyecto,
      ]);

      res.redirect("/proyectos"); // Redirige a la lista de proyectos
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// Ruta para descargar un archivo de proyecto
router.get("/descargar-archivo/:idProyecto", async (req, res) => {
  try {
    const { idProyecto } = req.params;
    const [proyecto] = await pool.query(
      "SELECT archivo, nombreArchivo FROM proyectos WHERE idProyecto = ?",
      [idProyecto]
    );

    if (proyecto.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const archivoBinario = proyecto[0].archivo;
    const nombreArchivo = proyecto[0].nombreArchivo;

    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${nombreArchivo}"`
    );
    res.send(archivoBinario); // Envía el archivo como respuesta
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para eliminar un proyecto
router.get("/delete-proyecto/:idProyecto", async (req, res) => {
  try {
    const { idProyecto } = req.params;
    await pool.query("DELETE FROM proyectos WHERE idProyecto = ?", [
      idProyecto,
    ]);
    res.redirect("/proyectos"); // Redirige a la lista de proyectos después de eliminar
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
