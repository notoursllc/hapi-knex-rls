exports.up = async function (knex) {
    return Promise.all([
        knex.schema.createTable('users', table => {
            table.increments('id').primary()
            table.string('tenant_id').notNullable()
            table.string('name').notNullable()
        }),

        knex.raw('ALTER TABLE users ENABLE ROW LEVEL SECURITY'),
        // knex.raw('ALTER TABLE users FORCE ROW LEVEL SECURITY'),

        knex.raw(`
            CREATE POLICY "Enable select based on tenant_id"
            ON users
            AS PERMISSIVE FOR SELECT
            USING (tenant_id = current_setting('app.current_tenant')::text)
        `),

        knex.raw(`
            GRANT SELECT, INSERT, UPDATE, DELETE
            ON users
            TO ${process.env.DATA_DB_APPUSER}
        `)
    ]);
}

exports.down = function (knex) {
    return knex.schema.dropTable('users')
}
