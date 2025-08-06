import {Router} from 'express'
import { eliminarDeporte, registrarDeporte } from '../controllers/deportes_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()


router.post('/deportes/registro',verificarTokenJWT,registrarDeporte)

router.delete('/deportes/:id',verificarTokenJWT,eliminarDeporte)

export default router