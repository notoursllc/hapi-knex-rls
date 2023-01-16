# Row level security (RLS) using Hapi and Knex

## Setup
- Create 2 users in your DB (both of which are NOT superusers).   
    1) A user that the app will use to query the DB.  Assign the name/password of this user to `DATA_DB_APPUSER` and `DATA_DB_APPUSER_PASSWORD` in .env
    
    ```
    CREATE USER ${process.env.DATA_DB_APPUSER} WITH LOGIN PASSWORD '${process.env.DATA_DB_APPUSER_PASSWORD}'
    ```

    2) A user that will be allowed to bypass RLS.  Assign the name/password of this user to `DATA_DB_APPUSER_BYPASSRLS` and `DATA_DB_APPUSER_BYPASSRLS_PASSWORD` in .env
    
    ```
    CREATE USER ${process.env.DATA_DB_APPUSER_BYPASSRLS} WITH LOGIN PASSWORD '${process.env.DATA_DB_APPUSER_BYPASSRLS_PASSWORD}'
    ```

- Define which tenant ID will be allowed to use the `DATA_DB_APPUSER_BYPASSRLS` user.  Assign this tenant ID to `TENANT_ID_BYPASSRLS` in .env

- Set your DBs credentials to `DATA_DB_USER` and `DATA_DB_PASSWORD` in .env.  The DB user and password are used only for doing DB migrations


## How it works

- The client sends credentials in the request header via basic auth (username: process.env.TENANT_ID, password: process.env.TENANT_API_KEY)

- The basic auth credentails are validated via the 'storeauth' stragegy in server/index.js.  If this validation is successful, an `auth` property is added to the `request` object, and a `credentails` prop is added to `request.auth` (`request.auth.credentails`).

- The `onPostAuth` hapi lifecycle hook is then called, which gets the knex DB connection for the given tenant via the "TenantKnexManager".  The TenantKnexManager uses the `request.auth.credentials.id` value that was set in the 'storeauth' strategy to set the `app.current_tenant` DB property value.  This is the key to enabling RLS (see the policy definitions in the DB migration files).  Finally, the `onPostAuth` hook sets a `knex` property on the request object (`request.knex`), which should be used to query the DB using RLS (`request.knex('users').select('*')`).
