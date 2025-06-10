import app from './server.js'
import connection from './database.js';

// Conectar a la base de datos
connection()

app.listen(app.get('port'),()=>{
    console.log(`Server ok on http://localhost:${app.get('port')}`);
});

