const cloneDeep = require('lodash.clonedeep');
const isProd = process.env.NODE_ENV === 'production';

const common = {
    client: 'postgresql',
    pool: {
        min: 2,
        max: 10,
        afterCreate: function (conn, done) {
            conn.query('SET timezone="UTC";', function (err) {
                done(err, conn);
            });

            conn.query(`SET app.current_tenant = "${process.env.TENANT_ID}"`, function (err) {
                if(err) {
                    console.error(err)
                }
                done(err, conn);
            });
        }
    },
    migrations: {
        directory: './db/migrations',
        tableName: 'knex_migrations'
    },
    seeds: {
        directory: './db/seeds'
    },
    connection: {
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD
    },
    debug: !isProd
};

const config = {
    development: cloneDeep(common),
    production: cloneDeep(common)
};

const env = isProd ? 'production' : 'development';
module.exports = config[env];
