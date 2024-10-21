// Importamos paquetes
const express = require("express");
const Joi = require("@hapi/joi");
const Usuario = require("../models/usuario_model");
const bcrypt = require("bcrypt")
const verificarToken = require("../middlewares/auth")

// Instanciamos variables
const ruta = express.Router();

// Definimos el esquema de validación
const schema = Joi.object({
  nombre: Joi.string().min(3).max(20).required(),
  password: Joi.string().pattern(/^[a-zA-Z0-9]{3,30}$/),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: { allow: ["com", "net"] },
  }),
});


// Establecemos las rutas
ruta.get("/",verificarToken, (req, res) => {
  let resultado = listarUsuariosActivos();

  resultado
    .then((usuarios) => {
      res.json(usuarios);
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

// Ruta POST
ruta.post("/",(req, res) => {
  let body = req.body;

  Usuario.findOne(
    {
      email: body.email,
    }
  ).then(
    (user) => {
        
        if (user) {res.status(400).json({ msj: "El usuario ya existe!" });}
        else {
            const { error, value } = schema.validate({
                nombre: body.nombre,
                password: body.password,
                email: body.email,
              });
            
              if (!error) {
                let resultado = crearUsuario(body);
            
                resultado
                  .then((valor) => {
                    return res.json({
                      nombre: valor.nombre,
                      email: valor.email,
                    });
                  })
                  .catch((err) => {
                    return res.status(400).json({
                      error: err,
                    });
                  });
              } else {
                return res.status(400).json({
                  error: error,
                });
              }
        }
      }
  ).catch(
     (err) => { res.status(400).json({ error: "Server error" });}
  );

  

});

// Ruta PUT
ruta.put("/:email",verificarToken, (req, res) => {
  const { error, value } = schema.validate({
    nombre: req.body.nombre,
    password: req.body.password,
  });

  if (!error) {
    let resultado = actualizarUsuario(req.params.email, req.body);

    resultado
      .then((valor) => {
        res.json({
          nombre: valor.nombre,
          email: valor.email,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  } else {
    res.status(400).json({
      error: error,
    });
  }
});

// Ruta DELETE
ruta.delete("/:email",verificarToken, (req, res) => {
  let resultado = desactivarUsuario(req.params.email);

  resultado
    .then((valor) => {
      res.json({
        nombre: valor.nombre,
        email: valor.email,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

// Definicion de funciones
async function crearUsuario(body) {
  let usuario = new Usuario({
    email: body.email,
    nombre: body.nombre,
    password: bcrypt.hashSync(body.password, 10),
  });

  return await usuario.save();
}

async function listarUsuariosActivos() {
  let usuario = await Usuario.find({
    estado: true,
  }).select({ nombre: 1, email: 1 });

  return usuario;
}

async function actualizarUsuario(email, body) {
  let usuario = await Usuario.findOneAndUpdate(
    { email: email },
    {
      $set: {
        nombre: body.nombre,
        password: body.password,
      },
    },
    { new: true }
  );

  return usuario;
}

async function desactivarUsuario(email) {
  let usuario = await Usuario.findOneAndUpdate(
    { email: email },
    {
      $set: {
        estado: false,
      },
    },
    { new: true }
  );

  return usuario;
}
// Exportamos
module.exports = ruta;
