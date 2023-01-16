const tenants = require('../seed-data/tenants.js');
const tenantMembers = require('../seed-data/tenant-members.js');
const users = require('../seed-data/users.js');

/**
 * Knex.js's seed functionality does not provide any order of execution guarantees,
 * so this function will run the seeds in the order that we want
 *
 * @param knex
 * @param Promise
 * @returns {*}
 */
exports.seed = (knex, Promise) => {
    return tenants.seed(knex, Promise)
        .then(() => {
            return tenantMembers.seed(knex, Promise);
        })
        .then(() => {
            return users.seed(knex, Promise)
        });
};
