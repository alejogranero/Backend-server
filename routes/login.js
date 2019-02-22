var express = require('express');
var app = express();
var Usuario = require('../models/usuario');
var brcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var seed = require('../config/config').SEED;

app.post('/', function(req, res) {

    var body = req.body;

    Usuario.findOne({ email: body.email }, function(err, usuarioDB) {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - email',
                errors: err
            });
        }

        if (!brcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Password incorrecta',
                errors: err
            });
        }

        // Crear un token

        var token = jwt.sign({ usuario: usuarioDB }, seed, { expiresIn: 14400 }); // expira en 4 horas
        usuarioDB.password = ':)';


        res.status(200).json({
            ok: true,
            mensaje: 'Login post funciona',
            usuarioDB: usuarioDB,
            token: token,
            id: usuarioDB.id
        });
    });


});




module.exports = app;