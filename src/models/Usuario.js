const usuarioSchema = new Schema({
    nombre: String,
    email: String,
    googleId: {
        type: String,
        unique: true
    }
});
