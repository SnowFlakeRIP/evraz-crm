const path = require('path')

const fonts = {
    TimesNewRoman: {
        normal:      path.resolve(__dirname, '../public/fonts/Times-Regular.ttf'),
        bold:        path.resolve(__dirname, '../public/fonts/Times-Bold.ttf'),
        italics:     path.resolve(__dirname, '../public/fonts/Times-Italic.ttf'),
        bolditalics: path.resolve(__dirname, '../public/fonts/Times-MediumItalic.ttf'),
    },
};

module.exports = {
    fonts:  fonts,
    
}