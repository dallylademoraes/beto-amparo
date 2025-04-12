import express from 'express'
import bodyParser from 'body-parser'
import {
  getEmpresas,
  postEmpresa,
  putEmpresa,
  deleteEmpresa
} from './controller/empresaController.js'

const app = express()
app.use(bodyParser.json())

app.get('/empresas', getEmpresas)
app.post('/empresas', postEmpresa)
app.put('/empresas/:id', putEmpresa)
app.delete('/empresas/:id', deleteEmpresa)

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000') //comentario
})
