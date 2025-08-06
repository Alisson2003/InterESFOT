import {Schema, model} from 'mongoose';
import bcrypt from "bcryptjs";

const directorSchema = new Schema({
    nombreDirector:{
        type:String,
        required:true,
        trim:true
    },
    apellidoDirector:{
        type:String,
        required:true,
        trim:true
    },
    celularDirector:{
        type:String,
        trim:true,
        default:null
    },
    oficinaDirector:{
        type:String,
        trim:true,
        default:null
    }
    ,
    emailDirector:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    passwordDirector:{
        type:String,
        required:true
    },
    nombreFacultad:{
        type:String,
        required:true,
        trim:true
    },
    avatarFacultad:{
        type:String,
        trim:true
    },
    avatarFacultadID:{
        type:String,
        trim:true
    },
    periodoDirector:{
        type:String,
        required:true,
        trim:true
    },
    estadoDirector:{
        type:Boolean,
        default:true
    },
    rol:{
        type:String,
        default:"director",
    },
    administrador:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Administrador',
    }
},{
    timestamps:true
})

// Método para cifrar el password del propietario
directorSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    return bcrypt.hash(password, salt)
}

// Método para verificar si el password ingresado es el mismo de la BDD
directorSchema.methods.matchPassword = async function(password){
    return bcrypt.compare(password, this.passwordPropietario)
}

export default model('Paciente',directorSchema);
