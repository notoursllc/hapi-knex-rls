/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        // knex.raw(`CREATE USER ${process.env.DATA_DB_APPUSER} WITH LOGIN PASSWORD '${process.env.DATA_DB_APPUSER_PASSWORD}'`),
        knex.raw(`GRANT ALL PRIVILEGES ON DATABASE ${process.env.DATA_DB_NAME} to ${process.env.DATA_DB_APPUSER}`),

        knex.raw(`GRANT ALL PRIVILEGES ON DATABASE ${process.env.DATA_DB_NAME} to ${process.env.DATA_DB_APPUSER_BYPASSRLS}`),
        knex.raw(`ALTER ROLE ${process.env.DATA_DB_APPUSER_BYPASSRLS} BYPASSRLS`),

        // dont do this.
        // knex.raw(`SET ROLE ${process.env.DATA_DB_APPUSER}`)
    ]);
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};
