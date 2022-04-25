import type { NextApiRequest, NextApiResponse } from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMondoDB} from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';

const usuarioEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any >)=> {

    try{
        //pegar o id do usuário logado
        const {userId} = req.query;

        //busco usuário no banco
        const usuario = await UsuarioModel.findById(userId);
        usuario.senha = null;
        return res.status(200).json(usuario);

    }catch(e){
        console.log(e);
        return res.status(400).json({ erro: 'Não foi possível obter os dados do usuário' })
    }
    
}

export default validarTokenJWT(conectarMondoDB(usuarioEndpoint));