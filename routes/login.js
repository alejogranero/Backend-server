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
            id: usuarioDB.id,
            menu: obtenerMenu(usuarioDB.role)
        });
    });


});

function obtenerMenu(role) {

    var menu = [{
            titulo: 'Principal',
            icono: 'mdi mdi-gauge',
            submenu: [
                { titulo: 'Dashboard', url: '/dashboard' },
                { titulo: 'ProgressBar', url: '/progress' },
                { titulo: 'Graficas', url: '/graficas1' },
                { titulo: 'Promesas', url: '/promesas' },
                { titulo: 'RXJS', url: '/rxjs' }
            ]
        },
        {
            titulo: 'Mantenimientos',
            icono: 'mdi mdi-folder-lock-open',
            submenu: [
                // { titulo: 'Usuarios', url: '/usuarios' },
                { titulo: 'Médicos', url: '/medicos' },
                { titulo: 'Hospitales', url: '/hospitales' }
            ]
        }
    ];

    if (role === 'ADMIN_ROLE') { // Si es un admin, va a poder ver el menu de usuarios
        menu[1].submenu.unshift({ titulo: 'Usuarios', url: '/usuarios' });
    }

    return menu;
}




module.exports = app;