import {Router} from 'express'
import { comprobarTokenPasword, confirmarMail, crearNuevoPassword, recuperarPassword, registro }  from '../controllers/director_controller.js'

const router = Router()

router.post('/registro',registro)
router.get('/confirm/:token',confirmarMail)

router.post('/recuperarpassword',recuperarPassword)
router.get('/recuperarpassword/:token',comprobarTokenPasword)
router.post('/nuevopassword/:token',crearNuevoPassword)

export default router