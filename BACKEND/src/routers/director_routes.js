import {Router} from 'express'
import { listarDirectores, registrarDirector } from '../controllers/director_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()

router.post("/director/registro",verificarTokenJWT, registrarDirector)

router.get("/director",verificarTokenJWT,listarDirectores)



export default router