// Requerir los módulos
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routerAdministrador from './routers/administrador_routes.js';




// Inicializaciones
const app = express()
dotenv.config()
module.exports = app;

// Configuraciones 
app.set('port',process.env.port || 3000);
app.use(cors())

// Middlewares 
app.use(express.json())


// Variables globales


// Rutas 
app.get('/',(req,res)=>{
    res.send("Server on")
})

// Rutas para administradores
app.use('/api',routerAdministrador)
// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Exportar la instancia de express por medio de app
export default app;