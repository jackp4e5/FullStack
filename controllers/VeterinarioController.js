import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import Veterinario from "../models/veterinario.js";
import emailRegistro from "../helpers/emailRegistro.js";
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";

const registrar = async (req, res) => {
  const { email, nombre } = req.body;

  //  revisar si un usurio  esta registrado

  const existeUsuario = await Veterinario.findOne({ email });

  if (existeUsuario) {
    const error = new Error("Usuario ya registrado");

    return res.status(400).json({ msg: error.message });
  }
  try {
    //  GUARDAR NUEVO VETERINARIO
    const veterinario = new Veterinario(req.body);
    const veterinarioGuardado = await veterinario.save();

    //    ENVIAR EL EMAIL
    emailRegistro({
      email,
      nombre,
      token: veterinarioGuardado.token,
    });

    res.json(veterinarioGuardado);
  } catch (error) {
    console.log(error);
  }
};

const perfil = (req, res) => {
  const { Veterinario } = req;
  res.json(Veterinario);
};

const confirmar = async (req, res) => {
  const { token } = req.params;

  const usuarioConfirmar = await Veterinario.findOne({ token });

  if (!usuarioConfirmar) {
    const error = new Error("token no valido");

    return res.status(404).json({ msg: error.message });
  }

  try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado = true;
    await usuarioConfirmar.save();
    res.json({ msg: " Usuario confirmado correctamente" });
  } catch (error) {
    console.log(error.message);
  }
};

const autenticar = async (req, res) => {
  const { email, password } = req.body;

  //  COMPROBAR SI EL USUARIO EXISTE

  const usuario = await Veterinario.findOne({ email });

  if (!usuario) {
    const error = new Error("El usuario existe");

    return res.status(404).json({ msg: error.message });
  }

  // COMPROBAR SI EL USUARIO YA ESTA CONFIRMADO

  if (!usuario.confirmado) {
    const error = new Error("YOUR ACCOUNT IS NOT CONFIRMED");

    return res.status(403).json({ msg: error.message });
  }

  // REVISAR EL PASSWORD

  if (await usuario.comprobarPassword(password)) {
    // AUTENTICAR
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id),
    });
  } else {
    const error = new Error("El password es incorrecto");

    return res.status(403).json({ msg: error.message });
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const existeVeterinario = await Veterinario.findOne({ email });
  if (!existeVeterinario) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    existeVeterinario.token = generarId();
    await existeVeterinario.save();

    // ENVIAR EMAIL CON INSTRUCIONES
    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token,
    });
    res.json({ msg: "Hemos enviado un email con las intrucciones" });
  } catch (error) {}
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const tokenValido = await Veterinario.findOne({ token });

  if (tokenValido) {
    //  si el token es valiodo el usuario existe

    res.json({ msg: " Token válido y el usuario existe" });
  } else {
    const error = new Error("Hubo un problema con el enlace");
    return res.status(400).json({ msg: error.message });
  }
};
const nuevoPassword = async (req, res) => {
  const { token } = req.params; /* res.params es de la url */
  const { password } = req.body; /* y este lee el objeto del body postman */

  const veterinario = await Veterinario.findOne({ token });

  if (!veterinario) {
    const error = new Error("Hubo un error");
    return res.status(400).json({ msg: error.message });
  }

  try {
    veterinario.token = null;
    veterinario.password = password;
    await veterinario.save();
    res.json({ msg: " password has been changed" });
  } catch (error) {
    console.log(error);
  }
};

const actualizarPerfil = async (req, res) => {
  const veterinario = await Veterinario.findById(req.params.id);

  if (!veterinario) {
    const error = new Error("Hubo un error");

    return res.status(400).json({ msg: error.message });
  }
  if (veterinario.email !== req.body.email) {
    const { email } = req.body;
    const existeEmail = await Veterinario.findOne({ email });

    if (existeEmail) {
      const error = new Error("El email ya esta en uso");

      return res.status(400).json({ msg: error.message });
    }
  }
  try {
    veterinario.nombre = req.body.nombre || veterinario.nombre;
    veterinario.email = req.body.email || veterinario.email;
    veterinario.web = req.body.web || veterinario.web;
    veterinario.telefono = req.body.telefono || veterinario.telefono;

    const veterinarioActualizado = await veterinario.save();

    res.json(veterinarioActualizado);
  } catch (error) {
    console.log(error);
  }
};

const actualizarPassword = async (req, res) => {
  //  LEER DATOS
  const { _id } = req.Veterinario;
  const { password, nuevo_password } = req.body;
  //  COMPROBAR QUE  EL VETERINARIO EXISTA
  const veterinario = await Veterinario.findById(_id);

  if (!veterinario) {
    const error = new Error("Hubo un error");

    return res.status(400).json({ msg: error.message });
  }
  // COMPROBAR PASSWORD
if (await veterinario.comprobarPassword(password)) {
    //  ALMACENAR EL NUEVO PASSWORD
    veterinario.password = nuevo_password;
    await veterinario.save();
    res.json({msg:'password guardado correctamente'})
}else{
    const error = new Error("El password actual es incorrecto");

    return res.status(400).json({ msg: error.message });
}

};
export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword,
};
