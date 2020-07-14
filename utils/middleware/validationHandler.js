const boom = require("@hapi/boom");
const joi = require("@hapi/joi");

//recibe data y un squema
//si hay un error devuelve un error o null si no hay nada
function validate(data, schema) {
  const { error } = joi.object(schema).validate(data); // cambio en la validación
  return error;
}
//se recibe el error aca , si hubo un error entonces se le habla a boom
//si no continua con el siguiente middleware
function validateHandler(schema, check = "body") {
  return function (req, res, next) {
    const err = validate(req[check], schema);
    err ? next(boom.badRequest(err)) : next();
  };
}

module.exports = validateHandler;
