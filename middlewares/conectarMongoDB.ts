import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import mongoose from 'mongoose';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';


export const conectarMondoDB = (handler: NextApiHandler) =>
     async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

        // verificar se o banco já está conectado. Se estiver, seguir para o endpoint ou próximo middleware
        if(mongoose.connections[0].readyState){
            return handler(req, res);
        }

        // Já que não está conectado, vamos conectar
        // Vamois obter a variável de ambiente preenchida do env

        const { DB_CONEXAO_STRING } = process.env;

        // Caso a env estiver vazia aborta o uso do sistema e avisa o programador
        if(!DB_CONEXAO_STRING){
            return res.status(500).json({ erro: 'Env de configuração do banco não informada.' });
        }

        mongoose.connection.on('connected', () => console.log("Banco de dados conectado!"));
        mongoose.connection.on('error', error => console.log(`Ocorreu um erro ao tentar conectar ao banco: ${error}`));
        await mongoose.connect(DB_CONEXAO_STRING);

        // Agora posso seguir para o endpoint, pois estou conectado no banco
        return handler(req,res);
    }