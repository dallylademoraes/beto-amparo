import {
    listarEmpresas,
    cadastrarEmpresa,
    atualizarEmpresa,
    deletarEmpresa
  } from '../model/empresaModel.js'
  
  export async function getEmpresas(req, res) {
    try {
      const empresas = await listarEmpresas()
      res.status(200).json(empresas)
    } catch (error) {
      res.status(500).json({ erro: error.message })
    }
  }
  
  export async function postEmpresa(req, res) {
    try {
      const nova = req.body
      const empresa = await cadastrarEmpresa(nova)
      res.status(201).json(empresa)
    } catch (error) {
      res.status(500).json({ erro: error.message })
    }
  }
  
  export async function putEmpresa(req, res) {
    try {
      const id = req.params.id
      const dados = req.body
      const empresa = await atualizarEmpresa(id, dados)
      res.status(200).json(empresa)
    } catch (error) {
      res.status(500).json({ erro: error.message })
    }
  }
  
  export async function deleteEmpresa(req, res) {
    try {
      const id = req.params.id
      const empresa = await deletarEmpresa(id)
      res.status(200).json(empresa)
    } catch (error) {
      res.status(500).json({ erro: error.message })
    }
  }
  