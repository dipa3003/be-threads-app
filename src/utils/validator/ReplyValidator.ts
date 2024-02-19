import * as Joi from "joi";

export const CreateReplySchema = Joi.object({
    content: Joi.string().required(),
    image: Joi.string().required(),
    userId: Joi.number().required(),
    threadId: Joi.number().required(),
});
