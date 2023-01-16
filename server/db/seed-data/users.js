
exports.seed = function (knex) {
    return knex('users')
        .del()
        .then(function () {
            return knex('users').insert([
                { tenant_id: '11111111-1111-1111-1111-111111111111', name: 'John' },
                { tenant_id: '11111111-1111-1111-1111-111111111111', name: 'Doe' },
                { tenant_id: '11111111-1111-1111-1111-111111111111', name: 'Foo' },
                { tenant_id: '22222222-2222-2222-2222-222222222222', name: 'Bar' },
                { tenant_id: '22222222-2222-2222-2222-222222222222', name: 'Lorem' },
                { tenant_id: '22222222-2222-2222-2222-222222222222', name: 'Ipsum' },
                { tenant_id: '33333333-3333-3333-3333-333333333333', name: 'Dolor' },
                { tenant_id: '33333333-3333-3333-3333-333333333333', name: 'Sit' },
                { tenant_id: '33333333-3333-3333-3333-333333333333', name: 'Amet' }
            ]);
        });
}
