# Row level security (RLS) using Hapi and Knex

## How it works

- .env contains credentials for the DB superuser (DATA_DB_SUPERUSER, DATA_DB_SUPERPASS) and app user (DATA_DB_APPUSER, DATA_DB_APPPASS)

- .env contains the tenant ID that is the superuser (SUPERUSER_ID)

- knexfile.js contains credentails for the superuser so migrations can be run without being restricted by RLS

- The client sends credentials in the request header via basic auth (username: process.env.TENANT_ID, password: process.env.TENANT_API_KEY)

- The basic auth credentails are validated via the 'storeauth' stragegy in server/index.js.  If this validation is successful, an `auth` property is added to the `request` object, and a `credentails` prop is added to `request.auth` (`request.auth.credentails`).

- The `onPostAuth` hapi lifecycle hook is then called, which gets the knex DB connection for the given tenant via the "TenantKnexManager".  The TenantKnexManager sets the `app.current_tenant` DB property value for the given tenant ID.  This is the key to enabling RLS (see the policy definitions in the DB migration files).  Finally, the `onPostAuth` hook sets a `knex` property on the request object (`request.knex`), which should be used to query the DB (`request.knex('users').select('*')`).
