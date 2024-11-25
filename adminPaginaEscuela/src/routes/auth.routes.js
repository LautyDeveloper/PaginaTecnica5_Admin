import { Router } from "express";
import pool from "../database.js";

const router = Router();

// Mostrar formulario de login
router.get("/login", (req, res) => res.render("auth/login", { error: null }));

// Procesar login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [user] = await pool.query("SELECT * FROM admin WHERE username = ?", [
      username,
    ]);

    if (user.length === 0 || user[0].password !== password) {
      return res.render("login", { error: "Usuario o contraseña incorrectos" });
    }

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
    if (err) return res.status(500).send("Error al cerrar sesión");
    res.redirect("/login");
  });
});

export default router;
