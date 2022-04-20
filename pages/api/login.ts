import type { NextApiRequest, NextApiResponse } from 'next';
import { conectarMondoDB } from '../../middlewares/conectarMongoDB';
import type { RespostaPadraoMsg } from '../../types/RespostaPadraoMsg';

const endpointLogin  = (
    req: NextApiRequest,
    res:  NextApiResponse<RespostaPadraoMsg>
) => {
    if(req.method === 'POST'){
        const {login, senha} = req.body;

        if(login === 'admin@admin.com' && senha === 'Admin@123'){
            return res.status(200).json({ msg: 'Usuário autenticado com sucesso!' })
        }
        return res.status(400).json({ erro: 'Usuário ou senha não encontrados!' });
    }
    return res.status(405).json({ erro: 'Metodo informado não é válido!' });
}

// primeiro a requisição vai passar no middleware pra depois executar o endpointLogin.
export default conectarMondoDB(endpointLogin);