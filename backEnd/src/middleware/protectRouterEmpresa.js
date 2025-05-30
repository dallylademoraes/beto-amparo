import * as empresas from "../models/EmpresaModel.js";
import JWT from "jsonwebtoken";

export const empresaPrivate = async (req, res, next) => {
    const token = req.cookies?.token_empresa;
  
    if (!token) {
      return res.status(401).json({ error: "Acesso não autorizado para empresa." });
    }
  
    try {
      const decoded = JWT.verify(token, process.env.JWT_SECRET);
  
      if (decoded.tipo !== "empresa") {
        return res.status(403).json({ error: "Acesso negado. Não é uma empresa." });
      }
  
      const empresa = await empresas.buscarEmpresaPorId(decoded.id);
  
      if (!empresa) {
        return res.status(401).json({ error: "Empresa não encontrada." });
      }
      
      req.IdEmpresa = decoded.id;
      req.user = empresa;
      req.userTipo = decoded.tipo;

      next();
    } catch (err) {
      return res.status(401).json({ error: "Token inválido ou expirado." });
    }
  };
  