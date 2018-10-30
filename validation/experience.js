const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validadeExperienceInput(data) {
    let errors = {};

    //if dont come anything in object return empty string for valide
    data.title = !isEmpty(data.title) ? data.title : '';
    data.company = !isEmpty(data.company) ? data.company : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    if (Validator.isEmpty(data.title)){
        errors.title = 'Você precisa digitar o Titulo do trabalho';
    }

    if (Validator.isEmpty(data.company)){
        errors.company = 'Você precisa digitar a empresa';
    }

    if (Validator.isEmpty(data.from)){
        errors.from = 'Você precisa digitar a data de inicio de trabalho';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}