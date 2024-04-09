import * as Joi from "joi";

export const CreateThreadSchema = Joi.object({
    content: Joi.optional(),
    image: Joi.optional(),
    userId: Joi.number().required(),
});
