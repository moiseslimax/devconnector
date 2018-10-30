const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validadeExperienceInput(data) {
    let errors = {};

    //if dont come anything in object return empty string for valide
    data.school = !isEmpty(data.school) ? data.school : '';
    data.degree = !isEmpty(data.degree) ? data.degree : '';
    data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : '';
    data.from = !isEmpty(data.from) ? data.from : '';


    if (Validator.isEmpty(data.school)){
        errors.school = 'Você precisa digitar a escola';
    }

    if (Validator.isEmpty(data.degree)){
        errors.degree = 'Você precisa digitar o grau de escolaridade';
    }

    if (Validator.isEmpty(data.fieldofstudy)){
        errors.fieldofstudy = 'Você precisa digitar o assunto do estudo';
    }

    if (Validator.isEmpty(data.from)){
        errors.from = 'Você precisa digitar a data de inicio de trabalho';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}