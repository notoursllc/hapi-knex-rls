
exports.up = (knex) => {
    return Promise.all([
        knex.schema.createTable(
            'tenant_members',
            (t) => {
                // t.increments('id').primary();
                t.string('id').primary().unique().defaultTo(knex.raw('uuid_generate_v4()'));

                t.string('tenant_id')
                    .notNullable()
                    .references('id')
                    .inTable('tenants');

                t.string('email').nullable();
                t.string('password').nullable();
                t.boolean('active').defaultTo(true);
                t.timestamp('created_at', true).notNullable().defaultTo(knex.fn.now());
                t.timestamp('updated_at', true).nullable();

                t.index([
                    'id',
                    'tenant_id'
                ]);
            }
        ),

        knex.raw('ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY'),
        // knex.raw('ALTER TABLE users FORCE ROW LEVEL SECURITY'),

        knex.raw(`
            CREATE POLICY "Enable select based on tenant_id"
            ON tenant_members
            AS PERMISSIVE FOR SELECT
            USING (tenant_id = current_setting('app.current_tenant')::text)
        `),

        knex.raw(`
            GRANT SELECT, INSERT, UPDATE, DELETE
            ON tenant_members
            TO ${process.env.DATA_DB_APPUSER}
        `),

        knex.raw(`
            GRANT SELECT, INSERT, UPDATE, DELETE
            ON tenant_members
            TO ${process.env.DATA_DB_APPUSER_BYPASSRLS}
        `)
    ]);
};

exports.down = (knex) => {
    return knex.schema.dropTableIfExists('tenant_members');
};
