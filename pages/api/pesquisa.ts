import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMondoDB } from '../../middlewares/conectarMongoDB';
import { validarTokenJWT } from '../../middlewares/validarTokenJWT';
import { UsuarioModel } from '../../models/UsuarioModel';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const pesquisaEndpoint = async (req: NextApiRequest, res: NextApiResponse<RespostaPadraoMsg | any[]>) => {

    try{
        //válido se o método é do tipo GET
        if(req.method === 'GET'){

            const { filtro } = req.query;

            if(!filtro || filtro.length < 2){
                return res.status(400).json({ erro: 'Por favor informar pelo menos 2 caracteres para a busca' });
            }

            const usuariosEncontrador = await UsuarioModel.find({
                $or: [{nome : {$regex : filtro, $options: 'i'}},
                    {email : {$regex : filtro, $options: 'i'}}
                ]   
                
            });

            return res.status(200).json(usuariosEncontrador);

        }
        return res.status(405).json({ erro: "Método informado não é válido " })
    }catch(e){
        console.log(e)
        return res.status(500).json({ erro: "Não foi possível buscar usuários: " + e })
    }

}

export default validarTokenJWT(conectarMondoDB(pesquisaEndpoint));