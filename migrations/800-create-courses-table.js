
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('courses', {

        courseId: {
            type: 'bigserial',
            primaryKey: true,
        },

        courseName:{
            type: 'varchar(255)',
            unique: true,
        },

        courseDescription:{
            type: 'varchar(1500)',
        },

        numbersOfHours:{
            type: `integer`
        },

        schedule: {
            type: `varchar(255)`
        }
    })
};


exports.down = pgm => {
};