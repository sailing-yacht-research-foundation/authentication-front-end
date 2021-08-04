const { body, checkSchema } = require('express-validator');


module.exports = {
    versioningCreateValidationRules() {
        const typeSchema = {
            "type": {
                in: 'body',
                matches: {
                    options: [/\b(?:eula|privacy)\b/],
                    errorMessage: "type must be either eula or privacy"
                }
            }
        }

        return [
            body('email').exists().not().isEmpty().normalizeEmail().isEmail(),
            checkSchema(typeSchema),
            body('version')
                .exists()
                .not()
                .isEmpty()
                .withMessage('version cannot be empty')
                .isISO8601('yyyy-mm-dd')
                .withMessage('version must be in correct format yyyy-mm-dd hh:mm')
                .matches(/[0-9]{4}-(0[1-9]|1[0-2])-(0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/)
                .withMessage('version must be in correct format yyyy-mm-dd hh:mm'),
        ];
    },
}