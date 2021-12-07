//chamando módulos
const express = require("express");
const consign = require("consign");
const bodyParser = require("body-parser");
const mysql = require("mysql");
const path = require('path');
const session = require('express-session');

//executar express
const app = express();

//conexao banco de dados - passando um objeto com os dados necessários para criar a conexão
const conexao = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "prog_web_p2",
});

//mensagem informando se houve conexão com banco de dados
// método que faz a conexão a cada iteração
conexao.connect((erro) => {
  if (erro) {
    console.log(erro);
  } else {
    console.log("conectado com sucesso!!!")
    app.listen(3000, () => console.log("Servidor rodando na porta 3000"))
 }
})

//pacote que garante extração dos dados na página html
app.use(session({
    secret: 'secret',
    resave: true, //true is default value
    saveUninitialized: true //true is default value
}))
//bodyParser permite que leia o corpo do body e transforme em json
app.use(
    express.urlencoded({ 
        extended: true }))
app.use(express.json())


//Frontend
//Rota GET - para enviar formulário
app.get("/login", function (request, response) {
    response.sendFile(path.join(__dirname + '/login.html'))
})
app.get("/cadastro", function (request, response) {
    response.sendFile(path.join(__dirname + '/cadastro.html'))
})
//Rota GET - página inicial
app.get("/", (req, res) => res.send("Página inicial"))

app.get("/logado", (req, res) => res.send("Logado"))

//Rota de POST - requisição de dados de login(captura)
app.post('/login', function (req, res) {
    //extração da variáveis 
    let username = req.body.username
    let password = req.body.password
    if (username && password) {
        const queryDB = 'SELECT * FROM dados_usuario WHERE username = ? AND password = ?'
        conexao.query(queryDB, [username, password], function (erro, results, fields) {
            if (results.length > 0) {
                req.session.loggedin = true
                req.session.username = username
                res.redirect('/logado')
               console.log(`Usuário: ${username} e senha ${password}`)
            } else {
                res.send('Erro!!! Dados não compatíveis!!!')
            }
            res.end()
        })
    }
})

//INSERT INTO `dados_usuario` (`username`, `password`) VALUES ('hansolo', '1111');
app.post('/cadastro', function (req, res) {
    const username = req.body.username
    const password = req.body.password
  
    const query = `INSERT INTO dados_usuario (username, password) VALUES ('${username}', '${password}')`
  
    conexao.query(query, function (err) {
      if (err) {
        console.log(err)
      }  
      res.redirect('/login')
    })
  })



   
   



