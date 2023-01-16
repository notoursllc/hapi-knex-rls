require('dotenv').config();
const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const TenantKnexManager = new (require('./db/utils/TenantKnexManager.js'))();


const init = async () => {

    const server = Hapi.server({
        port: 10000,
        host: 'localhost',
        routes: {
            cors: {
                origin: process.env.CORS_ORIGINS
                    ? process.env.CORS_ORIGINS.split(',').map(url => url.trim())
                    : ['*'],
                credentials: true
            },
        }
    });

    await server.register(
        {
            plugin: require('@hapi/basic'),
            options: {}
        }
    );


    // server.ext('onRequest', (request, h) => {
    //     console.log("IN ON REQUEST", request)
    //     return h.continue;
    // });


    server.auth.strategy('storeauth', 'basic', {
        validate: async (request, tenant_id, api_key) => {
            try {
                const _knex = TenantKnexManager.getKnexForTenant(process.env.TENANT_ID_SUPERUSER);
                const data = await _knex('tenants')
                    .select('id', 'api_key', 'active')
                    .where({
                        id: tenant_id,
                        api_key: api_key,
                        active: true
                    });

                const tenantData = data?.[0];
                if(!tenantData) {
                    console.log('Unable to get tenant data');
                }

                return {
                    isValid: tenantData ? true : false,
                    credentials: tenantData || {}
                }
            }
            catch(err) {
                console.error(err);
            }
        }
    });


    /*
    * Hapi lifecycle hook 'onPostAuth' is called after the auth.strategy.
    */
    server.ext('onPostAuth', (request, h) => {
        try {
            const knex = TenantKnexManager.getKnexForRequest(request);

            if (!knex) {
                throw new Error('Error getting database connection for tenant');
            }

            request.knex = knex;
        }
        catch(err) {
            console.error(err);
            throw Boom.badRequest(err);
        }

        return h.continue;
    });


    server.route({
        method: 'GET',
        path: '/api/v1/users',
        options: {
            auth: {
                strategies: ['storeauth']
            }
        },
        handler: async (request, h) => {
            try {
                const data = await request.knex('users').select('*')
                return data;
            }
            catch(err) {
                console.error(err);
                throw Boom.badRequest(err);
            }
        }
    });


    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});


init();
