exports.seed = function (knex) {
    return knex('tenants')
        .del()
        .then(function () {
            return knex('tenants').insert([
                { id: '11111111-1111-1111-1111-111111111111', api_key: '111',active: true },
                { id: '22222222-2222-2222-2222-222222222222', api_key: '222', active: true },
                { id: '33333333-3333-3333-3333-333333333333', api_key: '333', active: true },
                { id: '44444444-4444-4444-4444-444444444444', api_key: '444', active: false },
            ]);
        });
}
