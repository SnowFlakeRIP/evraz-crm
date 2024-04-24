/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('users', {
        userId: {
            type: `bigserial`,
            primaryKey: true,
        },

        userEmail: {
            type: `varchar(255)`,
            unique: true,
        },

        userPassword: {
            type: `varchar(255)`,
        },

        userPhone: {
            type: `varchar(20)`,
            unique: true,
        },

        userTelegramChatId: {
            type: `varchar(255)`,
        },

        userActive: {
            type: `boolean`,
        },

        userRole: {
            type: `varchar(255)`,
        },

        createdAt: {
            type: `timestamp with time zone`,
            default: pgm.func(`now()`)
        },

        updatedAt: {
            type: `timestamp with time zone`,
            default: pgm.func(`now()`)
        },
    })
};

exports.down = pgm => {
};