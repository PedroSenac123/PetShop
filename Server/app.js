const express = require('express');
const app = express();
const port = 3001;
const connection = require('./db/connection');
const cors = require('cors');
app.use(cors());
app.use(express.json());




console.log("app.js rodando")
// Rotas CRUD para Clientes
app.get('/clientes', (req, res) => {
  console.log("Rota /clientes acessada");
  connection.query('SELECT * FROM clientes', (err, results) => {
      if (err) {
          return res.status(500).send('Erro ao buscar clientes.');
      }
      res.status(200).json(results);
  });
});



app.post('/clientes', (req, res) => {
  const { nomeCliente, telefoneCliente, enderecoCliente } = req.body;

  if (!nomeCliente || !telefoneCliente || !enderecoCliente) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const query = 'INSERT INTO clientes (nome, telefone, endereco) VALUES (?, ?, ?)';
  connection.query(query, [nomeCliente, telefoneCliente, enderecoCliente], (err, results) => {
    if (err) {
      console.error(err);  // Log do erro no servidor
      return res.status(500).json({ error: 'Erro ao adicionar cliente.' });
    }
    res.status(201).json({ message: 'Cliente adicionado com sucesso!', id: results.insertId });
  });
});

app.get('/clientes/:id', (req, res) => {
  const clienteId = req.params.id;
  connection.query('SELECT * FROM clientes WHERE id = ?', [clienteId], (err, results) => {
      if (err) return res.status(500).json({ error: 'Erro ao buscar cliente' });
      if (results.length === 0) return res.status(404).json({ error: 'Cliente não encontrado' });
      res.json(results[0]);
  });
});

app.put('/clientes/:id', (req, res) => {
  const { id } = req.params;
  const { nome, telefone, endereco } = req.body;

  const query = `UPDATE clientes SET nome = ?, telefone = ?, endereco = ? WHERE id = ?`;
  connection.query(query, [nome, telefone, endereco, id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao atualizar cliente', error: err });
    }
    res.status(200).json({ success: true, message: 'Cliente atualizado com sucesso' });
  });
});


app.delete('/clientes/:id', (req, res) => {
  const { id } = req.params;


  if (!id) {
    return res.status(400).json({ success: false, message: 'ID do cliente não fornecido' });
  }

  // Query para excluir o cliente do banco de dados
  const query = 'DELETE FROM clientes WHERE id = ?';

  connection.query(query, [id], (err, results) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Erro ao excluir cliente', error: err });
    }


    if (results.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'Cliente não encontrado' });
    }

    res.status(200).json({ success: true, message: 'Cliente excluído com sucesso' });
  });
});

// Rotas CRUD para Animais
app.get('/animais', (req, res) => {
  connection.query('SELECT * FROM animais', (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar animais', error: err });
    res.status(200).json({ success: true, data: results });
  });
});

app.get('/animais/:id', (req, res) => {
  const { id } = req.params;
  connection.query('SELECT * FROM animais WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao buscar animal', error: err });
    if (results.length === 0) return res.status(404).json({ success: false, message: 'Animal não encontrado' });
    res.status(200).json({ success: true, data: results[0] });
  });
});



app.post('/animais', (req, res) => {
  const { nome, idade, tipo, id_cliente } = req.body;
  const query = 'INSERT INTO animais (nome, idade, tipo, id_cliente) VALUES (?, ?, ?, ?)';
  connection.query(query, [nome, idade, tipo, id_cliente], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao adicionar animal', error: err });
    res.status(201).json({ success: true, message: 'Animal adicionado com sucesso', data: result });
  });
});

app.put('/animais/:id', (req, res) => {
  const { id } = req.params;
  const { nome, idade, tipo, id_cliente } = req.body;
  const query = 'UPDATE animais SET nome = ?, idade = ?, tipo = ?, id_cliente = ? WHERE id = ?';
  connection.query(query, [nome, idade, tipo, id_cliente, id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao atualizar animal', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Animal não encontrado' });
    res.status(200).json({ success: true, message: 'Animal atualizado com sucesso' });
  });
});


app.delete('/animais/:id', (req, res) => {
  const { id } = req.params;
  connection.query('DELETE FROM animais WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json({ success: false, message: 'Erro ao excluir animal', error: err });
    if (result.affectedRows === 0) return res.status(404).json({ success: false, message: 'Animal não encontrado' });
    res.status(200).json({ success: true, message: 'Animal excluído com sucesso' });
  });
});


app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});