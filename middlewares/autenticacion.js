var jwt = require('jsonwebtoken');
var seed = require('../config/config').SEED;


// =====================================
// Middleware - verificar token
// =====================================

exports.verificaToken = function(req, res, next) {

    var token = req.query.token;
    jwt.verify(token, seed, function(err, decoded) {
        if (err) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Token incorrecto',
                errors: err
            });
        }

        req.usuario = decoded.usuario;
        next();




    });
};

// =====================================
// Middleware - verificar admin
// =====================================

exports.verificaAdmin_role = function(req, res, next) {

    var usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: { message: 'No es administrador' }
        });
    }


};
// =====================================
// Middleware - verificar admin o mismo usuario
// =====================================

exports.verificaAdmin_oMismoUsuario = function(req, res, next) {

    var usuario = req.usuario;
    var id = req.params.id;

    // Compara el id del token con el que viene por parámetro
    if (usuario.role === 'ADMIN_ROLE' || usuario._id === id) {
        next();
        return;
    } else {
        return res.status(401).json({
            ok: false,
            mensaje: 'Token incorrecto',
            errors: { message: 'No es administrador ni em mismo usuario' }
        });
    }


};