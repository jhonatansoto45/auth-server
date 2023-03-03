const { Router } = require("express");
const { check } = require("express-validator");
const {
  crearUsuario,
  loginUsuario,
  revalidarToken,
} = require("../controllers/auth");

const { validarCampos } = require("../middlewares/validar-campos");
const { validarJWT } = require("../middlewares/validar-jwt");

const router = Router();

//* CREAR NUEVO USUARIO
router.post(
  "/new",
  [
    check("name", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatorio").isLength({ min: 6 }),
    validarCampos, //* LLAMADO DE MIDDLEWARE (FUNCION)
  ],
  crearUsuario
);

//* LOGIN DE USUARIO
//router.post("/", loginUsuario); //* NORMAL
router.post(
  "/",
  [
    check("email", "El email es obligatorio").isEmail(),
    check("password", "La contraseña es obligatorio").isLength({ min: 6 }),
    validarCampos, //* LLAMADO DE MIDDLEWARE (FUNCION)
  ], 
  loginUsuario
); //* CON MIDDLEWARES

//* VALIDAR Y REVALDIAR TOKEN
router.get("/renew", validarJWT, revalidarToken);

//* EXPORTAR EN NODE
module.exports = router;
