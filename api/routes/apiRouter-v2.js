const express = require('express');
const apiRouterAPIv2 = express.Router();

const endpoint = '/';

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
      }
})

apiRouterAPIv2.get('', function (req, res) {
    knex.select('*')
    .from('series').then(series => {
        res.json(series);
    })
});

apiRouterAPIv2.get(endpoint + ':serieId', function (req, res) {
    knex('series').where('serieId', req.params.serieId).then(series => {
        res.json(series);
    })

});

apiRouterAPIv2.post(endpoint, function (req, res) {
  knex('series').insert(req.body, ['serieId'])
  .then(series => {
    let id = series[0].serieId;
    res.json({message: `Serie inserida com sucesso.`, id});
  })
  .catch(err => res.status(500).json({message: `Erro ao inserir serie: ${err.message}`}))
});

apiRouterAPIv2.put(endpoint + ':serieId', function (req, res) {
    knex('series').where('serieId', req.params.serieId).update(req.body, ['serieId'])
    .then(series => {
      let id = series[0].serieId;
      res.json({message: `Serie alterada com sucesso.`, id});
    })
    .catch(err => res.status(500).json({message: `Erro ao inserir serie: ${err.message}`}))
  });

apiRouterAPIv2.delete(endpoint + ':serieId', function (req, res) {
    knex('series')
  .where('serieId', req.params.serieId)
  .del().then(resp =>{
    res.json(`Serie excluida com sucesso`);
  });
});


module.exports = apiRouterAPIv2;