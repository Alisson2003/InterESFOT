import nodemailer from "nodemailer"
import dotenv from 'dotenv'
dotenv.config()


let transporter = nodemailer.createTransport({
    service: 'gmail',
    //host: process.env.HOST_MAILTRAP,
    //port: process.env.PORT_MAILTRAP,
    auth: {
        user: process.env.USER_MAILTRAP,
        pass: process.env.PASS_MAILTRAP,
    }
});

const sendMailToRegister = (userMail, token) => {

    let mailOptions = {
        from: process.env.USER_MAILTRAP,
        to: userMail,
        subject: "INTER_ESFOT-💪",
        html: `<p>¡Registro exitoso! 🎉
        <br>Gracias por unirte a la comunidad de la ESFOT.</br>
        <brAhora solo falta un paso: haz clic en Iniciar y prepárate para disfrutar de experiencias mágicas con nosotros.</br>
        <br><a href="${process.env.URL_FRONTEND}confirm/${token}">INICIAR</a></br>
        <footer>
        ¡Bienvenido/a a bordo! Estamos emocionados de acompañarte en esta aventura. 🌟
    </footer>
        `
    }

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
        }
    })
}

const sendMailToRecoveryPassword = async(userMail,token)=>{
    let info = await transporter.sendMail({
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: "Correo para reestablecer tu contraseña",
    html: `
    <h1>INTER_ESFOT-💪</h1>
    <hr>
    <a href=${process.env.URL_FRONTEND}reset/${token}>Clic para reestablecer tu contraseña</a>
    <hr>
    <footer>¡Bienvenido/a a bordo! Estamos emocionados de acompañarte en esta aventura. 🌟</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}

const sendMailToOwner = async(userMail,password)=>{
    let info = await transporter.sendMail({
    from: process.env.USER_MAILTRAP,
    to: userMail,
    subject: "Correo de bienvenida - Director de la Facultad ESFOT",
    html: `
    <h1>INTER_ESFOT-💪</h1>
    <hr>
    <p>Contraseña de acceso: ${password}</p>
    <a href=${process.env.URL_FRONTEND}login>Clic para iniciar sesión</a>
    <hr>
    <footer>La ESFOT te da la más cordial bienvenida.</footer>
    `
    });
    console.log("Mensaje enviado satisfactoriamente: ", info.messageId);
}


export {
    sendMailToRegister,
    sendMailToRecoveryPassword,
    sendMailToOwner
}