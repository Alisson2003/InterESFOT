import Director from "../models/Director.js"
import { sendMailToOwner } from "../config/nodemailer.js"
import { v2 as cloudinary } from 'cloudinary'
import fs from "fs-extra"


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

export{
    registrarDirector
}