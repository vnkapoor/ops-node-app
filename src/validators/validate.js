const { validationResult } = require("express-validator");

const validate = (req, res, next) => {
    const errors = validationResult(req);

    const extractedErrors = [];
    errors.array().map((err) => extractedErrors.push({ [err.path]: err.msg }));

    if (errors.isEmpty()) {
        next();
    } else {
        res.status(422).json({ errors: extractedErrors });
    }
};

module.exports = {
    validate
};
