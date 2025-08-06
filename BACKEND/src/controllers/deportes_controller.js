import Deporte from "../models/Deportes.js"
import mongoose from "mongoose"


const registrarDeporte = async (req,res)=>{
    const {estudiante} = req.body
    if( !mongoose.Types.ObjectId.isValid(estudiante) ) return res.status(404).json({msg:`Lo sentimos, debe ser un id válido`});
    await Deporte.create(req.body)
    res.status(200).json({msg:"Registro exitoso del deporte"})
}

const eliminarDeporte = async(req,res)=>{
    const {id} = req.params
    if( !mongoose.Types.ObjectId.isValid(id) ) return res.status(404).json({msg:`Lo sentimos, no existe ese deporte`})
    await Deporte.findByIdAndDelete(req.params.id)
    res.status(200).json({msg:"Deporte eliminado exitosamente"})
}

export{
    registrarDeporte,
    eliminarDeporte
}