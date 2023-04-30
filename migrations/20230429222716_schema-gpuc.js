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
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('series');
};
