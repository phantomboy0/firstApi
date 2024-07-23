const UserModel = require("./user.model");
const { ResponseHandler } = require("../handlers");

class UserController {
  constructor({ UserModel, ResponseHandler }) {
    this.userModel = UserModel;
    this.responseHandler = ResponseHandler;
  }

  RegisterUser = async (req, res) => {
    //Phone number verify
    const regExp = /09[0-9]{9,9}/;

    if (!regExp.test(req.body.phoneNumber))
      return this.responseHandler.send({
        res,
        statusCode: 409,
        returnObj: "phone num format should be 09xxxxxxxxx",
      });

    try {
      const result = await this.userModel.findOne({
        phoneNumber: req.body.phoneNumber,
      });

      if (result)
        return this.responseHandler.send({
          res,
          statusCode: 409,
          returnObj: "a user with this phone number exist",
        });

      const newUser = new this.userModel({
        userName: req.body.userName,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phoneNumber: req.body.phoneNumber,
        email: req.body.email,
        isBlocked: req.body.isBlocked,
      });
      try {
        await newUser.save();
        return this.responseHandler.send({
          res,
          statusCode: 201,
          returnObj: newUser,
        });
      } catch (err) {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: { error: err.message },
        });
      }
    } catch (err) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: { error: err.message },
      });
    }
  };

  FindUserById = async (req, res) => {
    try {
      const result = await this.userModel.findById(req.body.id);
      try {
        if (result.isBlocked)
          return this.responseHandler.send({
            res,
            statusCode: 403,
            returnObj: "this user is blocked",
          });
      } catch (err) {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "such user id doesn't exist",
        });
      }

      if (result) {
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: result,
        });
      } else {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "such user id doesn't exist",
        });
      }
    } catch (err) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: err.message,
      });
    }
  };

  FindUserByIdWithParams = async (req, res) => {
    try {
      const result = await this.userModel.findById(req.params.id);
      try {
        if (result.isBlocked)
          return this.responseHandler.send({
            res,
            statusCode: 403,
            returnObj: "this user is blocked",
          });
      } catch (err) {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "such user id doesn't exist",
        });
      }

      if (result) {
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: result,
        });
      } else {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "such user id doesn't exist",
        });
      }
    } catch (err) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: err.message,
      });
    }
  };

  DeleteUserById = async (req, res) => {
    try {
      const result = await this.userModel.findByIdAndDelete(req.body.id);

      if (result) {
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: result,
        });
      } else {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "such user id doesn't exist",
        });
      }
    } catch (err) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: err.message,
      });
    }
  };

  UpdateUserById = async (req, res) => {
    try {
      let updateQuery = {};

      if (req.body.new_phoneNumber.trim().length !== 0) {
        const regExp = /09[0-9]{9,9}/;
        if (!regExp.test(req.body.new_phoneNumber))
          return this.responseHandler.send({
            res,
            statusCode: 409,
            returnObj: "phone number format should be 09xxxxxxxxx",
          });
        const phoneResult = await this.userModel.findOne({
          phoneNumber: req.body.new_phoneNumber,
        });

        if (phoneResult)
          return this.responseHandler.send({
            res,
            statusCode: 409,
            returnObj: "a user with this phone number exist",
          });

        updateQuery.phoneNumber = req.body.new_phoneNumber;
      }

      if (req.body.new_userName.trim().length !== 0)
        updateQuery.userName = req.body.new_userName;

      if (req.body.new_password.trim().length !== 0)
        updateQuery.password = req.body.new_password;

      if (req.body.new_firstName.trim().length !== 0)
        updateQuery.firstName = req.body.new_lastName;

      if (req.body.new_lastName.trim().length !== 0)
        updateQuery.lastName = req.body.new_lastName;

      if (req.body.new_email.trim().length !== 0)
        updateQuery.email = req.body.new_email;

      if (typeof req.body.new_isBlocked === "bool")
        updateQuery.isBlocked = req.body.new_isBlocked;

      const result = await this.userModel.findByIdAndUpdate(req.body.id, {
        $set: updateQuery,
      });

      if (result) {
        const updatedUser = await this.userModel.findById(req.body.id);
        return this.responseHandler.send({
          res,
          statusCode: 200,
          returnObj: updatedUser,
        });
      } else {
        return this.responseHandler.send({
          res,
          statusCode: 400,
          returnObj: "no user found with this id to update",
        });
      }
    } catch (err) {
      return this.responseHandler.send({
        res,
        statusCode: 500,
        returnObj: err.message,
      });
    }
  };
}

module.exports = new UserController({ UserModel, ResponseHandler });
