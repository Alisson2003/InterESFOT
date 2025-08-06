import Estudiante from "../models/Estudiante.js"
import { sendMailToOwner } from "../config/nodemailler.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"
import mongoose from "mongoose"
import { crearTokenJWT } from "../middlewares/JWT.js"

const registrarEstudiante = async(req,res)=>{

    const {emailEstudiante} = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
    const verificarEmailBDD = await Estudiante.findOne({emailEstudiante})
    if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    const password = Math.random().toString(36).toUpperCase().slice(2, 5)

    const nuevoEstudiante = new Estudiante({
        ...req.body,
        administrador: req.administradorBDD._id
    })

    nuevoEstudiante.passwordEstudiante = await nuevoEstudiante.encrypPassword(password)

    if(req.files?.imagen){
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:'Estudiantes'})
        nuevoEstudiante.avatarCarrera = secure_url
        nuevoEstudiante.avatarCarreraID = public_id
        await fs.unlink(req.files.imagen.tempFilePath)
    }

    if (req.body?.avatarCarreraIA) {
        const base64Data = req.body.avatarCarreraIA.replace(/^data:image\/\w+;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        const { secure_url } = await new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream({ folder: 'Estudiante', resource_type: 'auto' }, (error, response) => {
                if (error) {
                    reject(error)
                } else {
                    resolve(response)
                }
            })
            stream.end(buffer)
        })
        nuevoEstudiante.avatarCarrera = secure_url
    }
    
    await nuevoEstudiante.save()
    
    await sendMailToOwner(emailEstudiante, "ESTUDIANTE" + password)
    
    res.status(201).json({msg:"Registro exitoso del estudiante y correo enviado al administrador", nuevoEstudiante})
}

const listarEstudiantes = async (req, res) => {
    const estudiantes = await Estudiante.find({ estadoEstudiante: true }).where('administrador').equals(req.administradorBDD._id)
    .select("-salida -createdAt -updatedAt -__v");
    res.status(200).json(estudiantes);
}

const detalleEstudiante = async(req,res)=>{ 
    const { id } = req.params;
    console.log("ID en params:", id);
    console.log("ID desde token:", req.estudianteBDD?._id, req.administradorBDD?._id);

    if( !mongoose.Types.ObjectId.isValid(id) )
        return res.status(404).json({msg:`Lo sentimos, no existe el estudiante ${id}`});

    const estudiante = await Estudiante.findById(id).select("-createdAt -updatedAt -__v").populate('administrador','_id nombre apellido');
    
    if(!estudiante)
        return res.status(404).json({msg:`Estudiante con id ${id} no encontrado en la base de datos.`});
    
    res.status(200).json(estudiante);
}

const eliminarEstudiante = async (req, res) => {
    const { id } = req.params;
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el estudiante con id ${id}` });
    }
    const { periodoEstudiante } = req.body;
    await Estudiante.findByIdAndUpdate(id, {periodoEstudiante: String(periodoEstudiante), estadoEstudiante: false});

    res.status(200).json({ msg: "Periodo del estudiante registrado y estado actualizado exitosamente" });
};

const actualizarEstudiante = async (req, res) => {
    const { id } = req.params;

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });}

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el estudiante con id ${id}` });}

    if (req.files?.imagen) {
        const estudiante = await Estudiante.findById(id);
        if (estudiante.avatarCarreraID) {
            await cloudinary.uploader.destroy(estudiante.avatarCarreraID);
        }
        const cloudiResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, {
            folder: "Estudiantes",
        });
        req.body.avatarCarrera = cloudiResponse.secure_url;
        req.body.avatarCarreraID = cloudiResponse.public_id;
        await fs.unlink(req.files.imagen.tempFilePath);
    }

    await Estudiante.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: "Actualización exitosa del estudiante" });
};
/*
const loginEstudiante = async (req, res) => {
    console.log("REQ.BODY:", req.body);

    const { email: emailEstudiante, password: passwordEstudiante } = req.body;

    console.log("EMAIL:", emailEstudiante);
    console.log("PASSWORD:", passwordEstudiante);

    if (!emailEstudiante || !passwordEstudiante) {
        return res.status(400).json({ msg: "Faltan campos" });
    }

    const estudianteBDD = await Estudiante.findOne({ emailEstudiante });

    if (!estudianteBDD) {
        return res.status(404).json({ msg: "Usuario no encontrado" });
    }

    const verificarPassword = await estudianteBDD.matchPassword(passwordEstudiante);
    if (!verificarPassword) {
        return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = crearTokenJWT(estudianteBDD._id, estudianteBDD.rol);
    res.json({ token, rol: estudianteBDD.rol, _id: estudianteBDD._id });
};*/


const loginEstudiante = async (req, res) => {
    try {
        const { email: rawEmail, password: rawPassword } = req.body;

        // Validar campos
        if (!rawEmail || !rawPassword) {
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
        }

        const emailEstudiante = rawEmail.trim().toLowerCase();
        const passwordEstudiante = rawPassword.trim();

        const estudianteBDD = await Estudiante.findOne({ emailEstudiante });

        if (!estudianteBDD) {
            return res.status(404).json({ msg: "El estudiante no se encuentra registrado" });
        }

        const verificarPassword = await estudianteBDD.matchPassword(passwordEstudiante);

        if (!verificarPassword) {
            return res.status(401).json({ msg: "Contraseña incorrecta" });
        }

        const token = crearTokenJWT(estudianteBDD._id, estudianteBDD.rol);
        const { _id, rol, nombreEstudiante } = estudianteBDD;

        return res.status(200).json({
            msg: "Login exitoso",
            token,
            rol,
            _id,
            nombreEstudiante
        });

    } catch (error) {
        console.error("Error en loginEstudiante:", error);
        return res.status(500).json({ msg: "Error interno del servidor" });
    }
};

const perfilEstudiante = (req, res) => {
    
    const camposAEliminar = [
        
        "estadoEstudiante", "administrador",
        "passwordEstudiante", 
        "avatarCarrera", "avatarCarreraIA","avatarCarreraID", "createdAt", "updatedAt", "__v"
    ]

    camposAEliminar.forEach(campo => delete req.estudianteBDD[campo])

    res.status(200).json(req.estudianteBDD)
}

export {
    registrarEstudiante,
    listarEstudiantes,
    detalleEstudiante,
    eliminarEstudiante,
    actualizarEstudiante,
    loginEstudiante,
    perfilEstudiante
}
