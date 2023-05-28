const express = require('express');
const jwt = require('jsonwebtoken')
const produtos = require('../../../data/produtos/produtos-faker');
const endpoint = '/';
const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
      }
})
let apiRouter = express.Router();

var lista_produtos =  [
        { id: 1, descricao: "Arroz parboilizado 5Kg", preco: 25.00, marca: "Tio João" },
        { id: 2, descricao: "Maionese 250gr", preco: 7.20, marca: "Helmans" },
        { id: 3, descricao: "Iogurte Natural 200ml", preco: 2.50, marca: "Itambé" },
        { id: 4, descricao: "Batata Maior Palha 300gr", preco: 15.20, marca: "Chipps" },
        { id: 5, descricao: "Nescau 400gr", preco: 8.00, marca: "Nestlé" },
    ]

// var lista_produtos = produtos.people;

let checkToken = (req, res, next) => {
    let authToken = req.headers["authorization"]
    if (!authToken) {
        res.status(401).json({ message: 'Token de acesso requerida' })
    }
    else {
        let token = authToken.split(' ')[1]
        req.token = token
    }
    jwt.verify(req.token, process.env.SECRET_KEY, (err, decodeToken) => {
        if (err) {
            console.log(err)
            res.status(401).json({ message: 'Acesso negado' })
            return
        }
        req.usuarioId = decodeToken.id
        next()
    })
};

let isAdmin = (req, res, next) => {
    console.log(req.usuarioId)
    knex
        .select('*').from('usuario').where({ usuarioId: req.usuarioId })
        .then((usuarios) => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let roles = usuario.roles.split(';')
                let adminRole = roles.find(i => i === 'ADMIN')
                if (adminRole === 'ADMIN') {
                    next()
                    return
                }
                else {
                    res.status(403).json({ message: 'Role de ADMIN requerida' })
                    return
                }
            }
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao verificar roles de usuário - ' + err.message
            })
        })
};

apiRouter.get(endpoint, function (req, res) {
    if (lista_produtos.length > 0) {
        res.status(200).json(lista_produtos);
    } else {
        res.status(404).json("Nenhum produto encontrado!");
    }
});

apiRouter.get(endpoint + ':produtoId', function (req, res) {
    console.log(`${lista_produtos}`)
    if (produtoExiste(req.params.produtoId)) {
        res.status(200).json(lista_produtos.filter(item => item.id == req.params.produtoId));
    } else {
        res.status(404).json("Nenhum produto encontrado com o id especificado.");
    }

});

apiRouter.post(endpoint, checkToken, isAdmin, function (req, res) {
    console.log(req.body)
    let produto = req.body;

    produto.id = buscarProximoIdProduto();
    adicionarProduto(produto);
    ordenarListaProdutos();
    res.status(200).json(lista_produtos);
});

apiRouter.put(endpoint + ':produtoId', checkToken, isAdmin, function (req, res) {
    console.log(req.body)
    let produto = req.body;
    lista_produtos = removerProduto(req.params.produtoId);
    adicionarProduto(produto);
    ordenarListaProdutos();

    res.status(200).json(lista_produtos);
});

apiRouter.delete(endpoint + ':produtoId', checkToken, isAdmin, function (req, res) {
    lista_produtos = removerProduto(req.params.produtoId);
    res.status(200).json(lista_produtos);
});

function adicionarProduto(produto) {
    lista_produtos.push(produto);
}

function removerProduto(idProduto) {
    return lista_produtos.filter(item => item.id != idProduto);
}

function produtoExiste(idProduto) {
    return lista_produtos.some(item => item.id == idProduto);
}

function ordenarListaProdutos() {
    lista_produtos = lista_produtos.sort((a, b) => a.id - b.id);
}

function buscarProximoIdProduto() {
    let nextIdProduto = 1;
    while (produtoExiste(nextIdProduto)) {
        nextIdProduto++;
    }

    return nextIdProduto;
}

module.exports = apiRouter;