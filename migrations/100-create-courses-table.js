
exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable('courses', {
        courseId: {
            type:'bigserial',
            primaryKey:true,
        },
        courseName:{
            type:'varchar(255)'
        },
        courseDescription:{
            type:'varchar(1500)'
        },
        numberOfHours:{
            type:'integer'
        },
        schedule:{
            type: 'varchar(255)'
        },
        createDate:{
            type:'timestamp with time zone',
            default:pgm.func('now()')
        },
        updateDate:{
            type:'timestamp with time zone',
            default:pgm.func('now()')
        },
    }, {
        ifNotExists: true,
        comment:'Таблица, где хранится информация о курсах'
    })
};
exports.down = pgm => {
};