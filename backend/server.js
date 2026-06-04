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

  db.query(
    "SELECT * FROM usuarios WHERE email = ? AND senha = ?",
    [email, senha],
    (err, results) => {
      if (err) return res.status(500).send(err);

      if (results.length > 0) {
        res.json(results[0]); // 🔥 manda o usuário completo
      } else {
        res.status(401).send("Email ou senha inválidos");
      }
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

  // 1️⃣ deleta tarefas primeiro
  db.query("DELETE FROM tarefas WHERE usuario_id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);

    // 2️⃣ depois deleta usuário
    db.query("DELETE FROM usuarios WHERE id = ?", [id], (err) => {
      if (err) return res.status(500).send(err);

      res.send("Usuário e tarefas excluídos com sucesso");
    });
  });
});

// ==============================
// CRIAR TAREFA
// ==============================
app.post("/tarefas", (req, res) => {
  const { titulo, descricao, prioridade, usuario_id } = req.body;

  db.query(
    "INSERT INTO tarefas (titulo, descricao, prioridade, usuario_id, status) VALUES (?, ?, ?, ?, ?)",
    [titulo, descricao, prioridade, usuario_id, "Pendente"],
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
      if (err) return res.status(500).send(err);
      res.json(results);
    },
  );
});

app.delete("/tarefas/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM tarefas WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).send(err);

    res.send("Tarefa excluída com sucesso");
  });
});

// ==============================

// EDITAR TAREFA
// ==============================
app.put("/tarefas/:id", (req, res) => {
  const id = req.params.id;

  const { titulo, descricao, prioridade } = req.body;

  db.query(
    "UPDATE tarefas SET titulo = ?, descricao = ?, prioridade = ? WHERE id = ?",
    [titulo, descricao, prioridade, id],
    (err) => {
      if (err) {
        return res.status(500).send(err);
      }

      res.send("Tarefa atualizada com sucesso");
    },
  );
});
// ==============================
// DASHBOARD
// ==============================
app.get("/dashboard/:id", (req, res) => {

  const usuario_id = req.params.id;

  db.query(
    `SELECT
      COUNT(*) as total,
      SUM(status = 'Concluída') as concluidas,
      SUM(status = 'Pendente') as pendentes
    FROM tarefas
    WHERE usuario_id = ?`,
    [usuario_id],
    (err, results) => {

      if (err) {
        return res.status(500).send(err);
      }

      res.json(results[0]);

    }
  );

});

// ==============================
// CONCLUIR TAREFA
// ==============================

app.put("/tarefas/concluir/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "UPDATE tarefas SET status = 'Concluída' WHERE id = ?",
    [id],
    (err) => {

      if (err) {
        return res.status(500).send(err);
      }

      res.send("Tarefa concluída com sucesso");

    }
  );

});

app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
