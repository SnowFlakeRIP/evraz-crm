
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('usersgroups', {

        id: {
            type: `bigserial`,
            primaryKey: true,
        },

        userId: {
            type: `bigint`,
        },

        groupId: {
            type: `bigint`,
        },


    })
};

exports.down = pgm => {
};