const express = require("express");
const cors = require("cors");
const path = require("path");

const { dbConnection } = require("./database/config");
require("dotenv").config();

//* CREAR SERVIDOR/APLICACION DE EXPRESS
const app = express();

//* CONEXION BASE DE DATOS
dbConnection();

//* DIRECTORIO PUBLICO
app.use(express.static("./public"));

//* CORS
app.use(cors());

//* LECTURA Y PARSEO DEL BODY
app.use(express.json());

//* RUTAS (MIDDLEWARE EXPERESS)
app.use("/api/auth", require("./routes/auth"));

//* MANEJO DE DEMAS RUTAS
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "public/index.html"));
});

app.listen(process.env.PORT, () => {
  console.log(`Servidor corriendo en puerto ${process.env.PORT}`);
});
