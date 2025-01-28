const Joi = require("joi");

const userSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
});

module.exports = {
  validateUser(req, res, next) {
    const { error } = userSchema.validate(req.body);
    
    if (error) {
      return res
        .status(400)
        .json({ success: false, message: error.details[0].message });
    }

    next();
  },
};
