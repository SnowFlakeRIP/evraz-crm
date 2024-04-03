function firstForm (data) {
    return {
        content: [
            {
                
                text: 'Начальнику управления городским\n хозяйством Администрации города\n',
                style:{
                    bold:true
                },
                alignment:'right',
                margin: [0, 15, 0, 0],
            },
            {
                text:'ЗАЯВЛЕНИЕ',
                style:{
                    bold:true
                },
                alignment: 'center',
                margin: [0, 20, 0, 0]
            },
        ],
        styles:       {
            header:      {
                fontSize:  14,
                alignment: 'center',
                bold:      true,
            },
            center:      {
                fontSize:  11,
                alignment: 'center',
            },
            right:       {
                fontSize:  11,
                alignment: 'right',
            },
            LeftBold:    {
                fontSize:  11,
                alignment: 'left',
                bold:      true,
            },
            headerRight: {
                fontSize:  11,
                alignment: 'right',
                bold:      true,
            },
            bold:        {
                fontSize: 11,
                bold:     true,
            },
            italic:      {
                fontSize: 11,
                italics:  true,
            },
            snoska:      {
                fontSize: 9,
            },
        },
        defaultStyle: {
            font:                  'TimesNewRoman',
            fontSize:              11,
            alignment:             'justify',
            preserveLeadingSpaces: true,
        },
    }
}

module.exports = {
    firstForm: firstForm,
    
}