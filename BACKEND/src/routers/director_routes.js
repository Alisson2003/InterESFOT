import {Router} from 'express'
import { loginDirector, eliminarDirector, detalleDirector, listarDirectores, registrarDirector, actualizarDirector } from '../controllers/director_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()

router.post('/director/login',loginDirector)

router.post("/director/registro",verificarTokenJWT, registrarDirector)

router.get("/director",verificarTokenJWT,listarDirectores)

router.get("/director/:id",verificarTokenJWT, detalleDirector)

router.delete("/director/eliminar/:id", verificarTokenJWT,eliminarDirector)

router.put("/director/actualizar/:id", verificarTokenJWT,actualizarDirector)


export default router