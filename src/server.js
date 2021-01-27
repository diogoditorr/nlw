const express = require('express');
const server = express();

// Configura pasta pública
server.use(express.static("public"))

// Utilizando template engine
const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

// Configurar caminhos
server.get('/', (request, response) => {
    return response.render("index.njk", { })
})

server.get('/create-point', (request, response) => {
    return response.render("create-point.njk")
})

server.get('/search-results', (request, response) => {
    return response.render("search-results.njk")
})


// Ligar o servidor
server.listen(3000);