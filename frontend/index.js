async function carregarTarefas() {
    try{
        const response = await fetch('http://localhost:3000/tarefas');
        const tarefas = await response.json();
        console.log(tarefas); // Verifique se isso está retornando um array
        renderTarefas(tarefas);
    }catch(err){
        console.error(err);
    }
}

function renderTarefas(tarefas) {
    const listaTarefas = document.getElementById('lista-tarefas');
    listaTarefas.innerHTML = ''; 

    tarefas.forEach((tarefa, index) => {
        const li = document.createElement('li');
        li.setAttribute('draggable', true);
        const custo = parseFloat(tarefa.custo);
        if (custo >= 1000) {
            li.style.backgroundColor = 'yellow'; 
        }
        li.innerHTML = `
            <img src='https://www.svgrepo.com/show/459043/drag-handle.svg' width='25px'>
            <em>Tarefa</em> ${tarefa.nome} | <em>Custo</em> R$${tarefa.custo} | <em>Prazo</em> ${tarefa.dataLimite} }
            <button class="edit btn btn-primary">✏️</button>
            <button class="delete btn btn-danger">🗑️</button>
            <button class="up btn btn-dark" ${index === 0 ? 'disabled' : ''}>&#x25B2;</button>
            <button class="down btn btn-dark" ${index === tarefas.length - 1 ? 'disabled' : ''}>&#x25BC;</button>
        `;

        addDragAndDropListeners(li, tarefas, index);
        
        li.querySelector('.up').addEventListener('click', () => moveTask(tarefas, index, index - 1));
        li.querySelector('.down').addEventListener('click', () => moveTask(tarefas, index, index + 1));

        li.querySelector('.edit').addEventListener('click', () => editarTarefa(tarefa));
        li.querySelector('.delete').addEventListener('click', () => excluirTarefa(tarefa._id));

        listaTarefas.appendChild(li);
    });
}

function editarTarefa(tarefa) {
    document.getElementById('editNome').value = tarefa.nome;
    document.getElementById('editCusto').value = tarefa.custo;
    document.getElementById('editDataLimite').value = tarefa.dataLimite;

    // Armazena o ID da tarefa em um campo oculto
    document.getElementById('tarefaId').value = tarefa._id;
    
    // Exibe o popup (Bootstrap modal)
    $('#editPopup').modal('show');
}

document.getElementById('saveEdit').addEventListener('click', async () => {
    const tarefaId = document.getElementById('tarefaId').value;
    const novaTarefa = {
        nome: document.getElementById('editNome').value,
        custo: document.getElementById('editCusto').value,
        dataLimite: document.getElementById('editDataLimite').value,
    };

    // Verifica se o novo nome já existe, excluindo a tarefa atual
    const response = await fetch(`http://localhost:3000/tarefas?nome=${novaTarefa.nome}`);
    const tarefasExistentes = await response.json();
    const tarefaAtual = tarefasExistentes.find(t => t._id === tarefaId);

    if (tarefasExistentes.length > 0 && !tarefaAtual) {
        alert('Esse nome de tarefa já existe. Por favor, escolha outro nome.');
        return;
    }

    // Atualiza a tarefa
    await fetch(`http://localhost:3000/tarefas/${tarefaId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(novaTarefa),
    });

    // Fecha o popup
    $('#editPopup').modal('hide');

    // Recarrega a lista de tarefas
    await carregarTarefas();
});
document.getElementById('cancelEdit').addEventListener('click', async () => {
    $('#editPopup').modal('hide');
});

async function excluirTarefa(tarefaId) {
    const confirmacao = confirm("Tem certeza que deseja deletar esse item?");
    if(confirmacao){
        await fetch(`http://localhost:3000/tarefas/${tarefaId}`, {
            method: 'DELETE',
        });
    } else {
        return;
    }

    await carregarTarefas(); // Recarregar a lista de tarefas após exclusão
}

function moveTask(tarefas, fromIndex, toIndex) {
    if (toIndex < 0 || toIndex >= tarefas.length) return; 

    const [movedTask] = tarefas.splice(fromIndex, 1);
    tarefas.splice(toIndex, 0, movedTask);

    renderTarefas(tarefas);
}

function addDragAndDropListeners(li, tarefas, index) {
    li.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('text/plain', index); 
        e.currentTarget.classList.add('dragging'); 
    });

    li.addEventListener('dragend', () => {
        li.classList.remove('dragging');
    });

    li.addEventListener('dragover', (e) => {
        e.preventDefault(); 
    });

    li.addEventListener('drop', (e) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData('text/plain'); 
        const draggedItem = tarefas[draggedIndex];

        tarefas.splice(draggedIndex, 1);
        tarefas.splice(index, 0, draggedItem); 

        renderTarefas(tarefas);
    });
}

document.getElementById('form-tarefa').addEventListener('submit', async (e) => {
    e.preventDefault();

    const tarefaId = document.getElementById('tarefaId').value; // Obter ID da tarefa se existir
    const novaTarefa = {
        nome: document.getElementById('nome').value,
        custo: document.getElementById('custo').value,
        dataLimite: document.getElementById('dataLimite').value,
    };

    if (tarefaId) {
        // Atualizar tarefa existente
        await fetch(`http://localhost:3000/tarefas/${tarefaId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaTarefa),
        });
    } else {
        // Criar nova tarefa
        await fetch('http://localhost:3000/tarefas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(novaTarefa),
        });
    }
    document.getElementById('tarefaId').value = '';

    await carregarTarefas();
});

function intro() {
    const dataCompleta = new Date();
    const horaAtual = dataCompleta.getHours();
    let msg;

    if (horaAtual >= 5 && horaAtual < 12) {
        msg = 'Bom dia, USER👋';
    } else if (horaAtual >= 12 && horaAtual < 18) {
        msg = 'Boa tarde, USER👋';
    } else {
        msg = 'Boa noite, USER👋';
    }

    document.getElementById('intro').textContent = msg;
}

function dataAtual() {
    const dataCompleta = new Date();
    const dia = String(dataCompleta.getDate()).padStart(2, '0'); // Adiciona zero à esquerda se necessário
    const mes = String(dataCompleta.getMonth() + 1).padStart(2, '0'); // Meses começam do zero
    const ano = dataCompleta.getFullYear();

    const dataFormatada = `${dia}/${mes}/${ano}`;
    document.getElementById('data-atual').textContent = dataFormatada;
}

function init() {
    intro();
    carregarTarefas();
    dataAtual();
}

window.onload = init;