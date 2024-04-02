import * as Joi from "joi";

export const CreateReplySchema = Joi.object({
    content: Joi.optional(),
    image: Joi.optional(),
    userId: Joi.number().required(),
    threadId: Joi.number().required(),
});
