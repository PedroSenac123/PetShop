
async function adicionarCliente(event) {
  event.preventDefault();

  const nomeCliente = document.getElementById('nomeCliente').value;
  const telefoneCliente = document.getElementById('telefoneCliente').value;
  const enderecoCliente = document.getElementById('enderecoCliente').value;

  const response = await fetch('http://localhost:3001/clientes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nomeCliente,
      telefoneCliente,
      enderecoCliente
    })
  });

  if (response.ok) {
    const data = await response.json();
    console.log('Cliente adicionado com sucesso:', data);
    location.reload();
  } else {
    const error = await response.json();
    console.log('Erro ao adicionar cliente:', error);
  }
}



window.onload = () => {
  fetch('http://localhost:3001/clientes')
    .then(response => response.json())
    .then(data => {
      const listaClientes = document.getElementById('listaClientes');
      data.forEach(cliente => {
        const clienteItem = document.createElement('li');
        clienteItem.textContent = `${cliente.nome} - ${cliente.telefone} - ${cliente.endereco}`;
        

        const btn = document.createElement('button');
        btn.textContent = 'Ver Detalhes';
        btn.style.marginLeft = '10px';
        btn.onclick = () => abrirModal(cliente.id);

        clienteItem.appendChild(btn);
        listaClientes.appendChild(clienteItem);
      });
    })
    .catch(error => console.error('Erro ao carregar clientes:', error));
};

let clienteIdGlobal = null;

function abrirModal(clienteId) {
  // Carregar as informações do cliente para o modal
  fetch(`http://localhost:3001/clientes/${clienteId}`)
    .then(response => response.json())
    .then(cliente => {
      clienteIdGlobal = cliente.id;
      document.getElementById('idClienteEdit').value = cliente.id;
      document.getElementById('nomeClienteEdit').value = cliente.nome;
      document.getElementById('telefoneClienteEdit').value = cliente.telefone;
      document.getElementById('enderecoClienteEdit').value = cliente.endereco;

      document.getElementById('modal').style.display = "block";
    })
    .catch(error => console.error('Erro ao carregar cliente:', error));
}

// Fechar o modal
document.getElementById('close').onclick = () => {
  document.getElementById('modal').style.display = "none";
};

document.getElementById('formEditCliente').onsubmit = (event) => {
  event.preventDefault();

  const nome = document.getElementById('nomeClienteEdit').value;
  const telefone = document.getElementById('telefoneClienteEdit').value;
  const endereco = document.getElementById('enderecoClienteEdit').value;

  fetch(`http://localhost:3001/clientes/${clienteIdGlobal}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nome,
      telefone,
      endereco
    })
  })
  .then(response => response.json())
  .then(data => {
    console.log('Cliente atualizado:', data);
    document.getElementById('modal').style.display = "none";
    location.reload();  
  })
  .catch(error => console.error('Erro ao atualizar cliente:', error));
};

// Função para excluir o cliente
function excluirCliente() {
  if (!clienteIdGlobal) {
    console.error("ID do cliente não definido para exclusão.");
    return;
  }

  fetch(`http://localhost:3001/clientes/${clienteIdGlobal}`, {
    method: 'DELETE'
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao excluir cliente');
      }
      return response.json();
    })
    .then(data => {
      alert("Cliente excluído com sucesso.");
      document.getElementById('modal').style.display = "none";
      location.reload(); 
    })
    .catch(error => console.error('Erro ao excluir cliente:', error));
}


// Fecha o modal se o usuário clicar fora dele
window.onclick = (event) => {
  if (event.target == document.getElementById('modal')) {
    document.getElementById('modal').style.display = 'none';
  }
};  



function irParaPaginaAnimais() {
  window.location.href = '/Client/animais.html'; 
}
