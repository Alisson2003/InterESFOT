import Deporte from "../models/Deportes.js"
import mongoose from "mongoose"
import { Stripe } from "stripe"
const stripe = new Stripe(`${process.env.STRIPE_PRIVATE_KEY}`)

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

const pagarDeporte = async (req, res) => {

    const { paymentMethodId, treatmentId, cantidad, motivo } = req.body

    try {

        const deporte = await Deporte.findById(treatmentId).populate('estudiante')
        if (!deporte) return res.status(404).json({ message: "Deporte no encontrado" })
        if (deporte.estadoPago === "Pagado") return res.status(400).json({ message: "Este Deporte ya fue pagado" })
        if (!paymentMethodId) return res.status(400).json({ message: "paymentMethodId no proporcionado" })

        let [cliente] = (await stripe.customers.list({ email:deporte.emailEstudiante, limit: 1 })).data || [];
        
        if (!cliente) {
            cliente = await stripe.customers.create({ name:deporte.nombreEstudiante, email:deporte.emailEstudiante });
        }
        
        const payment = await stripe.paymentIntents.create({
            amount:cantidad,
            currency: "USD",
            description: motivo,
            payment_method: paymentMethodId,
            confirm: true,
            customer: cliente.id,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: "never"
            }
        })

        if (payment.status === "succeeded") {
            await Deporte.findByIdAndUpdate(treatmentId, { estadoPago: "Pagado" });
            return res.status(200).json({ msg: "El pago se realizó exitosamente" })
        }
    } catch (error) {
        res.status(500).json({ msg: "Error al intentar pagar el deporte", error });
    }
}

export{
    registrarDeporte,
    eliminarDeporte,
    pagarDeporte
}
