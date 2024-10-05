// controllers/errorController.js
const errorController = {}

// Genera un error de tipo 500 intencionalmente
errorController.triggerError = (req, res, next) => {
    const error = new Error("Intentional Server Error!");
    error.status = 500; // Define el código de estado como 500
    next(error); // Enviar el error al middleware de errores
}

module.exports = errorController;
