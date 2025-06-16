import app from './server.js'
import connection from './database.js';

// Conectar a la base de datos
connection()

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});

