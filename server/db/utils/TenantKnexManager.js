const Knex = require('knex');
const config = require('../../knexfile.js');
const MAX_CONNECTION_CACHE = 10;


class TenantKnexManager {
    constructor () {
        this.knexCache = new Map();
    }

    /*
    * Creates a knex connection if one does not already
    * exist in the cache for the tenant
    */
    getKnexForTenant(tenantId) {
        if (!tenantId) {
            return null;
        }

        let _knex = this.knexCache.get(tenantId);

        if (!_knex) {
            _knex = Knex(this.knexConfigForTenant(tenantId));
            this.knexCache.set(tenantId, _knex);
        }

        // If the cache is too big then remove the first item
		if (this.knexCache.size > MAX_CONNECTION_CACHE) {
            const firstCached = this.knexCache.entries().next();

            // destroy the knex connection
			firstCached.value[1].destroy();

            // remove from cache
            this.knexCache.delete(first.value[0])
		}

        return _knex;
    }


    getKnexForRequest(request) {
        return this.getKnexForTenant(request.auth.credentials.id);
    }

    /*
    * Sets the value of the 'app.current_tenant` database property.
    * The value is the given tenantId.
    * If the tenantId is the superuser (process.env.SUPERUSER_ID)
    * then the connection user/password is changed to the DB user that is the superuser
    *
    * @returns {} knex config
    */
    knexConfigForTenant(tenantId) {
        const knexConfig = {
            ...config,
            pool: {
                min: 2,
				max: 4,
                afterCreate: (conn, done) => {
                    conn.query(`SET app.current_tenant = "${tenantId}"`, function(err) {
                        if(err) {
                            console.error(err)
                        }
                        done(err, conn);
                    });
                }
            }
        };

        knexConfig.connection.user = tenantId === process.env.SUPERUSER_ID ? process.env.DATA_DB_SUPERUSER : process.env.DATA_DB_APPUSER;
        knexConfig.connection.password = tenantId === process.env.SUPERUSER_ID ? process.env.DATA_DB_SUPERPASS : process.env.DATA_DB_APPPASS;

        return knexConfig;
    }
}

module.exports = TenantKnexManager
