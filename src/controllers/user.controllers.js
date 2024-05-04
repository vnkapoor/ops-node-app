const { User, Sequelize } = require("./../models");
const { Op } = require('sequelize');

const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const ms = require('ms');
const fs = require("fs");
const path = require("path");

//Login User
const login = async (req, res, next) => {
  try {
    const response = await User.findOne({ attributes: ["email", "password"], where: { email: req.body.email } });
    if (!response) {
      return res.status(401).json("Unauthorized");
    }

    bcrypt.compare(req.body.password, response.password, function (err, result) {
      if (!result) {
        return res.status(401).json("Unauthorized");
      }
      //Generate the token
      const token = jwt.sign({ 
        sub: response.email 
      }, process.env.TOKEN_SECRET_KEY, { expiresIn: '24h' });
   
      return res.status(200).json({ 
        access_token: token,
        expires_in: ms('24h') / 1000,
        token_type: "Bearer"
      });
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

//Register new customer
const registerCustomer = async (req, res, next) => {
  try {
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const response = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      phone_number: req.body.phone_number,
      gender: req.body.gender,
      address: req.body.address,
      profile_image: req.file.filename
    });
    return res.status(200).json({ success: true, msg: "Customer created successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
};

//Get all customers
const getCustomers = async (req, res, next) => {
  try {
    const search = req.body.search ?? null;
    const limit = req.body.limit ?? 10;
    const offset = req.body.offset ?? 0;

    //Prepare where condition
    let whereCondition = {};
    if (search) {
      whereCondition = {
        [Op.or]: [{ name: req.body.search }, { email: req.body.search }],
      }
    }

    //Get all the users
    const { count, rows } = await User.findAndCountAll({
      attributes: ["name", "email", "phone_number", "gender", "address", "profile_image", "createdAt", "updatedAt"],
      where: whereCondition,
      order: [
        ['createdAt', 'DESC'],
      ],
      offset: offset,
      limit: limit
    });
    
    return res.status(200).json({
      data: rows,
      total: count
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
  
}

//Get specific customer details
const getCustomerDetails = async (req, res, next) => {
  try {
    const response = await User.findByPk(req.params.id);
    return res.status(200).json({
      data: response
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
}

//Update the customer details
const updateCustomerDetails = async (req, res, next) => {
  try {
    const response = await User.findByPk(req.params.id);
    if (response) {
      let hashPassword = response.password;
      if (req.body.password) {
        hashPassword = bcrypt.hashSync(req.body.password, 10);
      }

      const update = await User.update(
        { 
          name: (req.body.name) ?? response.name,
          email: (req.body.email) ?? response.email,
          password: hashPassword ?? response.password,
          phone_number: (req.body.phone_number) ?? response.phone_number,
          gender: (req.body.gender) ?? response.gender,
          address: (req.body.address) ?? response.address,
          profile_image: (req.file.filename) ?? response.profile_image,
        },
        {
          where: {
            id: req.params.id,
          },
        },
      );
      return res.status(200).json({ success: (update) ? true : false, error: 'Customer details updated successfully' });
    } else {
      return res.status(404).json({ success: false, error: 'Not Found' });
    }
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
  
}

//Delete the customer
const deleteCustomer = async (req, res, next) => {
  try {
    const response = await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    return res.status(200).json({ success: (response) ? true : false, error: 'Customer deleted successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
}

//Get particular user profile image
const getCustomerProfileImage = async (req, res, next) => {
  try {
    const response = await User.findOne({ attributes: ["profile_image"], where: { id: req.params.id } });
    if (!response) {
      return res.status(401).json("Unauthorized");
    }

   
    //res.sendFile('public/uploads/'+response.profile_image);
    return res.status(200).json(process.env.APP_URL+'uploads/'+response.profile_image);
  } catch (error) {
    return res.status(500).json({ success: false, error: error });
  }
}

module.exports = {
  registerCustomer,
  login,
  getCustomers,
  getCustomerDetails,
  deleteCustomer,
  updateCustomerDetails,
  getCustomerProfileImage
};
