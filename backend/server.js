console.log("API do Sistema de Tarefas iniciada");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "043024mP.",
  database: "projeto_tarefas",
});

db.connect((err) => {
  if (err) {
    console.log("Erro ao conectar:", err);
  } else {
    console.log("Conectado ao MySQL");
  }
});

// Rota de cadastro
app.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;

  db.query(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Usuário cadastrado!");
    },
  );
});

// Rota de criar tarefa
app.post("/tarefas", (req, res) => {
  const { titulo, descricao, usuario_id } = req.body;

  db.query(
    "INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES (?, ?, ?)",
    [titulo, descricao, usuario_id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.send("Tarefa criada!");
    },
  );
});

// Listar tarefas
app.get("/tarefas/:id", (req, res) => {
  const usuario_id = req.params.id;

  db.query(
    "SELECT * FROM tarefas WHERE usuario_id = ?",
    [usuario_id],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    },
  );
});

// Listar usuários
app.get("/usuarios", (req, res) => {
  db.query("SELECT id, nome, email FROM usuarios", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Deletar usuário
app.delete("/usuarios/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);

    res.send("Usuário excluído com sucesso");
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
