import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import VeterinarioRoutes from "./routes/VeterinarioRoutes.js";
import PacienteRoute from "./routes/PacienteRoute.js";

const app = express();
app.use(
  express.json()
); /*  aqui se  habilita para poder enviar informacion con el metodo post desde postMan */
dotenv.config();

conectarDB();
const dominiosPermitidos = [process.env.FRONTEND_URL];

const corsOptions = {
  origin: function(origin,callback){
    if (dominiosPermitidos.indexOf(origin) !== 1) {
      //  El origen del request esta permitido

      callback(null,true)
    }else{
      callback( new Error('no permitido por cors'))
    }
  }
}

app.use(cors(corsOptions));

app.use("/api/veterinarios", VeterinarioRoutes);
app.use("/api/pacientes", PacienteRoute);

/*  app.use('/',(req,res)=>{
   res.send('hola mundo estoy desde nodemon')
 }); */

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log("puerto listo 4000");
});
