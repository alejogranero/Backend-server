var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();

// Middleware
app.use(fileUpload());


// Rutas
app.put('/:tipo/:id', (request, response, next) => {

    var tipo = request.params.tipo;
    var id = request.params.id;

    // Tipos de colección

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Error seleccionó un tipo erroneo',
            errors: { message: 'Debe de seleccionar un tipo válido' }
        });
    }

    if (!request.files) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Error seleccionó nada',
            errors: { message: 'Debe de seleccionar un archivo' }
        });
    }

    // Obtengo nombre del archivo

    var archivo = request.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extension = nombreCortado[nombreCortado.length - 1]

    // Solo se aceptan las siguientes extensiones

    var extensionesValidas = ['png', 'jpg', 'gif', 'bmp', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return response.status(400).json({
            ok: false,
            mensaje: 'Extensión inválida',
            errors: { message: 'Debe de seleccionar una extensión válida' }
        });
    }

    // Nombre de archivo personalizado

    var nombreArchivo = `${id}-${new Date().getMilliseconds()}.${extension}`;

    // Mover el archivo del temporal al path

    var path = `./uploads/${tipo}/${nombreArchivo}`;
    archivo.mv(path, function(err) {

        if (err) {
            return response.status(500).json({
                ok: false,
                mensaje: 'Error al mover archivo',
                errors: err
            });
        }

        response.status(200).json({
            ok: true,
            mensaje: 'Archivo movido',
            nombreCortado: nombreCortado,
            extension: extension
        });
    });




});

module.exports = app;