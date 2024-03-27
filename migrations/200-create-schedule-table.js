/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('schedule', {
        id: {
            type: 'bigserial',
            primaryKey: true,
        },
        name: {
            type: 'varchar(250)'
        },
        groupId: {
            type: 'bigint',
            unique: true,
        },
        userId: {
            type: 'bigint',
            unique: true,
        },
        startDate: {
            type: 'timestamp with time zone',
            default: pgm.func('now()')
        },
        endDate: {
            type: 'timestamp with time zone',
            default: pgm.func('now()')
        },
        isDone: {
            type: 'boolean'
        },
        visiting: {
            type: 'jsonb',
            comment: 'user_id: visited, good_reason, sick, not_visited'
        }
    }, {
        ifNotExists: true,
    });
};

exports.down = pgm => {
};