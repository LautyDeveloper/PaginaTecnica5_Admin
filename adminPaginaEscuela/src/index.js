import express from "express";
import morgan from "morgan";
import { engine } from "express-handlebars";
import { join, dirname, extname } from "path";
import { fileURLToPath } from "url";
import novedadesRoutes from "./routes/novedades.routes.js";
import proyectosRoutes from "./routes/proyectos.routes.js";
import noticiasProfesoresRoutes from "./routes/noticias-profesores.routes.js";

//Inicializacion
const app = express();
app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));
const __dirname = dirname(fileURLToPath(import.meta.url));

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

//Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.use(novedadesRoutes);
app.use(proyectosRoutes);
app.use(noticiasProfesoresRoutes);

//Public files
app.use(express.static(join(__dirname, "public")));

//Run Server

app.listen(app.get("port"), () =>
  console.log("Server listening on the port", app.get("port"))
);
