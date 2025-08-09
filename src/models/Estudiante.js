import mongoose, { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const estudianteSchema = new Schema({
    nombreEstudiante: {
        type: String,
        required: true,
        trim: true
    },
    apellidoEstudiante: {
        type: String,
        required: true,
        trim: true
    },
    celularEstudiante: {
        type: String,
        trim: true,
        default: null
    },
    emailEstudiante: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    passwordEstudiante: {
        type: String,
        required: true
    },
    carreraEstudiante: {
        type: String,
        required: true,
        trim: true
    },
    avatarCarrera: {
        type: String,
        trim: true
    },
    avatarCarreraID: {
        type: String,
        trim: true
    },
    periodoEstudiante: {
        type: String,
        required: true,
        trim: true
    },
    estadoEstudiante: {
        type: Boolean,
        default: true
    },
    rol: {
        type: String,
        default: "estudiante"
    },
    administrador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Administrador',
    },
    deportes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deporte'
    }]
}, {
    timestamps: true
});

estudianteSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

// Método para verificar si el password ingresado es el mismo de la BDD
estudianteSchema.methods.matchPassword = async function(password){
    return bcrypt.compare(password, this.passwordEstudiante)
}


export default model('Estudiante', estudianteSchema);