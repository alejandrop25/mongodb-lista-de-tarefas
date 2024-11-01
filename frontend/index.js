async function carregarTarefas() {
    const response = await fetch('http://localhost:3000/tarefas');
    const tarefas = await response.json();
    
    const listaTarefas = document.getElementById('lista-tarefas');
    listaTarefas.innerHTML = ''; // Limpa a lista antes de adicionar novas tarefas

    tarefas.forEach(tarefa => {
        const li = document.createElement('li');
        li.textContent = `${tarefa.nome} - R$${tarefa.custo} - ${tarefa.dataLimite} - Ordem: ${tarefa.ordemApresentacao}`;
        listaTarefas.appendChild(li);
    });
}

// Adiciona um evento ao formulário
document.getElementById('form-tarefa').addEventListener('submit', async (e) => {
    e.preventDefault();

    const novaTarefa = {
        nome: document.getElementById('nome').value,
        custo: document.getElementById('custo').value,
        dataLimite: document.getElementById('dataLimite').value,
        ordemApresentacao: document.getElementById('ordemApresentacao').value,
    };

    await fetch('http://localhost:3000/tarefas', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaTarefa),
    });

    // Atualiza a lista de tarefas após adicionar uma nova tarefa
    await carregarTarefas();
});

// Carrega as tarefas quando a página é carregada
window.onload = carregarTarefas;