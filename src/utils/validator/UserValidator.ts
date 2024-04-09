import Joi = require("joi");

export const CreateUpdateUserSchema = Joi.object({
    username: Joi.optional(),
    full_name: Joi.optional(),
    email: Joi.optional(),
    password: Joi.optional(),
    bio: Joi.optional(),
    image: Joi.optional(),
});
