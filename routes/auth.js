// Importamos paquetes
const express = require("express");
const Usuario = require("../models/usuario_model");
const bcrypt = require("bcrypt");

// Instanciamos variables
const ruta = express.Router();

ruta.post("/", (req, res) => {
  Usuario.findOne({
    email: req.body.email,
  })
    .then((datos) => {
      if (datos) {
        const passwordValido = bcrypt.compareSync(
          req.body.password,
          datos.password
        );
        if (!passwordValido){
          return res.status(400).json({
            error: "ok",
            msj: "Usuario o contraseña incorrecta",
          });
        }else{
            return res.json(datos)
        }
      } else
        res.status(400).json({
          error: "ok",
          msj: "Usuario o contraseña incorrecta",
        });
    })
    .catch((err) => {
      res.status(400).json({
        error: "ok",
        msj: "Error en el servicio " + err,
      });
    });
});

module.exports = ruta;
