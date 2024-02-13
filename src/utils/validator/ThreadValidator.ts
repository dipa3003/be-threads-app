import * as Joi from "joi";

export const CreateThreadSchema = Joi.object({
    content: Joi.string().required(),
    image: Joi.string().required(),
    userId: Joi.number().required(),
});
