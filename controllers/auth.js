const { response } = require("express"); //* TIPADO
const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");
const { generarJWT } = require("../utils/jwt");

const crearUsuario = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    //* VERIFICAR EL EMAIL
    const usuario = await Usuario.findOne({ email });

    if (usuario) {
      return res.status(400).json({
        ok: false,
        msg: "El usuario ya existe con ese email. ",
      });
    }

    //* CREAR USUARIO CON EL MODELO
    const dbUser = new Usuario(req.body);

    //* HASH LA CONTRASEÑA
    const salt = bcrypt.genSaltSync(10);
    dbUser.password = bcrypt.hashSync(password, salt);

    //* GENERAR JWT
    const token = await generarJWT(dbUser.id, name);

    //* CREAR USUARIO DE BASE DE DATOS
    await dbUser.save();

    //* GENERAR RESPUESTA EXITOSA
    return res.status(201).json({
      ok: true,
      uid: dbUser.id,
      name: name,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      ok: false,
      msg: "Por favor hable con el administrador.",
    });
  }
};

const loginUsuario = async (req, res = response) => {
  const { email, password } = req.body;

  try {
    const dbUser = await Usuario.findOne({ email: email });

    if (!dbUser) {
      return res.status(404).json({
        ok: false,
        msg: "El correo no existe.",
      });
    }

    //*CONFIRMAR SI EL PASSWORD HACE MATCH
    const validPassword = bcrypt.compareSync(password, dbUser.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "El password no es valido.",
      });
    }

    //* GENERAR JWT
    const token = await generarJWT(dbUser.id, dbUser.name);

    //* RESPUESTA DEL SERVICIO
    return res.json({
      ok: true,
      uid: dbUser.id,
      name: dbUser.name,
      token,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Hable con el administrador.",
    });
  }
};

const revalidarToken = async (req, res = response) => {
  const { uid, name } = req;

  const token = await generarJWT(uid, name);

  return res.json({
    ok: true,
    uid,
    name,
    token,
  });
};

module.exports = {
  crearUsuario,
  loginUsuario,
  revalidarToken,
};
