var express = require('express');
var app = express();
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');



// =====================================
// Busqueda general
// =====================================

app.get('/todo/:busqueda', function(request, response) {


    var busqueda = request.params.busqueda;

    //Creamos expresion regular para tomar el contenido de la busqueda
    var regex = new RegExp(busqueda, 'i');


    Promise.all([

        buscarHospitales(busqueda, regex),
        buscarMedicos(busqueda, regex),
        buscarUsuarios(busqueda, regex)
    ]).then(respuestas => {
        response.status(200).json({
            ok: true,
            hospitales: respuestas[0],
            medicos: respuestas[1],
            usuarios: respuestas[2]
        });
    });


});

function buscarHospitales(busqueda, regex) {

    return new Promise(function(resolve, reject) {


        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email').exec(function(err, hospitales) {

                if (err) {
                    reject('Error al cargar hospitales', err);
                } else {
                    resolve(hospitales);
                }
            });

    });

}

function buscarMedicos(busqueda, regex) {

    return new Promise(function(resolve, reject) {


        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital', 'nombre')
            .exec(function(err, medicos) {

                if (err) {
                    reject('Error al cargar medicos', err);
                } else {
                    resolve(medicos);
                }
            });

    });

}

function buscarUsuarios(busqueda, regex) {

    return new Promise(function(resolve, reject) {


        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec(function(err, usuarios) {
                if (err) {
                    reject();
                } else {
                    resolve(usuarios);
                }

            });

    });

}


// =====================================
// Busqueda específica
// =====================================

app.get('/coleccion/:tabla/:busqueda', function(req, res) {

    var busqueda = req.params.busqueda;
    var tabla = req.params.tabla;

    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (tabla) {

        case 'usuarios':
            promesa = buscarUsuarios(busqueda, regex);
            break;

        case 'medicos':
            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'hospitales':
            promesa = buscarHospitales(busqueda, regex);
            break;

        default:
            return res.status(400).json({
                ok: false,
                mensaje: 'Los tipos son inexistentes',
                error: { message: 'Tipo de coleccion no válida' }
            });
    }

    promesa.then(function(data) {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });

});



module.exports = app;