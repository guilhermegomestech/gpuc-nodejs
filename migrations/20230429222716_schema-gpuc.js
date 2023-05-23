const { Knex } = require("knex");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
 return knex.schema.createTable('series', table => {
    table.primary(['serieId']);
    table.increments('serieId');
    table.string('nome', 128)
        .unique()
        .notNullable();
    table.integer('qtdTemporada', 30);
    table.integer('dtProducao')
    table.string('estudio');
    table.text('sinopse', 300);
  }).createTable('usuario', table => {
    table.primary(['usuarioId']);
    table.increments('usuarioId');
    table.string('nome', 200).notNullable();
    table.integer('email', 100).notNullable();
    table.integer('login', 100).unique().notNullable();
    table.string('senha', 100);
    table.string('roles', 200).defaultTo('user', { constraintName: 'df_table_user' }).notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema
    .dropTableIfExists('series')
    .dropTableIfExists('usuario');
};
