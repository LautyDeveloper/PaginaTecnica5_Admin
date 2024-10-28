CREATE DATABASE admin01;

USE admin01;

CREATE TABLE Novedades (
    id INT AUTO_INCREMENT PRIMARY KEY,
    novedad VARCHAR(50) NOT NULL,
    descripcion VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Proyectos (
    idProyecto INT AUTO_INCREMENT PRIMARY KEY,
    proyectoNombre VARCHAR(50) NOT NULL,
    descripcionProyecto VARCHAR(50) NOT NULL,
    imagenUrl VARCHAR(255) NOT NULL
);

CREATE TABLE proyectos (
    idProyecto INT AUTO_INCREMENT PRIMARY KEY,
    proyectoNombre VARCHAR(255) NOT NULL,
    descripcionProyecto TEXT NOT NULL,
    carrera VARCHAR(255) NOT NULL,
    imagenUrl VARCHAR(255)
);

CREATE TABLE noticiasProfesores (
    idNoticiaProfe INT AUTO_INCREMENT PRIMARY KEY,
    nombreNoticiaProfe VARCHAR(50) NOT NULL,
    descripcionNoticiaProfe VARCHAR(50) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


SELECT * FROM Novedades;


