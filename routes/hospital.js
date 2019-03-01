var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var mdAutenticacion = require('../middlewares/autenticacion');

// Rutas





// ===============================================
// Obtener todos los hospitales
// ===============================================
app.get('/', function(request, response, next) {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            function(err, hospitales) {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospitales',
                        errors: err
                    });
                }
                Hospital.count({}, function(err, conteo) {
                    response.status(200).json({
                        ok: true,
                        hospitales: hospitales,
                        total: conteo
                    });

                });
            });
});

// ===============================================
// Crear un nuevo hospital
// ===============================================

app.post('/', mdAutenticacion.verificaToken, function(req, res) {


    var body = req.body;

    hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });



    hospital.save(function(err, hospitalGuardado) {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });
    });
});



// =====================================
// Actualizar hospital
// =====================================

app.put('/:id', mdAutenticacion.verificaToken, function(req, res) {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, function(err, hospital) {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital no existe'
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save(function(err, hospitalGuardado) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });
    });


});

// =====================================
// Eliminar usuario
// =====================================

app.delete('/:id', mdAutenticacion.verificaToken, function(req, res) {
    var id = req.params.id;
    Hospital.findByIdAndDelete(id, function(err, hospitalBorrado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital no existe',
                errors: { message: 'No existe hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });
    });
});

module.exports = app;