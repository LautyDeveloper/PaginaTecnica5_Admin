import { Router } from "express";
import bcrypt from "bcrypt";
import pool from "../database.js";

const router = Router();

// Mostrar formulario de login
router.get("/login", (req, res) => {
  res.render("auth/login", { error: null });
});

// Procesar login
router.post("/login", async (req, res) => {
  const { username, password } = req.body; // Captura los datos del formulario

  try {
    // Busca al usuario por nombre de usuario
    const [user] = await pool.query("SELECT * FROM admin WHERE username = ?", [
      username,
    ]);

    // Si no se encuentra el usuario
    if (user.length === 0) {
      return res.render("login", { error: "Usuario no encontrado" });
    }

    // Verifica que la contraseña coincida (sin cifrado)
    if (user[0].password !== password) {
      return res.render("login", { error: "Contraseña incorrecta" });
    }

    // Si todo es correcto, inicia la sesión
    req.session.admin = true;
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error del servidor");
  }
});

// Logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error al cerrar sesión:", err);
      return res.status(500).send("Error al cerrar sesión");
    }
    res.redirect("/login");
  });
});

export default router;
