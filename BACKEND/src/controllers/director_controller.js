import Director from "../models/Director.js"
import { sendMailToOwner } from "../config/nodemailler.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"
import mongoose from "mongoose"
import { crearTokenJWT } from "../middlewares/JWT.js"

const registrarDirector = async(req,res)=>{

    const {emailDirector} = req.body

    if (Object.values(req.body).includes("")) return res.status(400).json({msg:"Lo sentimos, debes llenar todos los campos"})
    
        const verificarEmailBDD = await Director.findOne({emailDirector})
        if(verificarEmailBDD) return res.status(400).json({msg:"Lo sentimos, el email ya se encuentra registrado"})

    const password = Math.random().toString(36).toUpperCase().slice(2, 5)

    const nuevoDirector = new Director({
        ...req.body,
        passwordDirector: await Director.prototype.encrypPassword(password),
        administrador: req.administradorBDD._id
    })

    if(req.files?.imagen){
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.files.imagen.tempFilePath,{folder:'Directores'})
        nuevoDirector.avatarFacultad = secure_url
        nuevoDirector.avatarFacultadID = public_id
        await fs.unlink(req.files.imagen.tempFilePath)
    }

    if (req.body?.avatarFacultadIA) {
    // data:image/png;base64,iVBORw0KGgjbjgfyvh
    // iVBORw0KGgjbjgfyvh
    const base64Data = req.body.avatarFacultadIA.replace(/^data:image\/\w+;base64,/, '')
    // iVBORw0KGgjbjgfyvh  -  010101010101010101
    const buffer = Buffer.from(base64Data, 'base64')
    const { secure_url } = await new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream({ folder: 'Director', resource_type: 'auto' }, (error, response) => {
            if (error) {
                reject(error)
            } else {
                resolve(response)
            }
        })
        stream.end(buffer)
    })
        nuevoDirector.avatarFacultadIA = secure_url
    }
    
    await nuevoDirector.save()
    
    await sendMailToOwner(emailDirector,"DIRECTOR"+password)
    
    res.status(201).json({msg:"Registro exitoso del director y correo enviado al administrador", nuevoDirector})
}
/*
const listarDirectores = async (req,res)=>{
    const directores = await Director.find({estadoDirector:true}).where('director').equals(req.directorBDD).select("-salida -createdAt -updatedAt -__v").populate('director','_id nombre apellido')
    res.status(200).json(directores)
}*/

const listarDirectores = async (req, res) => {
    const directores = await Director.find({ estadoDirector: true }).where('administrador').equals(req.administradorBDD._id)
    .select("-salida -createdAt -updatedAt -__v");
    res.status(200).json(directores);
}
/*
const detalleDirector = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe el director ${id}`});
    const director = await Director.findById(id).select("-createdAt -updatedAt -__v").populate('administrador','_id nombre apellido')
    res.status(200).json(director)
}*/

const detalleDirector = async(req,res)=>{ 
    const { id } = req.params;
    console.log("ID en params:", id);
    console.log("ID desde token:", req.directorBDD?._id, req.administradorBDD?._id);

    if( !mongoose.Types.ObjectId.isValid(id) )
        return res.status(404).json({msg:`Lo sentimos, no existe el director ${id}`});

    const director = await Director.findById(id).select("-createdAt -updatedAt -__v").populate('administrador','_id nombre apellido');
    
    if(!director)
        return res.status(404).json({msg:`Director con id ${id} no encontrado en la base de datos.`});
    
    res.status(200).json(director);
}

const eliminarDirector = async (req, res) => {
    const { id } = req.params;
    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el director con id ${id}` });
    }
    const { periodoDirector } = req.body;
    await Director.findByIdAndUpdate(id, {periodoDirector:String(periodoDirector), estadoDirector: false});

    res.status(200).json({ msg: "Periodo del director registrado y estado actualizado exitosamente" });
};

const actualizarDirector = async (req, res) => {
    const { id } = req.params;

    if (Object.values(req.body).includes("")) {
        return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });}

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ msg: `Lo sentimos, no existe el director con id ${id}` });}

    if (req.files?.imagen) {
        const director = await Director.findById(id);
        if (director.avatarFacultadID) {
        await cloudinary.uploader.destroy(director.avatarFacultadID);
        }
        const cloudiResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, {
        folder: "Directores",
        });
        req.body.avatarFacultad = cloudiResponse.secure_url;
        req.body.avatarFacultadID = cloudiResponse.public_id;
        await fs.unlink(req.files.imagen.tempFilePath);
    }

    await Director.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: "Actualización exitosa del director" });
};


const loginDirector = async(req,res)=>{


    const {email:emailDirector,password:passwordPropietario} = req.body
    if (Object.values(req.body).includes("")) 
        return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const directorBDD = await Director.findOne({emailDirector})
    if(!directorBDD) 
        return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const verificarPassword = await directorBDD.matchPassword(passwordDirector)
    if(!verificarPassword) return res.status(404).json({msg:"Lo sentimos, el password no es el correcto"})
    const token = crearTokenJWT(directorBDD._id,directorBDD.rol)
	const {_id,rol} = directorBDD
    res.status(200).json({
        token,
        rol,
        _id
    })
}

export{
    registrarDirector,
    listarDirectores,
    detalleDirector,
    eliminarDirector,
    actualizarDirector,
    loginDirector
}