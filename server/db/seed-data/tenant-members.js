exports.seed = function (knex) {
    return knex('tenant_members')
        .del()
        .then(function () {
            return knex('tenant_members').insert([
                { tenant_id: '11111111-1111-1111-1111-111111111111', email: 'tenant1@gmail.com', password: '', active: true },
                { tenant_id: '22222222-2222-2222-2222-222222222222', email: 'tenant2@gmail.com', password: '', active: true },
                { tenant_id: '22222222-2222-2222-2222-222222222222', email: 'tenant2a@gmail.com', password: '', active: true },
                { tenant_id: '33333333-3333-3333-3333-333333333333', email: 'tenant3@gmail.com', password: '', active: true },
                { tenant_id: '33333333-3333-3333-3333-333333333333', email: 'tenant3a@gmail.com', password: '', active: true },
                { tenant_id: '44444444-4444-4444-4444-444444444444', email: 'tenant4@gmail.com', password: '', active: true },
                { tenant_id: '44444444-4444-4444-4444-444444444444', email: 'tenant4a@gmail.com', password: '', active: true }
            ]);
        });
}
