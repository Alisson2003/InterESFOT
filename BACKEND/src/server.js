// Requerir los módulos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routerAdministrador from './routers/administrador_routes.js';
//Director
import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"
import routerEstudiante from './routers/estudiante_routes.js';

// Importar las rutas de deportes
import routerDeportes from './routers/deportes_routes.js';

//Login con Google
import session from 'express-session';
import passport from 'passport';
import './src/config/passport.js';
import authRoutes from './routers/authRoutes.js';

dotenv.config();

// Configurar sesiones
app.use(session({
    secret: 'claveSuperSecreta123', // cambia esto por una clave segura
    resave: false,
    saveUninitialized: true
}));

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Inicializaciones
const app = express();

//module.exports = app;

// Configuraciones 
app.use(cors()); // Permitir solicitudes desde cualquier origen

// Middlewares 
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Para poder recibir datos en formato JSON y URL-encoded

// Configuración del puerto
app.set('port', process.env.PORT || 3000);

// Inicializaciones
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads',
    limits: { fileSize: 10 * 1024 * 1024 }, // hasta 10MB
}))

// Variables globales

// Rutas para administradores
app.use('/api', routerAdministrador);

// Rutas para Director
app.use('/api',routerEstudiante);

// Rutas para deportes
app.use('/api',routerDeportes);

app.use('/auth', authRoutes);

// Rutas 
app.get('/', (req, res) => {
    res.send("Server on");
});


// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));


// Exportar la instancia de express por medio de app
export default app;