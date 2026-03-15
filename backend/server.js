console.log("API do Sistema de Tarefas iniciada");

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// conexão com banco
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

// ==============================
// CADASTRAR USUÁRIO
// ==============================
app.post("/register", (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).send("Preencha todos os campos");
  }

  db.query(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Erro ao cadastrar usuário");
      }

      res.send("Usuário cadastrado com sucesso");
    },
  );
});

// ==============================
// LOGIN
// ==============================
app.post("/login", (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).send("Informe email e senha");
  }

  db.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

      if (results.length === 0) {
        return res.status(401).send("Usuário não encontrado");
      }

      if (results[0].senha !== senha) {
        return res.status(401).send("Senha incorreta");
      }

      res.status(200).send("Login realizado com sucesso");
    },
  );
});

// ==============================
// LISTAR USUÁRIOS
// ==============================
app.get("/usuarios", (req, res) => {
  db.query("SELECT id, nome, email FROM usuarios", (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.json(results);
  });
});

// ==============================
// EXCLUIR USUÁRIO
// ==============================
app.delete("/usuarios/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.send("Usuário excluído com sucesso");
  });
});

// ==============================
// CRIAR TAREFA
// ==============================
app.post("/tarefas", (req, res) => {
  const { titulo, descricao, usuario_id } = req.body;

  db.query(
    "INSERT INTO tarefas (titulo, descricao, usuario_id) VALUES (?, ?, ?)",
    [titulo, descricao, usuario_id],
    (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send("Tarefa criada com sucesso");
    },
  );
});

// ==============================
// LISTAR TAREFAS
// ==============================
app.get("/tarefas/:id", (req, res) => {
  const usuario_id = req.params.id;

  db.query(
    "SELECT * FROM tarefas WHERE usuario_id = ?",
    [usuario_id],
    (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.json(results);
    },
  );
});

// ==============================

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
