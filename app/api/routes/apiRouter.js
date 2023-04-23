
const express = require('express');

let apiRouter = express.Router();

const endpoint = '/';
var lista_produtos = [
    { id: 1, descricao: "Produto 1", valor: 5.00, marca: "marca 1" },
    { id: 2, descricao: "Produto 2", valor: 10.00, marca: "marca 2" },
    { id: 3, descricao: "Produto 3", valor: 15.00, marca: "marca 3" },
];

//Obter lista de produtos
apiRouter.get(endpoint + 'produtos', function (req, res) {
    if (lista_produtos.length > 0) {
        res.status(200).json(lista_produtos);
    } else {
        res.status(404).json("Nenhum produto encontrado!");
    }
});

//Obter produto específico
apiRouter.get(endpoint + 'produtos/:produtoId', function (req, res) {
    if (produtoExiste(req.params.produtoId)) {
        res.status(200).json(lista_produtos.filter(item => item.id == req.params.produtoId));
    } else {
        res.status(404).json("Nenhum produto encontrado com o id especificado.");
    }

});

//Incluir um produto
apiRouter.post(endpoint + 'produtos/', function (req, res) {
    let produto = req.body;

    produto.id = buscarProximoIdProduto();
    adicionarProduto(produto);
    ordenarListaProdutos();
    res.status(200).json(lista_produtos);
});

//Alterar um produto
apiRouter.put(endpoint + 'produtos/:produtoId', function (req, res) {
    let produto = req.body;
    lista_produtos = removerProduto(req.params.produtoId);
    adicionarProduto(produto);
    ordenarListaProdutos();

    res.status(200).json(lista_produtos);
});

//Excluir um produto
apiRouter.delete(endpoint + 'produtos/:produtoId', function (req, res) {
    lista_produtos = removerProduto(req.params.produtoId);
    res.status(200).json(lista_produtos);
});


//Funções auxiliares
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