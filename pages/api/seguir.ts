import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMondoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { SeguidorModel } from '../../models/SeguidorModel';
import { UsuarioModel } from '../../models/UsuarioModel';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const endpointSeguir = async(req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg>) => {

    try {
        //O método a ser utilizado
        if(req.method === 'PUT'){
            const {userId, id} = req?.query;
            //id do usuário vindo do token = usuário logado/autenticado
            const usuarioLogado = await UsuarioModel.findById(userId);
            if(!usuarioLogado){
                return res.status(400).json({ erro: 'Usuário logado não encontrado.' });
            }
            //id do usuário a ser seguido
            const usuarioASerSeguido = await UsuarioModel.findById(id);
            if(!usuarioASerSeguido){
                return res.status(400).json({ erro: 'Usuario a ser seguido não encontrado' });
            }
            //buscar se eu logado sigo ou nao esse usuario
            const euJaSigoEsseUsuario = await SeguidorModel.find({usuarioId: usuarioLogado._id, usuarioSeguidoId : usuarioASerSeguido._id});
            if(euJaSigoEsseUsuario && euJaSigoEsseUsuario.length > 0){
                //Se eu encontrei alguém, sinal que já sigo este usuário.
                euJaSigoEsseUsuario.forEach(async (e : any) => await SeguidorModel.findByIdAndDelete({_id : e._id}));
                usuarioLogado.seguindo--;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);
                usuarioASerSeguido.seguidores--;
                await UsuarioModel.findByIdAndUpdate({_id: usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({ msg: 'Deixou de seguir o usuário com sucesso!' })

            } else {
                //sinal que eu nao sigo esse usuario
                const seguidor = {
                    usuarioId : usuarioLogado._id ,
                    usuarioSeguidoId : usuarioASerSeguido._id
                };
                await SeguidorModel.create(seguidor);
                //adicionar um seguindo no usuário logado.
                usuarioLogado.seguindo++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioLogado._id}, usuarioLogado);

                //adicionar um seguidor no usuario seguido
                usuarioASerSeguido.seguidores++;
                await UsuarioModel.findByIdAndUpdate({_id : usuarioASerSeguido._id}, usuarioASerSeguido);

                return res.status(200).json({ msg: 'Usuário seguido com sucesso!' });
            }
        }
        return res.status(405).json({ erro: 'Método informado não existe' });
        
    } catch (e) {
        console.log(e)
        return res.status(500).json({ erro: 'Não foi possível seguir/deseguir o usuário informado.' })
    }

}

export default validarTokenJWT(conectarMondoDB(endpointSeguir));