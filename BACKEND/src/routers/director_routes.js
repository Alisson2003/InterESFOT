import {Router} from 'express'
import { registrarDirector } from '../controllers/director_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()

router.post("/director/registro",verificarTokenJWT, registrarDirector)



export default router