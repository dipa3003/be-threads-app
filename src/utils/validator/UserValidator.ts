import Joi = require("joi");

export const CreateUpdateUserSchema = Joi.object({
    username: Joi.string(),
    full_name: Joi.string(),
    email: Joi.string(),
    password: Joi.string(),
    bio: Joi.string(),
    image: Joi.string(),
});
