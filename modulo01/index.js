const express = require("express");

const server = express();

// Atribui ao servidor express a "habilidade" de ler JSON do corpo requisição
server.use(express.json());

const users = ["Diego", "Cláudio", "Daniel"];

/***************
 * Middlewares *
 ***************/
// - Global
server.use((req, res, next) => {
  console.time("Request");
  console.log(`Método: ${req.method}; URL: ${req.url}`);

  next();

  console.timeEnd("Request");
});

// - Local
function checkUserExists(req, res, next) {
  if (!req.body.name) {
    return res.status(400).json({ error: "User name is required" });
  }

  return next();
}

function checkUserInArray(req, res, next) {
  const user = users[req.params.index];

  if (!user) {
    return res.status(400).json({ error: "User does not exists" });
  }

  req.user = user;

  return next();
}

/**********
 * Routes *
 **********/
// Query params = ?teste=1
server.get("/", (req, res) => {
  const { nome } = req.query;

  res.json({ message: `Hello ${nome}!` });
});

server.get("/users", (req, res) => {
  return res.json(users);
});

// Route params = /users/1
server.get("/users/:index", checkUserInArray, (req, res) => {
  return res.json(req.user);
});

// Request body = { "name": "Daniel", "email": "estudo@bootcamp.dev" }
server.post("/users", checkUserExists, (req, res) => {
  const { name } = req.body;

  users.push(name);

  return res.json(users);
});

server.put("/users/:index", checkUserInArray, checkUserExists, (req, res) => {
  const { index } = req.params;
  const { name } = req.body;

  users[index] = name;

  return res.json(users);
});

server.delete("/users/:index", checkUserInArray, (req, res) => {
  const { index } = req.params;

  users.splice(index, 1);

  return res.send();
});

server.listen(3000);
