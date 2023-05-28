const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3',
      }
})

let apiRouter = express.Router();

const endpoint = '/';

apiRouter.post(endpoint.concat('register'), (req, res) => {
    knex('usuario')
        .insert({
            nome: req.body.nome,
            login: req.body.login,
            senha: bcrypt.hashSync(req.body.senha, 8),
            email: req.body.email,
            roles: req.body.roles
        }, ['usuarioId'])
        .then((result) => {
            let usuario = result[0]
            res.status(200).json({"id": usuario.usuarioId })
            return
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao registrar usuario - ' + err.message
            })
        })
})

apiRouter.post(endpoint.concat('login'), (req, res) => {
    knex
        .select('*').from('usuario').where({ login: req.body.login })
        .then(usuarios => {
            if (usuarios.length) {
                let usuario = usuarios[0]
                let checkSenha = bcrypt.compareSync(req.body.senha, usuario.senha)
                if (checkSenha) {
                    var tokenJWT = jwt.sign({ id: usuario.usuarioId },
                        process.env.SECRET_KEY, {
                        expiresIn: 36000
                    })
                    res.status(200).json({
                        id: usuario.usuarioId,
                        login: usuario.login,
                        nome: usuario.nome,
                        roles: usuario.roles,
                        token: tokenJWT
                    })
                    return
                }
            }
            res.status(401).json({ message: 'Login ou senha incorretos' })
        })
        .catch(err => {
            res.status(500).json({
                message: 'Erro ao verificar login - ' + err.message
            })
        })
});

apiRouter.get('', function (req, res) {
    knex.select('*')
    .from('usuario').then(usuarios => {
        res.json(usuarios);
    })
});

module.exports = apiRouter;