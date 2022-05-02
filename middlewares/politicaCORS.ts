import type {NextApiRequest, NextApiResponse, NextApiHandler} from 'next';
import type { RespostaPadraoMsg } from '../types/RespostaPadraoMsg';
import NextCors from 'nextjs-cors';

export const politicaCORS = (handler: NextApiHandler) => 
   async (req:NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {
       try {
           await NextCors(req, res, {
                origin : '*',
                methods: ['GET', 'POST', 'PUT'],
                optionsSuccessStatus : 200, // navegadores antigos dao problema quando se retorna 204 então com isso, vai retornar 200
           });

           return handler(req, res);

       } catch (error) {
           console.log('Erro ao tratar a politica de cors '+ error);
           return res.status(500).json({erro: 'Erro ao tratar a politica de cors '});
       }
   }