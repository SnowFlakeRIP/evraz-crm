
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('balance', {

        balanceId: {
            type: `bigserial`,
            primaryKey: true,
        },

        userId: {
            type: `bigint`,
        },

        balanceAmount: {
            type: `bigint`,
        },

        balanceUsed: {
            type: `bigint`,
        },

        balanceDetailed: {
            type: `jsonb`,
        },

        
    })
};

exports.down = pgm => {
};