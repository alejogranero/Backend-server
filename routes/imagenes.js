var express = require('express');
var app = express();

const path = require('path');
const fs = require('fs');


// Rutas
app.get('/:tipo/:img', function(request, response) {

    var tipo = request.params.tipo;
    var img = request.params.img;

    var pathImagen = path.resolve(__dirname, `../uploads/${tipo}/${img}`);

    if (fs.existsSync(pathImagen)) { //si existe la imagen, la devuelve en el response
        response.sendFile(pathImagen);
    } else {
        var pathNoImage = path.resolve(__dirname, '../assets/no-img.jpg');
        response.sendFile(pathNoImage);
    }


});

module.exports = app;