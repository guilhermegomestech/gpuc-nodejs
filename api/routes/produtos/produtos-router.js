const express = require('express');
const produtos = require('../../../data/produtos/produtos-faker');

let apiRouter = express.Router();

const endpoint = '/';
var lista_produtos = produtos.people;

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

apiRouter.post(endpoint, function (req, res) {
    let produto = req.body;

    produto.id = buscarProximoIdProduto();
    adicionarProduto(produto);
    ordenarListaProdutos();
    res.status(200).json(lista_produtos);
});

apiRouter.put(endpoint + ':produtoId', function (req, res) {
    let produto = req.body;
    lista_produtos = removerProduto(req.params.produtoId);
    adicionarProduto(produto);
    ordenarListaProdutos();

    res.status(200).json(lista_produtos);
});

apiRouter.delete(endpoint + ':produtoId', function (req, res) {
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