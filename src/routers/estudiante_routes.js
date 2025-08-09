import {Router} from 'express'
import { perfilEstudiante, loginEstudiante, eliminarEstudiante, detalleEstudiante, listarEstudiantes, registrarEstudiante, actualizarEstudiante } from '../controllers/estudiante_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()

router.post('/estudiante/login',loginEstudiante)


router.get('/estudiante/perfil',verificarTokenJWT,perfilEstudiante)


router.post("/estudiante/registro",verificarTokenJWT, registrarEstudiante)

router.get("/estudiante",verificarTokenJWT,listarEstudiantes)

router.get("/estudiante/:id",verificarTokenJWT, detalleEstudiante)

router.delete("/estudiante/eliminar/:id", verificarTokenJWT,eliminarEstudiante)

router.put("/estudiante/actualizar/:id", verificarTokenJWT,actualizarEstudiante)


export default router