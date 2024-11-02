const mongoose = require('mongoose');
const { type } = require('os');

// Definindo a estrutura
const schemaTarefa = new mongoose.Schema({
    nome: { type: String, unique: true, required: true },
    custo: { type: Number, required: true },
    dataLimite: { type: Date, required: true }
});

module.exports = mongoose.model('Tarefa', schemaTarefa);
