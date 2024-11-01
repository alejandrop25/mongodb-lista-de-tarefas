const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const tarefaRoutes = require('./routes/tarefaRoutes');
const path = require('path');

const app = express();
const PORT = process.env.PORT | 3000;

connectDB();

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta 'frontend'
app.use(express.static(path.join(__dirname, '../frontend')));

// Rota para a raiz (opcional)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend', 'index.html'));
});
//define as rotas
app.use('/tarefas', tarefaRoutes);

//inicia o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
