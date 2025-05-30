// src/controllers/client/Empresa/AuthController.js

import * as empresas from "#models/EmpresaModel.js"; // <-- USANDO ALIAS
import jwt from "jsonwebtoken";
import { inserirEmpresa } from '#models/EmpresaModel.js'; // <-- USANDO ALIAS
import bcrypt from 'bcrypt';
import validarDadosEmpresa from '#validators/EmpresaValidator.js'; // <-- USANDO ALIAS
import * as lojaModel from '#models/Loja.js'; // <-- USANDO ALIAS

export const loginEmpresa = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    try { // <-- Este é o bloco try principal da função

        const { error: loginError, data: empresaData } = await empresas.LoginEmpresa(email, senha);

        if (loginError || !empresaData) {
            return res.status(401).json({ error: loginError || 'Email ou senha inválidos' });
        }

        let slugDaLoja = null;
        let nomeFantasiaLoja = null;
        const { data: lojaInfo, error: lojaError } = await lojaModel.buscarIdLoja(empresaData.id);

        if (lojaError) {
            console.warn(`Aviso: Não foi possível encontrar a loja para a empresa ID ${empresaData.id}. Erro: ${lojaError}`);
        } else if (lojaInfo) {
            slugDaLoja = lojaInfo.slug_loja;
            nomeFantasiaLoja = lojaInfo.nome_fantasia;
        }

        const token = jwt.sign({
            id: empresaData.id,
            tipo: 'empresa'
        },
            process.env.JWT_SECRET, {
            expiresIn: '1d'
        });

        res.cookie("token_empresa", token, {
            httpOnly: false, // Alterei para false porque o frontend está lendo o cookie
            secure:  true,
            sameSite:  "none" ,
            maxAge: 24 * 60 * 60 * 1000,
            path: "/",
        });

        // **NOVO LOG AQUI: VERIFIQUE O COOKIE ANTES DE ENVIAR A RESPOSTA**
        console.log("Backend AuthController: Cookie 'token_empresa' setado com:", {
            tokenValue: token,
            secure: process.env.NODE_ENV === 'production' ? true : false,
            sameSite: process.env.NODE_ENV === 'production' ? "none" : "Lax",
            path: "/",
            maxAge: 24 * 60 * 60 * 1000,
        });
        console.log("Backend AuthController: Headers da resposta SET-COOKIE:", res.getHeaders()['set-cookie']); // Verifique o cabeçalho Set-Cookie

        res.status(200).json({
            mensagem: "Login realizado com sucesso",
            primeiroLoginFeito: empresaData.primeiro_login_feito,
            slugLoja: slugDaLoja,
            nomeFantasia: nomeFantasiaLoja,
        });

    } catch (error) { // <-- Este é o catch correspondente ao try principal
        console.error("Erro inesperado no loginEmpresa:", error);
        res.status(500).json({ error: "Erro ao fazer login: " + error.message });
    }
}; // <-- CHAVE DE FECHAMENTO CORRETA DA FUNÇÃO loginEmpresa

export const criarEmpresa = async (req, res) => {
    try {
        const dados = req.body;

        const errors = await validarDadosEmpresa(dados);
        if (Object.keys(errors).length > 0) {
            console.log(errors);
            return res.status(400).json({ errors });
        }

        const { nome, cnpj, responsavel, categoria, telefone, endereco, cidade, uf, site, email, senha, confirmarSenha } = dados;

        const senhaHash = await bcrypt.hash(senha, 10);

        const { error } = await inserirEmpresa({
            nome,
            cnpj,
            responsavel,
            categoria,
            telefone,
            endereco,
            cidade,
            uf,
            site,
            email,
            senha: senhaHash
        });

        if (error) {
            return res.status(500).json({ mensagem: error });
        }

        return res.status(201).json({ mensagem: 'Empresa cadastrada com sucesso!' });
    } catch (error) {
        console.error("Erro inesperado em criarEmpresa:", error);
        return res.status(500).json({ mensagem: error.message || 'Erro ao criar empresa.' });
    }
};


export const logout = (req, res) => {
    res.clearCookie('token_empresa', {
        httpOnly: false, // Alterei para false porque o frontend está lendo o cookie
        secure: process.env.NODE_ENV === 'production' ? true : false,
        sameSite: process.env.NODE_ENV === 'production' ? "none" : "Lax",
        path: '/',
    });

    res.status(200).send('Logout realizado com sucesso');
};