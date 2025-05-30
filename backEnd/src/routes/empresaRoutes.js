// backend/routes/empresaRoutes.js
import express from 'express';
import * as AuthController from '../controllers/Empresa/AuthController.js'; // <-- CORRIGIDO AQUI!
import * as EmpresaModel from '../models/EmpresaModel.js';
import { routePrivate } from '../middleware/protectRoutes.js';
import * as EmpresaController from '../controllers/Empresa/EmpresaController.js'; 
import * as HorariosController from '../controllers/Empresa/horariosCotroller.js'; 
import { empresaPrivate } from '../middleware/protectRouterEmpresa.js'; // <-- CORRIGIDO AQUI!
const router = express.Router();

router.post('/addEmpresa', AuthController.criarEmpresa);
router.post('/loginEmpresa', AuthController.loginEmpresa);
router.get('/logout', AuthController.logout);
router.get('/empresa/horarios',empresaPrivate, HorariosController.getDatasConfiguradasByEmpresa);
router.post('/empresa/horarios',empresaPrivate, HorariosController.saveDatasConfiguradas);
router.delete('/empresa/horarios/:data',empresaPrivate, HorariosController.deleteDataConfigurada);



router.get('/verifyAuthStatus', routePrivate, (req, res) => {
  // Se o middleware routePrivate passou, significa que o usuário está autenticado
  res.status(200).json({ mensagem: 'Autenticado.' });
});
router.put('/marcar-personalizacao-completa', routePrivate, EmpresaController.marcarPersonalizacaoCompleta);

router.get('/empresa/dashboard/nome/:slug', async (req, res) => {
  const { slug } = req.params;

  try {
    const { data: lojaData, error: modelError } = await EmpresaModel.findNomeFantasiaBySlug(slug);

    if (modelError || !lojaData) {
      return res.status(404).json({ message: "Loja não encontrada para este slug." });
    }

    res.status(200).json({ nome_fantasia: lojaData.nome_fantasia });
  } catch (err) {
    console.error("Controller Error: Erro no endpoint /empresa/dashboard/nome/:slug:", err);
    res.status(500).json({ message: "Erro interno do servidor ao buscar nome da loja para o painel." });
  }
});

export default router;