const express = require('express');
const Tarefa = require('../models/Tarefa');

const router = express.Router();

router.post('/', async (req, res) => {
    try{
        const tarefa = new Tarefa(req.body);
        await tarefa.save();
        res.status(201).json(tarefa);
    }catch(err){
        res.status(400).json({ message: err.message });
        const tarefa = new Tarefa(req.body);
        await tarefa.save();
        console.log("Valor já inseridos.");
    }
});

router.get('/', async (req, res) => {
    try{
        const tarefas = await Tarefa.find();
        res.json(tarefas);
    }catch(err){
        res.status(500).json({message: err.message});
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await Tarefa.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;