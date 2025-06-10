/*port {Schema, model} from 'mongoose';
import bcrypt from "bcryptjs";


const administradorSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    apellido:{
        type:String,
        require:true,
        trim:true
    },
    direccion:{
        type:String,
        trim:true,
        default:null
    },
    celular:{
        type:String,
        trim:true,
        default:null
    },
    email:{
        type:String,
        require:true,
        trim:true,
				unique:true
    },
    password:{
        type:String,
        require:true
    },
    status:{
        type:Boolean,
        default:true
    },
    token:{
        type:String,
        default:null
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    rol:{
        type:String,
        default:"administrador",
    }

},{
    timestamps:true
})


// Método para cifrar el password del veterinario
administradorSchema.methods.encrypPassword = async function(password){
    const salt = await bcrypt.genSalt(10)
    const passwordEncryp = await bcrypt.hash(password,salt)
    return passwordEncryp
}


// Método para verificar si el password ingresado es el mismo de la BDD
administradorSchema.methods.matchPassword = async function(password){
    const response = await bcrypt.compare(password,this.password)
    return response
}


// Método para crear un token 
administradorSchema.methods.crearToken = function(){
    const tokenGenerado = this.token = Math.random().toString(36).slice(2)
    return tokenGenerado
}


export default model('Administrador',administradorSchema)
*/
import { Schema, model } from 'mongoose';
import bcrypt from "bcryptjs";

const administradorSchema = new Schema({
nombre: {
    type: String,
    required: true,     // ❗ Corrección: 'require' → 'required'
    trim: true
},
apellido: {
    type: String,
    required: true,     // ❗
    trim: true
},
direccion: {
    type: String,
    trim: true,
    default: null
},
celular: {
    type: String,
    trim: true,
    default: null
},
email: {
    type: String,
    required: true,     // ❗
    trim: true,
    unique: true
},
password: {
    type: String,
    required: true      // ❗
},
status: {
    type: Boolean,
    default: true
},
token: {
    type: String,
    default: null
},
confirmEmail: {
    type: Boolean,
    default: false
},
rol: {
    type: String,
    default: "administrador"
}
}, {
    timestamps: true
});

// 🔐 Método para cifrar la contraseña
administradorSchema.methods.encryptPassword = async function(password) {
    const salt = await bcrypt.genSalt(10);
    const passwordEncrypted = await bcrypt.hash(password, salt);
    return passwordEncrypted;
};

// 🔐 Método para comparar contraseñas
administradorSchema.methods.matchPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// 🔑 Método para generar token
administradorSchema.methods.crearToken = function() {
    this.token = Math.random().toString(36).slice(2);
    return this.token;
};

export default model('Administrador', administradorSchema);
