import mongoose, { Schema } from 'mongoose';

const UsuarioSchema = new Schema({
    nome : {type : String, required : true},
    email : {type : String, required : true},
    senha : {type : String, required : true},
    avatar : {type : String, required : false},
    seguidores : {type : Number, default : 0},
    seguindo : {type : Number, default : 0},
    publicacoes : {type : Number, default : 0},
});

// a gente vai exportar o UsuarioModel (que é onde as operações de banco de dados são realizadas)
// onde vamos chegar se, dentro dos models do mongoose já existe o model de nome usuarios. Se a tabela existir, só pega a tabela
// e se não existir, criamos a tabela passando o UsuarioSchema.
export const UsuarioModel = (mongoose.models.usuarios || mongoose.model('usuarios', UsuarioSchema));