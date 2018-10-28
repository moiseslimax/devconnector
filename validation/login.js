const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validadeLoginInput(data) {
    let errors = {};

    //if dont come anything in object return empty string for valide
    data.email = !isEmpty(data.email) ? data.email : '';
    data.password = !isEmpty(data.password) ? data.password : '';

    if (!Validator.isEmail(data.email)){
        errors.email = 'Email é invalido';
    }

    if (Validator.isEmpty(data.email)){
        errors.email = 'Você precisa digitar o Email';
    }

    if (Validator.isEmpty(data.password)){
        errors.password = 'Você precisa digitar a Senha';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}