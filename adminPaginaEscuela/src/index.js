import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import path from "path";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import novedadesRoutes from "./routes/novedades.routes.js";
import proyectosRoutes from "./routes/proyectos.routes.js";
import noticiasProfesoresRoutes from "./routes/noticias-profesores.routes.js";
import equipoDirectivo from "./routes/equipo-directivo.routes.js";
import session from "express-session";
import authRoutes from "./routes/auth.routes.js";

//Inicializacion
const app = express();
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(join(__dirname, "public")));

//Configuraciones
app.set("port", process.env.PORT || 3005);
app.set("views", join(__dirname, "views"));
app.engine(
  ".hbs",
  engine({
    defaultLayout: "main",
    layoutDir: join(app.get("views"), "layouts"),
    partialsDir: join(app.get("views"), "partials"),
    extname: ".hbs",
  })
);

app.set("view engine", ".hbs");

//Middlewares
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Configurar sesión
app.use(
  session({
    secret: "mi_secreto", // Cambia esto por algo más seguro
    resave: false,
    saveUninitialized: false,
  })
);

app.use((req, res, next) => {
  if (!req.session.admin && req.path !== "/login" && req.path !== "/logout") {
    return res.redirect("/login");
  }
  next();
});

app.use((req, res, next) => {
  res.locals.username = req.session.username || null; // Si no hay sesión, será null
  next();
});

//Routes

app.use(novedadesRoutes);
app.use(proyectosRoutes);
app.use(noticiasProfesoresRoutes);
app.use(equipoDirectivo);
app.use(authRoutes);

app.get("/", (req, res) => {
  res.render("index", { username: req.session.username });
});

//Public files
//Run Server
app.listen(app.get("port"), () =>
  console.log("Server listening on the port", app.get("port"))
);
