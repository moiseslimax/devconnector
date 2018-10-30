const Validator = require('validator');
const isEmpty = require('./is-empty');

module.exports = function validadePostInput(data) {
    let errors = {};

    //if dont come anything in object return empty string for valide
    data.text = !isEmpty(data.text) ? data.text : '';

    if (!Validator.isLength(data.text, { min:10, max:300})) {
        errors.text = 'O texto deve estár entre 10 e 300 caractéres'
    }

    if (Validator.isEmpty(data.text)){
        errors.text = 'Você precisa digitar o texto';
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}