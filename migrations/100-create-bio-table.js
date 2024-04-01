exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('bio', {

        bioId: {
            type: `bigserial`,
            primaryKey: true,
        },

        userId: {
            type: `bigint`,
        },

        bioName: {
            type: `varchar(500)`,
        },

        bioLastName: {
            type: `varchar(500)`,
        },

        bioMiddleName: {
            type: `varchar(500)`,
        },

        bioInviteCode: {
            type: `varchar(150)`,
        },

        bioInviteCodeStartDate: {
            type: `timestamp with time zone`,
            default: pgm.func(`now()`),
        },

        bioInviteCodeEndDate: {
            type: `timestamp with time zone`,
            default: pgm.func(`now()`),
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