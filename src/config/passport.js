import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Usuario from '../models/Usuario.js'; // Asegúrate que existe

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await Usuario.findOne({ googleId: profile.id });

        if (!user) {
        user = new Usuario({
            nombre: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id
        });
        await user.save();
        }

        return done(null, user);
    } catch (error) {
        return done(error, null);
    }
    }));

    passport.serializeUser((user, done) => {
    done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
    const user = await Usuario.findById(id);
    done(null, user);
});
