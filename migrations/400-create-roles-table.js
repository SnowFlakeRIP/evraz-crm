
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('roles', {
        
        roleId: {
            type: `bigserial`,
            primaryKey: true,
        },

        roleValue: {
            type: `varchar(255)`,
        },

        
    })
};

exports.down = pgm => {
};