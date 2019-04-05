var express = require('express');
var app = express();
var Medico = require('../models/medico');
var mdAutenticacion = require('../middlewares/autenticacion');

// Rutas





// ===============================================
// Obtener todos los medicos
// ===============================================
app.get('/', function(request, response, next) {


    var desde = request.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            function(err, medicos) {
                if (err) {
                    return response.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando medicos',
                        errors: err
                    });
                }
                Medico.count({}, function(err, conteo) {
                    response.status(200).json({
                        ok: true,
                        medicos: medicos,
                        total: conteo
                    });

                });
            });
});

// ===============================================
// Crear un nuevo medico
// ===============================================

app.post('/', mdAutenticacion.verificaToken, function(req, res) {


    var body = req.body;

    medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });



    medico.save(function(err, medicoGuardado) {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error guardando medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });
    });
});

// =====================================
// Obtener médico
// =====================================

app.get('/:id', function(req, resp) {
    var id = req.params.id;

    Medico.findById(id)
        .populate('usuario', 'nombre email img')
        .populate('hospital')
        .exec(function(err, medico) {

            if (err) {
                return resp.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar medico',
                    errors: err
                });
            }

            if (!medico) {
                return resp.status(400).json({
                    ok: false,
                    mensaje: 'El medico no existe'
                });
            }

            resp.status(200).json({
                ok: true,
                medico: medico
            });

        });
});

// =====================================
// Actualizar medico
// =====================================

app.put('/:id', mdAutenticacion.verificaToken, function(req, res) {

    var id = req.params.id;
    var body = req.body;

    Medico.findById(id, function(err, hospital) {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico no existe'
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save(function(err, medicoGuardado) {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });
    });


});

// =====================================
// Eliminar usuario
// =====================================

app.delete('/:id', mdAutenticacion.verificaToken, function(req, res) {
    var id = req.params.id;
    Medico.findByIdAndDelete(id, function(err, medicoBorrado) {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El medico no existe',
                errors: { message: 'No existe medico con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });
    });
});

module.exports = app;