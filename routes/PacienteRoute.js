import express from "express";
import {
  actualizarPaciente,
  agregarPaciente,
  eliminarPaciente,
  obtenerPaciente,
  obtenerPacientes,
} from "../controllers/PacienteController.js";

import checkAuth from "../middleware/authMiddleware.js";
const router = express.Router();

router
  .route("/")
  .post(
    checkAuth,
    agregarPaciente
  ) /* aqui estamos haciendo el C,R,U,D QUE ES CREAR, LEER, ACTUALIZAR Y ELIMINAR  en esta parte lo estamos creando */
  .get(
    checkAuth,
    obtenerPacientes
  ); /* aqui lo estamos leyendo y esta verificando que este autenticado con checkAuth */

router
  .route("/:id")
  .get(checkAuth, obtenerPaciente)
  .put(checkAuth, actualizarPaciente)
  .delete(checkAuth, eliminarPaciente);

export default router;
