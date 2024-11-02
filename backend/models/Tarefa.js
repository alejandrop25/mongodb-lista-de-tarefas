const mongoose = require('mongoose');
const { type } = require('os');

// Definindo a estrutura
const schemaOrdemApresentacao = new mongoose.Schema( {seq: { type: Number, default: 1} }, {collection: 'ordemApresentacao'});


const ordemApresentacao = mongoose.model('ordemApresentacao', schemaOrdemApresentacao);

async function incrementarOrdemApresentacao() {
    const novaOrdem = await ordemApresentacao.findOneAndUpdate(
        {},  // Busca o único documento que temos
        { $inc: { seq: 1 } },
        { new: true, upsert: true } // Cria o documento se não existir
    );
    return novaOrdem.seq;
}

const schemaTarefa = new mongoose.Schema({
    nome: { type: String, unique: true, required: true },
    custo: { type: Number, required: true },
    dataLimite: { type: Date, required: true },
    ordemApresentacao: { type: Number }
});

const Tarefa = mongoose.model('Tarefa', schemaTarefa);

module.exports = {
    Tarefa,
    incrementarOrdemApresentacao
};
