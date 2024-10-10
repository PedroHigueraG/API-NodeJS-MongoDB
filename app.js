// Importando paquetes
const usuarios = require('./routes/usuarios')
const cursos = require('./routes/cursos')
const auth = require('./routes/auth')
const express = require('express')
const mongoose = require('mongoose')

// Instanciando variables
const app = express()
const port = process.env.PORT || 3000

// Conexion a BD
// mongoose.connect('mongodb://127.0.0.1:27017/ApiNodeJs')
//     .then(()=>console.log("Conectado a BD!"))
//     .catch(err => console.log("No se conectó a BD! ",err))

const username = encodeURIComponent("admin");
const password = encodeURIComponent("contraseñasegura123");
const uri = `mongodb+srv://${username}:${password}@clustergratis.aacwg.mongodb.net/?retryWrites=true&w=majority&appName=ClusterGratis`;
const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

mongoose.connect(uri, clientOptions)
    .then(()=>console.log("Conectado a BD!"))
    .catch(err => console.log("No se conectó a BD! ",err))

// Uso de middlewares
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api/usuarios/',usuarios)
app.use('/api/cursos/',cursos)
app.use('/api/auth/',auth)

// Abriendo puerto
app.listen(port, () => {
    console.log("Ejecutando API")
})