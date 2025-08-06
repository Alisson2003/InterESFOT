import express from 'express';
import passport from 'passport';
import { loginSuccess, loginFailed } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
    }));

    router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failed'
    }),
    (req, res) => {
        // Redireccionar o mostrar algo en el navegador después del login
        res.redirect('/auth/success');
    }
);

router.get('/success', loginSuccess);
router.get('/failed', loginFailed);

export default router;

