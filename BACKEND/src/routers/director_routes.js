import {Router} from 'express'
import { eliminarDirector, detalleDirector, listarDirectores, registrarDirector } from '../controllers/director_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()

router.post("/director/registro",verificarTokenJWT, registrarDirector)

router.get("/director",verificarTokenJWT,listarDirectores)

router.get("/director/:id",verificarTokenJWT, detalleDirector)

router.delete("/director/eliminar/:id", verificarTokenJWT,eliminarDirector)


export default router