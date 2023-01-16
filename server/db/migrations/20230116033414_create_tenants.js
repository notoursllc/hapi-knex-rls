exports.up = async (knex) => {
    await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    return Promise.all([
        knex.schema.createTable(
            'tenants',
            (t) => {
                t.string('id').primary().unique().defaultTo(knex.raw('uuid_generate_v4()'));
                t.string('api_key').nullable();
                t.boolean('active').defaultTo(true);
                t.timestamp('created_at', true).notNullable().defaultTo(knex.fn.now());
                t.timestamp('updated_at', true).nullable();

                t.index([
                    'id'
                ]);
            }
        ),

        knex.raw('ALTER TABLE tenants ENABLE ROW LEVEL SECURITY'),
        // knex.raw('ALTER TABLE users FORCE ROW LEVEL SECURITY'),

        knex.raw(`
            CREATE POLICY "Enable select based on id"
            ON tenants
            AS PERMISSIVE FOR SELECT
            USING (id = current_setting('app.current_tenant')::text)
        `),

        knex.raw(`
            GRANT SELECT, UPDATE
            ON tenants
            TO ${process.env.DB_APP_ALL_USERS_GROUP_NAME}
        `)
    ]);
};

exports.down = (knex) => {
    return knex.schema.dropTableIfExists('tenants');
};
