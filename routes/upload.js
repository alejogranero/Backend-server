var express = require('express');
var fileUpload = require('express-fileupload');
var app = express();
var fs = require('fs');

// Modelos

var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');


// Middleware
app.use(fileUpload());


// Rutas
app.put('/:tipo/:id', function(request, response) {

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
    var extension = nombreCortado[nombreCortado.length - 1];

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

        subirPorTipo(tipo, id, nombreArchivo, response);


    });
});


function subirPorTipo(tipo, id, nombreArchivo, response) {

    if (tipo === 'usuarios') {
        Usuario.findById(id, function(err, usuario) {

            if (!usuario) {
                return response.status(400).json({
                    ok: true,
                    mensaje: 'Usuario no existe',
                    usuarioActualizado: usuarioActualizado
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            usuario.img = nombreArchivo;

            usuario.save(function(err, usuarioActualizado) {

                usuarioActualizado.password = ':)';

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuarioActualizado: usuarioActualizado
                });
            });
        });
    }

    if (tipo === 'medicos') {

        Medico.findById(id, function(err, medico) {

            if (!medico) {
                return response.status(400).json({
                    ok: true,
                    mensaje: 'Medico no existe',
                    medicoActualizado: medicoActualizado
                });
            }
            var pathViejo = './uploads/medicos/' + medico.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            medico.img = nombreArchivo;

            medico.save(function(err, medicoActualizado) {

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medicoActualizado: medicoActualizado
                });
            });
        });

    }

    if (tipo === 'hospitales') {

        Hospital.findById(id, function(err, hospital) {

            if (!hospital) {
                return response.status(400).json({
                    ok: true,
                    mensaje: 'Hospital no existe',
                    hospitalActualizado: hospitalActualizado
                });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img;

            // Si existe, elimina la imagen anterior
            if (fs.existsSync(pathViejo)) {
                fs.unlink(pathViejo);
            }
            hospital.img = nombreArchivo;

            hospital.save(function(err, hospitalActualizado) {

                return response.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospitalActualizado: hospitalActualizado
                });
            });
        });

    }

}

module.exports = app;