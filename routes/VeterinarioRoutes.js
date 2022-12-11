import express from 'express';
import {
         perfil, 
         registrar,
         confirmar,
         autenticar, 
         olvidePassword, 
         comprobarToken, 
         nuevoPassword,
         actualizarPerfil,
         actualizarPassword
       } from '../controllers/VeterinarioController.js';
import checkAuth from '../middleware/authMiddleware.js';



const router = express.Router();
// Area publica
router.post('/',registrar);
router.get('/confirmar/:token',confirmar);
router.post('/login/',autenticar);
router.post('/olvide-password/',olvidePassword);

/* router.get('/olvide-password/:token',comprobarToken);
router.post('/olvide-password/:token',nuevoPassword);  estas dos lineas se reducen con el chainig de la siguiente linea*/

router.route('/olvide-password/:token').get(comprobarToken).post(nuevoPassword);

//  Area privada
// para proterger siertas paginas se tienen que crear un custon midelWERE
router.get('/perfil', checkAuth, perfil);
router.put('/perfil/:id', checkAuth, actualizarPerfil);
router.put('/actualizar-password', checkAuth, actualizarPassword);

export default router;
