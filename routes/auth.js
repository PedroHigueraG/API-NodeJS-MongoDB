// Importamos paquetes
const express = require("express");
const jwt = require("jsonwebtoken");
const Usuario = require("../models/usuario_model");
const bcrypt = require("bcrypt");
const config = require('config')

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
        if (!passwordValido) {
          return res.status(400).json({
            error: "ok",
            msj: "Usuario o contraseña incorrecta",
          });
        } else {
          const jwtoken = jwt.sign(
            {
              _id: datos.id,
              nombre: datos.nombre,
              email: datos.email,
            },
            config.get('configToken.SEED'),
            {
              expiresIn: config.get('configToken.expiration')
            }
          );

          return res.json({
            usuario: {
                _id: datos.id,
                nombre: datos.nombre,
                email: datos.email
            },
            token: jwtoken
          });
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
