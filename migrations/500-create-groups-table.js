
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('groups', {

        groupId: {
            type: `bigserial`,
            primaryKey: true,
        },

        groupName: {
            type: `varchar(500)`,
        },

        courseId: {
            type: `bigint`,
        },


    })
};

exports.down = pgm => {
};