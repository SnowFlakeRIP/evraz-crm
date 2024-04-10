exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('message', {
        messageId:             {
            type:       'bigserial',
            primaryKey: true,
        },
        userId:{
            type: `bigint`
        },
        fromUserId:{
            type: `bigint`,
        },
        date: {
            type: `timestamp with time zone`,
            default: pgm.func(`now()`)
        },
        messageValue:{
            type: `varchar(255)`,
        }
    });
};

exports.down = pgm => {
};
