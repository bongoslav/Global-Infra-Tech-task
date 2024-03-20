import Joi, { Context, ValidationErrorItem } from "joi";

export const newsSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(255).required(),
  text: Joi.string()
    .max(1024 * 1024)
    .required(),
  date: Joi.date().iso().optional(),
});

export async function validateNewsInput(ctx: Context, next: () => Promise<any>) {
  try {
    const { error, value } = newsSchema.validate(ctx.request.body, {
      abortEarly: false, // collect all validation errors
    });

    if (error) {
      ctx.status = 400;
      ctx.body = {
        error: error.details.map((err: ValidationErrorItem) => err.message),
      };
      return;
    }

    ctx.request.body = value;
    await next();
  } catch (error) {
    console.error("Validation error:", error);
    ctx.status = 500;
    ctx.body = { error: "Internal Server Error" };
  }
}
