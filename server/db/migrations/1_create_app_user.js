/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return Promise.all([
        knex.raw(`GRANT ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} to ${process.env.DB_APPUSER}`),

        // The DB user that will be able to bypass RLS:
        knex.raw(`GRANT ALL PRIVILEGES ON DATABASE ${process.env.DB_NAME} to ${process.env.DB_APPUSER_BYPASSRLS}`),
        knex.raw(`ALTER ROLE ${process.env.DB_APPUSER_BYPASSRLS} BYPASSRLS`),

        knex.raw(`
            GRANT ${process.env.DB_APP_ALL_USERS_GROUP_NAME} TO ${process.env.DB_APPUSER}, ${process.env.DB_APPUSER_BYPASSRLS}
        `),
    ]);
};


/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {

};
