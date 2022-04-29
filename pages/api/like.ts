import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMondoDB } from '../../middlewares/conectarMongoDB';
import {PublicacaoModel} from '../../models/PublicacaoModel'
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';
import { UsuarioModel } from '../../models/UsuarioModel';

const likeEndpoint = async (req : NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    try{
        //O tédodo que vai ser utilizado
        if(req.method === 'PUT') {
            //id da publicação
            const {id} = req?.query;
            //bater no banco para verificar se ela existe
            const publicacao = await PublicacaoModel.findById(id);
            if(!publicacao){
                return res.status(400).json({erro: 'Publicação não encontrada'});
            }
            // id do usuario que ta curtindo a publicação
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);
            if(!usuario){
                return res.status(400).json({erro: 'Usuário não encontrada'});
            }
            //Administrar os likes
            const indexDoUsuarioNoLike = publicacao.likes.findIndex((e : any) => e.toString() === usuario._id.toString());
            //se o index for > -1 sinal que ele já curte a foto
            if(indexDoUsuarioNoLike != -1){
                publicacao.likes.splice(indexDoUsuarioNoLike, 1);
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg: 'Publicação descurtida com sucesso!'});
            }else {
            //se o index for -1 sinal que ele não curte a foto
                publicacao.likes.push(usuario._id);
                await PublicacaoModel.findByIdAndUpdate({_id : publicacao._id}, publicacao);
                return res.status(200).json({msg: 'Publicação curtida com sucesso!'});
            }
        }
                
        return res.status(405).json({erro: 'Método informado não é válido'});
    }catch(e){
        console.log(e)
        return res.status(500).json({erro: 'Ocoreeu erro ao curtir/descutir uma publicação'});
    }

}

export default validarTokenJWT(conectarMondoDB(likeEndpoint));