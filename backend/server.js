const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tarefaRoutes = require('./routes/tarefaRoutes');
const { Tarefa } = require('./models/Tarefa');
const path = require('path');


const app = express();
const port = process.env.PORT | 3000;

connectDB();

app.use(express.json());

app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});

app.use('/tarefas', tarefaRoutes);
app.put('/tarefas/:id', async (req, res) => {
    const { id } = req.params;
    const { nome, custo, dataLimite } = req.body;
    const tarefaAtualizada = await Tarefa.findByIdAndUpdate(
        id, 
        { nome, custo, dataLimite }, 
    );
    res.send(tarefaAtualizada);
});
app.use(cors());
//inicia o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
