const { validationResult } = require('express-validator');

module.exports = {
    /**
     * Handle error response
     * @param {*} err error object from axios
     * @param {*} res response
     * @returns 
     */
    handleErrorResponse(err, res) {
        if (err.response)
            return res.json(400, err.response.data);
        return res.status(500);
    },

    /**
     * Validate field from validators of controllers
     * @param {*} req 
     * @param {*} res 
     * @param {*} next 
     * @returns 
     */
    validate(req, res, next) {
        const errors = validationResult(req)
        if (errors.isEmpty()) {
            return next()
        }
        const extractedErrors = []
        errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))
    
        return res.status(422).json({
            errors: extractedErrors,
        })
    }
}
