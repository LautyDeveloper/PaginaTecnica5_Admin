-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-10-2024 a las 15:57:02
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `admin01`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `noticiasprofesores`
--

CREATE TABLE `noticiasprofesores` (
  `idNoticiaProfe` int(11) NOT NULL,
  `nombreNoticiaProfe` varchar(50) NOT NULL,
  `descripcionNoticiaProfe` varchar(50) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `noticiasprofesores`
--

INSERT INTO `noticiasprofesores` (`idNoticiaProfe`, `nombreNoticiaProfe`, `descripcionNoticiaProfe`, `fecha`) VALUES
(1, 'Hola Soy una Maldita noticia', 'QUe onda bro me editaron =(', '2024-10-03 15:55:18');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `novedades`
--

CREATE TABLE `novedades` (
  `id` int(11) NOT NULL,
  `novedad` varchar(50) NOT NULL,
  `descripcion` varchar(50) NOT NULL,
  `fecha` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `novedades`
--

INSERT INTO `novedades` (`id`, `novedad`, `descripcion`, `fecha`) VALUES
(1, 'Hola Soy una novedad', 'Que onda gato me editaron', '2024-10-03 16:07:45');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `proyectos`
--

CREATE TABLE `proyectos` (
  `idProyecto` int(11) NOT NULL,
  `proyectoNombre` varchar(255) NOT NULL,
  `descripcionProyecto` text NOT NULL,
  `carrera` varchar(255) NOT NULL,
  `imagenUrl` varchar(255) DEFAULT NULL,
  `archivoUrl` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `proyectos`
--

INSERT INTO `proyectos` (`idProyecto`, `proyectoNombre`, `descripcionProyecto`, `carrera`, `imagenUrl`, `archivoUrl`) VALUES
(1, 'Araña', 'Es una araña', '6to 2da', 'urlpredefinida', ''),
(2, 'Tateti', 'Es un tateti', '7mo 2da', 'urlpredefinida', ''),
(3, 'Robot Bailarin', 'Es un robot q baila Editado', '7mo 2da', 'urlpredefinida', ''),
(5, 'Prueba', 'asdasdasdasdasd te edite', 'dasasdasdasd', NULL, '1728049569124.pdf'),
(6, 'Hola Bruno', 'Estoy subiendo un archivo re facherito', 'Puto cagon', NULL, '1728049854864.pdf');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `noticiasprofesores`
--
ALTER TABLE `noticiasprofesores`
  ADD PRIMARY KEY (`idNoticiaProfe`);

--
-- Indices de la tabla `novedades`
--
ALTER TABLE `novedades`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  ADD PRIMARY KEY (`idProyecto`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `noticiasprofesores`
--
ALTER TABLE `noticiasprofesores`
  MODIFY `idNoticiaProfe` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de la tabla `novedades`
--
ALTER TABLE `novedades`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `proyectos`
--
ALTER TABLE `proyectos`
  MODIFY `idProyecto` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
