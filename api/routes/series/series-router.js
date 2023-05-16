const express = require('express');
const apiSeriesRouter = express.Router();

const endpoint = '/';

const knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: './dev.sqlite3'
      }
})

apiSeriesRouter.get('', function (req, res) {
    knex.select('*')
    .from('series').then(series => {
        res.json(series);
    })
});

apiSeriesRouter.get(endpoint + ':serieId', function (req, res) {
    knex('series').where('serieId', req.params.serieId).then(series => {
        res.json(series);
    })

});

apiSeriesRouter.post(endpoint, function (req, res) {
  knex('series').insert(req.body, ['serieId'])
  .then(series => {
    let id = series[0].serieId;
    res.status(201).json({message: `Série inserida com sucesso.`, id});
  })
  .catch(err => res.status(500).json({message: `Erro ao inserir série: ${err.message}`}))
});

apiSeriesRouter.put(endpoint + ':serieId', function (req, res) {
    knex('series').where('serieId', req.params.serieId).update(req.body, ['serieId'])
    .then(series => {
      let id = series[0].serieId;
      res.status(200).json({message: `Série alterada com sucesso.`, id});
    })
    .catch(err => res.status(500).json({message: `Erro ao inserir série: ${err.message}`}))
  });

apiSeriesRouter.delete(endpoint + ':serieId', function (req, res) {
    knex('series')
  .where('serieId', req.params.serieId)
  .del().then(resp =>{
    res.status(204).json(`Série excluida com sucesso`);
  }).catch(err => res.status(500).json({message: `Erro ao excluir série: ${err.message}`}));
});


module.exports = apiSeriesRouter;