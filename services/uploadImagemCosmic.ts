import multer from "multer";
import cosmicjs from 'cosmicjs';

//pegamos as variáveis de ambiente
const {
    CHAVE_GRAVACAO_AVATARES,
    CHAVE_GRAVACAO_PUBLICACOES,
    BUCKET_AVATARES,
    BUCKET_PUBLICACOES 
} = process.env;

//Criamos a instancia do cosmic
const Cosmic = cosmicjs();

//Com a instancia do cosmic criamos o nossos dois buckets, o de avatar e publicações.
const bucketAvatares = Cosmic.bucket({
    slug: BUCKET_AVATARES,
    write_key: CHAVE_GRAVACAO_AVATARES
});

const bucketPublicacoes = Cosmic.bucket({
    slug: BUCKET_PUBLICACOES,
    write_key: CHAVE_GRAVACAO_PUBLICACOES
});

//Pegamos o storage através do multer
const storage = multer.memoryStorage();
// criamos a opção de upload do multer em cima desse storage
const upload = multer({storage : storage});


const uploadImagemCosmic = async(req : any) => {
    if(req?.file?.originalname){

        if(!req?.file?.originalname.includes('.png') &&
            !req?.file?.originalname.includes('.jpg') &&
            !req?.file?.originalname.includes('.jpeg')){
                throw new Error('Extensão da imagem inválida.')
        }

        const media_object = {
            originalname: req.file.originalname,
            buffer : req.file.buffer
        };

        if(req.url && req.url.includes('publicacao')){
            return await bucketPublicacoes.addMedia({media : media_object});
        }else{
            return await bucketAvatares.addMedia({media : media_object});

        }

        return
    }
}

export {upload, uploadImagemCosmic};