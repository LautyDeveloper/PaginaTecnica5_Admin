import { Router } from "express";
import pool from "../database.js";
import multer from "multer";
import path from "path";
import fs from "fs"; // Importar FileSystem para leer archivos

const router = Router();

// Configuración de multer para recibir archivos
const storage = multer.memoryStorage(); // Usar memoria en lugar del sistema de archivos
const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // Limite de tamaño (5MB)
  fileFilter: (req, file, cb) => {
    const filetypes = /pdf|doc|docx/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Solo se permiten archivos .pdf, .doc, .docx"));
    }
  },
});

router.get("/proyectos", async (req, res) => {
  try {
    const [result] = await pool.query("SELECT * FROM proyectos");
    res.render("proyectos/proyectos", { proyectos: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/add-proyecto", (req, res) => {
  res.render("proyectos/add-proyecto");
});

// Ruta para agregar un nuevo proyecto
router.post("/add-proyecto", upload.single("archivoUrl"), async (req, res) => {
  try {
    const { proyectoNombre, descripcionProyecto, carrera, cursos, srcVideo } =
      req.body;
    const archivo = req.file.buffer; // Datos binarios del archivo
    const nombreArchivo = req.file.originalname; // Nombre original del archivo

    const newProyecto = {
      proyectoNombre,
      descripcionProyecto,
      carrera,
      cursos,
      archivo, // Guardamos el archivo en formato binario
      nombreArchivo, // Guardamos el nombre original del archivo
      srcVideo,
    };

    await pool.query("INSERT INTO proyectos SET ?", [newProyecto]);
    res.redirect("/proyectos");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post(
  "/edit-proyecto/:idProyecto",
  upload.single("archivoUrl"),
  async (req, res) => {
    try {
      const { proyectoNombre, descripcionProyecto, carrera, cursos, srcVideo } =
        req.body;
      const { idProyecto } = req.params;

      const [proyectoActual] = await pool.query(
        "SELECT archivo, nombreArchivo FROM proyectos WHERE idProyecto = ?",
        [idProyecto]
      );

      // Si hay un nuevo archivo, usarlo; si no, mantener el archivo anterior
      const archivo = req.file ? req.file.buffer : proyectoActual[0].archivo;
      const nombreArchivo = req.file
        ? req.file.originalname
        : proyectoActual[0].nombreArchivo;

      const editProyecto = {
        proyectoNombre,
        descripcionProyecto,
        carrera,
        cursos,
        archivo,
        nombreArchivo,
        srcVideo,
      };

      await pool.query("UPDATE proyectos SET ? WHERE idProyecto = ?", [
        editProyecto,
        idProyecto,
      ]);

      res.redirect("/proyectos");
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

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
    res.send(archivoBinario);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Ruta para mostrar el formulario de edición de un proyecto
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

router.get("/delete-proyecto/:idProyecto", async (req, res) => {
  try {
    const { idProyecto } = req.params;
    await pool.query("DELETE FROM proyectos WHERE idProyecto = ?", [
      idProyecto,
    ]);
    res.redirect("/proyectos");
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
