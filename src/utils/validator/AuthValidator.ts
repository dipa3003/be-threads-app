import Joi = require("joi");

export const CreateRegisterSchema = Joi.object({
    username: Joi.string().required(),
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    bio: Joi.string(),
    image: Joi.string(),
});

export const CreateLoginSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});
