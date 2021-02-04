const express = require("express");
const server = express();

// Banco de dados
const db = require("./database/db.js");

// Configura pasta pública
server.use(express.static("public"));

// Habilitar o uso do request.body na aplicação
server.use(express.urlencoded({ extended: true }));

// Utilizando template engine
 const nunjucks = require("nunjucks");
nunjucks.configure("src/views", {
    express: server,
    noCache: true,
});

// Configurar caminhos
server.get("/", (request, response) => {
    return response.render("index.njk", {});
});

server.get("/create-point", (request, response) => {
    return response.render("create-point.njk");
});

server.post("/savepoint", (request, response) => {
    const query = `
        INSERT INTO places (
            image,
            name,
            address,
            address2,
            state,
            city,
            items
        ) VALUES (?,?,?,?,?,?,?);
    `;

    const values = [
        request.body.image,
        request.body.name,
        request.body.address,
        request.body.address2,
        request.body.state,
        request.body.city,
        request.body.items,
    ];

    function afterInsertData(err) {
        if (err) {
            console.log(err)
            return request.send("Erro no cadastro!")
        }

        console.log('Cadastrado')
        console.log(this)

        return response.render("create-point.njk", { saved: true });
    }

    db.run(query, values, afterInsertData);
});

server.get("/search-results", (request, response) => {

    const search = request.query.search

    if (search == "") {
        return response.render("search-results.njk", { total: 0 });
    }


    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`, function (err, rows) {
        if (err) {
            return console.log(err);
        }

        console.log("Registros:");
        console.log(rows);

        const total = rows.length;

        return response.render("search-results.njk", { places: rows, total });
    });
});

// Ligar o servidor
server.listen(3000);
