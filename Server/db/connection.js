const express = require('express');
const mysql = require('mysql2');

const bodyParser = require('body-parser');


const app = express();
const port = 3001;


app.use(bodyParser.json());

// Configuração do banco de dados
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',  
  password: 'root', 
  database: 'Petshop' 
});

connection.connect((err) => {
  if (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  } else {
    console.log('Conectado ao banco de dados');
  }
});



module.exports = connection;