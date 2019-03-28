var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var brcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var mdAutenticacion = require('../middlewares/autenticacion');

// Rutas




// ===============================================
// Crear un nuevo usuario
// ===============================================

app.post('/', function(req, res) {


    var body = req.body;

    usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: brcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });



    usuario.save(function(err, usuarioGuardado) {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando usuario',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });
    });
});






// ===============================================
// Obtener todos los usuarios
// ===============================================
app.get('/', function(request, response, next) {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, 'nombre email img role')
        .skip(desde)
        .limit(5)
        .exec(
            function(err, usuarios) {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando usuarios',
                        errors: err
                    });
                }

                Usuario.count({}, function(err, conteo) {
                    response.status(200).json({
                        ok: true,
                        usuarios: usuarios,
                        total: conteo
                    });

                });

            });
});

// =====================================
// Actualizar usuario
// =====================================

app.put('/:id', mdAutenticacion.verificaToken, function(req, res) {

    var id = req.params.id;
    var body = req.body;

    Usuario.findById(id, function(err, usuario) {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe'
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save(function(err, usuarioGuardado) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });


});

// =====================================
// Eliminar usuario
// =====================================

app.delete('/:id', mdAutenticacion.verificaToken, function(req, res) {
    var id = req.params.id;
    Usuario.findByIdAndDelete(id, function(err, usuarioBorrado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar usuario',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario no existe',
                errors: { message: 'No existe usuario con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });
    });
});

module.exports = app;