const { body } = require("express-validator");
const genderSchema = ["male", "female", "other"]

const userRegisterValidator = () => {
  return [
    body("name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Name is required"),
    body("email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Password is required")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minSymbols: 1
        })
        .withMessage("Password must have minimum one uppercase, one lowecase and one symbol"),
    body("phone_number")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Phone number is required")
        .isLength({
            min:10,
            max:10
        })
        .withMessage("Invalid Phone number"),
    body("gender")
        .trim()
        .escape()
        .notEmpty()
        .custom((value, { req }) => {
            if (genderSchema.includes(value)) {
                return true;
            }
        })
        .withMessage("Value should male/female/other"),
    body("address")
        .trim()
        .escape()
        .isLength({
            max:255
        })
  ];
};

const validateExistingUser = () => {
  return [
    body("name")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Name is required"),
    body("email")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Password is required")
      .isStrongPassword({
          minLength: 8,
          minLowercase: 1,
          minUppercase: 1,
          minSymbols: 1
      })
      .withMessage("Password must have minimum one uppercase, one lowecase and one symbol"),
    body("phone_number")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Phone number is required")
      .isLength({
          min:10,
          max:10
      })
      .withMessage("Invalid Phone number"),
    body("gender")
      .optional()
      .trim()
      .escape()
      .notEmpty()
      .custom((value, { req }) => {
          if (genderSchema.includes(value)) {
              return true;
          }
      })
      .withMessage("Value should male/female/other"),
    body("address")
      .optional()
      .trim()
      .escape()
      .isLength({
          max:255
      })
  ]
}

const useLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
  ]
}

const getAllUsersValidator = () => {
  return [
    body("search")
      .trim(),
    body("limit")
    .trim()
    .isInt(),
    body("offset")
    .trim()
    .isInt()
  ]
}


module.exports = {
    userRegisterValidator,
    useLoginValidator,
    getAllUsersValidator,
    validateExistingUser
};
