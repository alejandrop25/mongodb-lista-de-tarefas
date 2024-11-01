const mongoose = require('mongoose');
const { type } = require('os');

//definindo a estrutura
const schemaTarefa = new mongoose.Schema({
    nome: { type: String, unique: true, required: true },
    custo: { type: Number, required: true },
    dataLimite: { type: Date, required: true },
    ordemApresentacao: { type:Number, unique: true, required: true }
});

module.exports = mongoose.model('Tarefa', schemaTarefa);