import Administrador from "../models/Administrador.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../config/nodemailler.js"

const registro = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (Object.values(req.body).includes(""))
            return res.status(400).json({ msg: "Lo sentimos, debes llenar todos los campos" });

        const administradorEmailBDD = await Administrador.findOne({ email });

        if (administradorEmailBDD)
            return res.status(400).json({ msg: "Lo sentimos, el email ya se encuentra registrado" });

        const nuevoAdministrador = await Administrador(req.body);

        nuevoAdministrador.password = await nuevoAdministrador.encrypPassword(password);

        const token = nuevoAdministrador.crearToken();
        await sendMailToRegister(email, token);

        await nuevoAdministrador.save();

        res.status(200).json({ msg: "Revisa tu correo electrónico para confirmar tu cuenta" });
    } catch (error) {
        console.error("❌ Error en registro:", error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};



const confirmarMail = async (req,res)=>{
    if (!(req.params.token)) return res.status(400).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    
    //2
    const administradorBDD = await Administrador.findOne({token:req.params.token})

    if(!administradorBDD?.token) return res.status(404).json({msg:"La cuenta ya ha sido confirmada"})
    //3
    administradorBDD.token = null
    administradorBDD.confirmEmail=true
    await administradorBDD.save()

    //4
    res.status(200).json({msg:"Token confirmado, ya puedes iniciar sesión"})
}

const recuperarPassword = async(req,res)=>{
    const {email} = req.body
    if (Object.values(req.body).includes("")) return res.status(404).json({msg:"Lo sentimos, debes llenar todos los campos"})
    const administradorBDD = await Administrador.findOne({email})
    if(!administradorBDD) return res.status(404).json({msg:"Lo sentimos, el usuario no se encuentra registrado"})
    const token = administradorBDD.crearToken()
    administradorBDD.token=token
    await sendMailToRecoveryPassword(email,token)
    await administradorBDD.save()
    res.status(200).json({msg:"Revisa tu correo electrónico para reestablecer tu cuenta"})
}


const comprobarTokenPasword = async (req,res)=>{
    const {token} = req.params
    const administradorBDD = await Administrador.findOne({token})
    if(administradorBDD?.token !== req.params.token) return res.status(404).json({msg:"Lo sentimos, no se puede validar la cuenta"})
    await administradorBDD.save()
    res.status(200).json({msg:"Token confirmado, ya puedes crear tu nuevo password"}) 
}


const crearNuevoPassword = async (req,res)=>{
    //1
    const {password, confirmpassword} = req.body
    
    //2
    if(Object.values(req.body).includes("")) return res.status(404).json({msg: "Lo sentimos,debes llenar todos los campos"})

    if(password !== confirmpassword) return res.status(404).json({msg: "Lo sentimos,los password no cinciden"})

    const administradorBDD = await Administrador.findOne({token:req.params.token})

    if(administradorBDD.token !== req.params.token) return res.status(404).json({msg: "Lo sentimos, no se puede validar la cuenta"})

    //3 logica - dejando token nulo y encriptacion de contraseña
    administradorBDD.token = null
    administradorBDD.password = await administradorBDD.encrypPassword(password)

    await administradorBDD.save()

    //4

    res.status(200).json({msg: "Felicitaciones, ya puedes iniciar sesion con tu nuevo password"})

}



export {
    registro,
    confirmarMail,
    recuperarPassword,
    comprobarTokenPasword,
    crearNuevoPassword
}
