import type { NextApiRequest, NextApiResponse } from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMondoDB} from '../../middlewares/conectarMongoDB';
import {UsuarioModel} from '../../models/UsuarioModel';
import {PublicacaoModel} from '../../models/PublicacaoModel';

const feedEndpoint = async (req : NextApiRequest, res : NextApiResponse<RespostaPadraoMsg | any>) => {
    try{
        if(req.method === 'GET'){
            //receber uma informação do id do usuário que eu quero
            //buscar o feed.
            if(req?.query?.id){
                //Agora que tenho o id do usuário, válido se é um usuário válido
                const usuario = await UsuarioModel.findById(req?.query?.id);
                if(!usuario){
                    return res.status(400).json({ erro : 'Usuário não encontrado' });
                }

                //Busco suas publicações na tabela de publicações
                const publicacoes = await PublicacaoModel.find({idUsuario : usuario._id})
                .sort({data : -1});

                return res.status(200).json(publicacoes);
            }
        }
        return res.status(405).json({ erro : 'Método informado não é válido!' });
    }catch(e){
        console.log(e);
    }
    return res.status(400).json({ erro : 'Não foi possível obter o feed' });
};

export default validarTokenJWT(conectarMondoDB(feedEndpoint));