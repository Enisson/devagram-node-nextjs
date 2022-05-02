import type { NextApiRequest, NextApiResponse } from 'next';
import type {RespostaPadraoMsg} from '../../types/RespostaPadraoMsg'
import {validarTokenJWT} from '../../middlewares/validarTokenJWT';
import {conectarMondoDB} from '../../middlewares/conectarMongoDB';
import { UsuarioModel } from '../../models/UsuarioModel';
import nc from 'next-connect';
import {upload, uploadImagemCosmic} from '../../services/uploadImagemCosmic';
import { politicaCORS } from '../../middlewares/politicaCORS';

const handler = nc()
    .use(upload.single('file'))
    .put( async(req: any, res: NextApiResponse<RespostaPadraoMsg>)=> {
        try{
            //Se eu quero alterar o usuário, preciso primeiro pegar o usuado no DB
            const {userId} = req?.query;
            const usuario = await UsuarioModel.findById(userId);

            //Se o usuário retornou algo é porque ele existe
            if(!usuario) {
                return res.status(400).json({ erro: 'Usuário não encontrado'})
            }

            //Pego o nome
            const {nome} = req?.body;
            if(nome && nome.length > 2){
                usuario.nome = nome;
            }
            //Pego a imagem
            const {file} = req;
            if(file && file.originalname){
                const image = await uploadImagemCosmic(req);
                if(image && image.media && image.media.url){
                    usuario.avatar = image.media.url;
                }
            }

            //alterar os dados no DB
            await UsuarioModel.findByIdAndUpdate({_id: usuario.id}, usuario);

            return res.status(200).json({ msg: 'Usuário alterado com sucesso!'});
            

        }catch(e){
            console.log(e);
            return res.status(400).json({erro: 'Não foi possível atualizar o usuário..'})
        }
    })
    .get(async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any >)=> {

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
    });

export const config = {
    api: {
        bodyParser : false
    }
}

export default politicaCORS(validarTokenJWT(conectarMondoDB(handler)));