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
        subject: ' comprueba tu cuenta en apv ',
        text:'comprueba tu cuenta en APV',
        html: `<p>Hola: ${nombre}, comprueba tu cuenta aqui en APV.</p>
               <P>Tu cuenta ya esta lista solo debes de confirmarla en este enlace:
                    <a href="http://127.0.0.1:5173/confirmar/${token}">Comprobar cuenta</a>
               </P>

               <p>Si tu no creaste esta cuenta,  puedes ignorar este mensaje</p>
        
        `
    });


    console.log('mensaje enviado: %s', info.messageId);

};

export default emailRegistro;
