import {Router} from 'express'
import { eliminarDeporte, pagarDeporte, registrarDeporte } from '../controllers/deportes_controller.js'
import { verificarTokenJWT } from '../middlewares/JWT.js'
const router = Router()


router.post('/deportes/registro',verificarTokenJWT,registrarDeporte)

router.delete('/deportes/:id',verificarTokenJWT,eliminarDeporte)

router.post('/deportes/pago',verificarTokenJWT,pagarDeporte)

export default router