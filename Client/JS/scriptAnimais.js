let animalId = null;

document.getElementById('animalForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const nomeAnimal = document.getElementById('nomeAnimal').value;
    const idadeAnimal = document.getElementById('idadeAnimal').value;
    const tipoAnimal = document.getElementById('tipoAnimal').value;
    const idDonoAnimal = document.getElementById('idDonoAnimal').value;
  
    try {
      const response = await fetch('http://localhost:3001/animais', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nome: nomeAnimal,
          idade: idadeAnimal,
          tipo: tipoAnimal,
          id_cliente: idDonoAnimal
        })
      });
  
      if (response.ok) {
        const data = await response.json();
        console.log('Animal adicionado com sucesso:', data);
        location.reload(); 
      } else {
        const error = await response.json();
        console.error('Erro ao adicionar animal:', error);
      }
    } catch (error) {
      console.error('Erro ao enviar a requisição:', error);
    }
  });

window.onload = () => {
    fetch('http://localhost:3001/animais')
        .then(response => response.json())
        .then(data => {
            console.log(data); 
            const listaAnimais = document.getElementById('listaAnimais');
            
            const animais = data.animais || []; 
            data.data.forEach(animal => {
                const animalItem = document.createElement('li');
                animalItem.textContent = `${animal.nome} - ${animal.idade} anos - ${animal.tipo} - ID_Cliente:${animal.id_cliente}`;

                const btn = document.createElement('button');
                btn.textContent = 'Ver Detalhes';
                btn.style.marginLeft = '10px';
                btn.onclick = () => abrirModal(animal);

                animalItem.appendChild(btn);
                listaAnimais.appendChild(animalItem);
            });
        })
        .catch(error => console.error('Erro ao carregar animais:', error));
};

document.getElementById('editarBtn').onclick = () => {
    const nome = document.getElementById('nome').value;
    const idade = document.getElementById('idade').value;
    const tipo = document.getElementById('tipo').value;
  
    
  
    fetch(`http://localhost:3001/animais/${animalId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        nome,
        idade,
        tipo
      })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Animal atualizado:', data);
      document.getElementById('modal').style.display = 'none'; 
      location.reload(); 
    })
    .catch(error => console.error('Erro ao atualizar o animal:', error));
  };
  
  


  
  

function abrirModal(animal) {
  animalId = animal.id;
  document.getElementById('nome').value = animal.nome;
  document.getElementById('idade').value = animal.idade;
  document.getElementById('tipo').value = animal.tipo;
  document.getElementById('modal').style.display = 'block';
}

function fecharModal() {
  document.getElementById('modal').style.display = 'none';
}

async function excluirAnimal() {
  try {
    const response = await fetch(`http://localhost:3001/animais/${animalId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      alert('Animal excluído com sucesso');
      fecharModal();
      location.reload();
    } else {
      alert('Erro ao excluir animal');
    }
  } catch (error) {
    console.error('Erro ao excluir animal:', error);
  }
}
