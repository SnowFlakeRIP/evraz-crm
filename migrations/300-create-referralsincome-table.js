
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('referralsincome', {

        id: {
            type: `bigserial`,
            primaryKey: true,
        },

        partnerUserId: {
            type: `bigint`,
        },

        referralUserId: {
            type: `bigint`,
        },

        amount: {
            type: `decimal(30, 2)`,
        },

        x: {
            type: `bigint`,
        },

        isPaid: {
            type: `boolean`,
        },

        inPayment: {
            type: `boolean`,
        },

        
    })
};

exports.down = pgm => {
};