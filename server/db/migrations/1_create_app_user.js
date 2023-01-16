/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.raw(`GRANT ALL PRIVILEGES ON DATABASE ${process.env.DATA_DB_NAME} to ${process.env.DATA_DB_APPUSER}`),

        // The DB user that will be able to bypass RLS:
        knex.raw(`GRANT ALL PRIVILEGES ON DATABASE ${process.env.DATA_DB_NAME} to ${process.env.DATA_DB_APPUSER_BYPASSRLS}`),
        knex.raw(`ALTER ROLE ${process.env.DATA_DB_APPUSER_BYPASSRLS} BYPASSRLS`),
    ]);
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};
