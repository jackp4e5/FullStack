import nodemailer from "nodemailer";

const emailRegistro = async (datos) =>{

    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const {email, nombre, token}= datos;

    //    ENVIAR EMAIL

    const info = await transport.sendMail({
        from:'APV - ADMINISTRADOR DE PACIENTES DE VETERINARIA',
        to: email,
        subject: '  Reestablece tu password ',
        text:' Reestablece tu password',
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>
               <P>Sigue este enlace para generar un nuevo password:
                    <a href="http://127.0.0.1:5173/olvide-password/${token}">Reestrablecer password</a>
               </P>

               <p>Si tu no creaste esta cuenta,  puedes ignorar este mensaje</p>
        
        `
    });


    console.log('mensaje enviado: %s', info.messageId);

};

export default emailRegistro;
