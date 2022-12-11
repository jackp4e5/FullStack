import jwt from 'jsonwebtoken';
import Veterinario from '../models/veterinario.js';



const checkAuth = async (req,res,next)=>{
  let token; 
  
 if (req.headers.authorization && req.headers.authorization.startsWith('Bearer'))  {

    try {

        token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token,process.env.JWT_SECRET);  /* este codigo verifica el token que sea correcto */
        req.Veterinario = await Veterinario.findById(decoded.id).select(  /* en esta parte ya esta al macenando el nodeJS */
            "-password -token -confirmado" /* quita eso de el retorno del objeto */
        );
      
        return next();
    } catch (error) {
        const e = new Error('Token no válido');
        return res.status(403).json({msg: e.message})
    }
 } 
 if (!token) {
    const error = new Error('Token no válido o inexistente');
    res.status(403).json({msg: error.message})         
}

 next();

};

export default checkAuth;