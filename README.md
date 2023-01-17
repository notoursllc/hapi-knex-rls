# Row level security (RLS) using Hapi and Knex


## Installation
```
git clone https://github.com/notoursllc/hapi-knex-rls.git
cd hapi-knex-rls
npm install
```

## Usage
1) Start a Postgres database
2) Create a `.env` file in the root folder (`hapi-knex-rls`), and add values as seen in `.env.example`.
3) Manually add the following users to your DB: 
    * The user as defined by `DB_APPUSER`
    * The user as defined by `DB_APPUSER_BYPASSRLS`
    * The group as defined by `DB_APP_ALL_USERS_GROUP_NAME`
    * (TODO: Could this user creation have been done in a migration file instead? I wasn't able to get a `knex.raw` script to execute a conditional `IF EXISTS ... ELSE ... END IF` script to create users)
3) Run DB migrations: `npm run knex:migrate`
4) Seed the DB with sample data: `npm run knex:seed`
    * Note: take a peek at "server/db/seed-data/tenants.js", so you know what tenant IDs / api keys can be used for testing on #6 below)
5) Start the server: `npm run dev`
6) This particular app uses basic authentication HTTP headers to identify the user ('tenant').  You can use Postman to call this API endpoint to fetch the sample 'users': http://localhost:10000/api/v1/users
    * Reminder to set Postman to use an Authorization type of "Basic Auth".   The username / password can be chosen from the tenant sample data file ("server/db/seed-data/tenants.js").  The "api_key" value is the password. To use Basic Auth credentials that will bypass RLS, set the Basic Auth username to the value of `TENANT_ID_BYPASSRLS` in .env (and the corresponding password (api_key) from "server/db/seed-data/tenants.js").


## How it works
- The client sends credentials in the request header via Basic Auth (See #6 above for where to find Basic Auth credentials)

- The basic auth credentails are validated via the 'storeauth' stragegy in server/index.js.  If this validation is successful, an `auth` property is added to the `request` object, and a `credentails` prop is added to `request.auth` (`request.auth.credentails`).

- The `onPostAuth` hapi lifecycle hook is then called, which gets the knex DB connection for the given tenant via the "TenantKnexManager".  The TenantKnexManager uses the `request.auth.credentials.id` value that was set in the 'storeauth' strategy to set the `app.current_tenant` DB property value.  This is the key to enabling RLS (see the policy definitions in the DB migration files).  Finally, the `onPostAuth` hook sets a `knex` property on the request object (`request.knex`), which should be used to query the DB using RLS (`request.knex('users').select('*')`).


## Inspiration:
Other repos that I referneced when building this one:
* https://github.com/awais-shafiq/knex_pg_rls
* https://github.com/franzon/postgres-rls-example


## SQL tips (mostly for my own reference)
Create a user
```
CREATE USER some_user_name WITH LOGIN PASSWORD 'some_secure_password'
```