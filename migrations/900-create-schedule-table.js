/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('schedule', {

        id: {
            type: 'bigserial',
            primaryKey: true,
        },

        sequenceId: {
            type: 'uuid',
            notNull: true,
        },

        name: {
            type: 'varchar(250)',
        },
        
        groupId: {
            type: 'bigint',
        },

        userId: {
            type: 'bigint',
        },

        startDate: {
            type: 'timestamp with time zone',
            default: pgm.func('now()'),
        },

        endDate: {
            type: 'timestamp with time zone',
            default: pgm.func('now()'),
        },

        isDone: {
            type: 'boolean',
            notNull: true,
            default: false,
        },

        visiting: {
            type: 'jsonb',
        },
        
    })
};

exports.down = pgm => {
};