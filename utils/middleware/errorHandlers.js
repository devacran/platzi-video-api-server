// Un middleware es como las tuberias, la bomba, el tinaco etc, para que las personas puedan tener agua
//Cuando next() lleva un error como parametro express ejecuta los middleware que tienen los 4 parametros, osea los de error
//Si no ejecuta solo los que tienen 3
const boom = require("@hapi/boom");
const { config } = require("../../config");

//si esta en desarrollo devuelve el error y stack, si no no
function withErrorStack(error, stack) {
  if (config.dev) {
    return { ...error, stack };
  }

  return error;
}

//este es para la consola, se lee primero
//luego ejecutara el siguiente middleware con un error
//por eso se pone primero este y luego el errorHandler
function logErrors(err, req, res, next) {
  console.log(err);
  next(err);
}

function wrapErrors(err, req, res, next) {
  if (!err.isBoom) {
    //si el error que le llega no es tipo boom
    next(boom.badImplementation(err));
  }

  next(err);
}

//para que express identifique una funcion como midleware tiene que tener estos 4 parametros
//este middleware recibira el error que se capturo en logErrors
function errorHandler(err, req, res, next) {
  // eslint-disable-line
  const {
    output: { statusCode, payload },
  } = err;
  res.status(statusCode);
  res.json(withErrorStack(payload, err.stack));
}

module.exports = {
  logErrors,
  wrapErrors,
  errorHandler,
};
