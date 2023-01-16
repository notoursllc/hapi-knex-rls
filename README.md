## How it works

- .env contains credentials for the DB superuser (DATA_DB_SUPERUSER, DATA_DB_SUPERPASS) and app user (DATA_DB_APPUSER, DATA_DB_APPPASS)

- .env contains the tenant ID that is the superuser (SUPERUSER_ID)

- knexfile.js contains credentails for the superuser so migrations can be run without being restricted by RLS

- The client sends credentials in the request header via basic auth

- The credentails are validated via the 'storeauth' stragegy in server/index.js.  If this validation is successful, an `auth` property is added to the `request` object, and a `credentails` prop is added to `request.auth` (`request.auth.credentails`).

- The `onPostAuth` hapi lifecycle hook is then called, which gets the knex DB connection for the given tenant.  A `knex` property is added to the request (`request.knex`), which should be used to query the DB (`request.knex('users').select('*')`).
