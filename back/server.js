const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

// Configuração do banco de dados
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '29241888F',
    database: 'siteprojeto'
});

db.connect((err) => {
    if (err) {
        console.error('Erro ao conectar ao banco de dados:', err);
        throw err;
    }
    console.log('Conectado ao banco de dados MySQL');
});

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rota para cadastro
app.post('/register', (req, res) => {
    const { nome, username, password } = req.body;
    console.log('Recebido cadastro:', { nome, username, password });
    const query = 'INSERT INTO users (nome, username, password) VALUES (?, ?, ?)';
    db.query(query, [nome, username, password], (err, result) => {
        if (err) {
            console.error('Erro ao registrar usuário:', err);
            res.status(500).send('Erro ao registrar usuário');
            return;
        }
        res.send('Usuário registrado com sucesso!');
    });
});

// Rota para login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Recebido login:', { username, password });
    const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            console.error('Erro ao fazer login:', err);
            res.status(500).send('Erro ao fazer login');
            return;
        }
        if (results.length > 0) {
            res.json({ success: true, nome: results[0].nome });
        } else {
            res.json({ success: false });
        }
    });
});

// Rota para enviar comentário
app.post('/comment', (req, res) => {
    const { comment, username } = req.body;
    const query = 'INSERT INTO comments (text, username) VALUES (?, ?)';
    db.query(query, [comment, username], (err, result) => {
        if (err) {
            console.error('Erro ao enviar comentário:', err);
            res.status(500).send('Erro ao enviar comentário');
            return;
        }
        res.send('Comentário enviado com sucesso!');
    });
});

// Rota para obter comentários
app.get('/comments', (req, res) => {
    const query = 'SELECT * FROM comments';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erro ao obter comentários:', err);
            res.status(500).send('Erro ao obter comentários');
            return;
        }
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});