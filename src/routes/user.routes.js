const { Router } = require("express");
const upload = require('../utils/upload');


const { User, Sequelize } = require("./../models");

const {
    registerCustomer,
    login,
    getCustomers,
    getCustomerDetails,
    deleteCustomer,
    updateCustomerDetails,
    getCustomerProfileImage
} = require("../controllers/user.controllers.js");

//Middlewares
const authMiddleware = require("../middlewares/auth.middlewares.js");

//Validators
const { 
  userRegisterValidator,
  useLoginValidator,
  getAllUsersValidator,
  validateExistingUser
} = require("../validators/user.validators.js");
const { validate } = require("../validators/validate.js");

const router = Router();

//Open routes
router.route("/register").post(upload.single('file'), userRegisterValidator(), validate, registerCustomer);
router.route("/login").post(useLoginValidator(), validate, login);
router.route("/customers/get-profile-image/:id").get(authMiddleware, getCustomerProfileImage);

//Authenticated routes
router.route("/customers").get(authMiddleware, getCustomers);
router.route("/customers").post(authMiddleware, registerCustomer);
router.route("/customers/:id").get(authMiddleware, getCustomerDetails);
router.route("/customers/:id").put(upload.single('file'), validateExistingUser(), validate, authMiddleware, updateCustomerDetails);
router.route("/customers/:id").delete(authMiddleware, deleteCustomer);

module.exports = router;
