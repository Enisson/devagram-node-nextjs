import type { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import jwt, { JwtPayload } from 'jsonwebtoken';

export const validarTokenJWT = (handler: NextApiHandler) => 
    async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {


        try{
            //Validei a chave de acesso
            const {MINHA_CHAVE_JWT} = process.env;
            if(!MINHA_CHAVE_JWT){
                return res.status(500).json({ erro: 'ENV chave JWT não informada na execução do projeto.' });
            }
    
            // Validei se tem algum header
            if(!req || !req.headers){
                return res.status(401).json({ erro: 'Não foi possível validar o token de acesso .' });
            }
    
            //validei se o metodo é diferente de options
            if(req.method !== 'OPTIONS'){
                //validei se veio o header de autorização
                const authorization = req.headers['authorization'];
                if(!authorization) {
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso .' });
                }
                //validei se veio o token
                const token = authorization.substring(7);
                if(!token){
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso .' });
                }
                //Uso o próprio jwt para verificar o token e se der certo vai voltar o objeto
                const decoded = jwt.verify(token,MINHA_CHAVE_JWT) as JwtPayload;
                if(!decoded) {
                    return res.status(401).json({ erro: 'Não foi possível validar o token de acesso .' });
                }
                //se voltar o objeto, a gente checa se já tem alguma query na requisição e se não tiver, a gente cria
                if(!req.query) {
                    req.query = {};
                }
                //E adiciona na query do usuário
                req.query.userId = decoded._id;
            }

        } catch(e){
            console.log(e);
            return res.status(401).json({ erro: 'Não foi possível validar o token de acesso.' });
        }
        return handler(req, res);
    };