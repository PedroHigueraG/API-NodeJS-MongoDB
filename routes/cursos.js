// Importamos paquetes
const express = require("express");
const Joi = require('@hapi/joi')
const Curso = require("../models/curso_model");

// Instanciamos variables
const ruta = express.Router();

// Definimos el esquema de validación
const schema = Joi.object({
    titulo: Joi.string()
        .min(3)
        .max(20)
        .required(),
    descripcion: Joi.string()
        .min(3)
        .max(100)
})

// Establecemos las rutas
ruta.get("/", (req, res) => {

  let resultado = listarCursosActivos()

  resultado
  .then((cursos) => {
    res.json(
      cursos,
    );
  })
  .catch((err) => {
    res.status(400).json({
      error: err,
    });
  });
});

// Ruta POST
ruta.post("/", (req, res) => {
  let body = req.body;

  const {error, value} = schema.validate({
    titulo: body.titulo,
    descripcion: body.descripcion
  })

  if(!error){
    let resultado = crearCurso(body);

    resultado
      .then((valor) => {
        res.json({
          valor: valor,
        });
      })
      .catch((err) => {
        res.status(400).json({
          error: err,
        });
      });
  }else{
    res.status(400).json({
        error: error,
      });
  }

});

// Ruta PUT
ruta.put("/:id", (req, res) => {

    const {error, value} = schema.validate({
        titulo: req.body.titulo,
        descripcion: req.body.descripcion
      })

      if(!error){
        let resultado = actualizarCurso(req.params.id, req.body);

        resultado
          .then((valor) => {
            res.json({
              valor: valor,
            });
          })
          .catch((err) => {
            res.status(400).json({
              error: err,
            });
          });
      }else{
        res.status(400).json({
            error: error,
          });
      }


});

// Ruta DELETE
ruta.delete("/:id", (req, res) => {
  let resultado = desactivarCurso(req.params.id);

  resultado
    .then((valor) => {
      res.json({
        valor: valor,
      });
    })
    .catch((err) => {
      res.status(400).json({
        error: err,
      });
    });
});

// Definicion de funciones
async function crearCurso(body) {
  let curso = new Curso({
    titulo: body.titulo,
    descripcion: body.descripcion
  });

  return await curso.save();
}

async function listarCursosActivos() {
  let curso = await Curso.find({
    estado: true,
  });

  return curso;
}

async function actualizarCurso(id, body) {
  let curso = await Curso.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        titulo: body.titulo,
        descripcion: body.descripcion,
      },
    },
    { new: true }
  );

  return curso;
}

async function desactivarCurso(id) {
  let curso = await Curso.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        estado: false,
      },
    },
    { new: true }
  );

  return curso;
}
// Exportamos
module.exports = ruta;
