import Joi, { Context, ValidationErrorItem } from "joi";

const requiredNewsSchema = Joi.object({
  title: Joi.string().max(255).required(),
  description: Joi.string().max(255).required(),
  text: Joi.string()
    .max(1024 * 1024)
    .required(),
  date: Joi.date().iso().optional(),
});

export async function validateRequiredNewsInput(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const { error, value } = requiredNewsSchema.validate(ctx.request.body, {
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

const patchNewsSchema = Joi.object({
  title: Joi.string().max(255).optional(),
  description: Joi.string().max(255).optional(),
  text: Joi.string()
    .max(1024 * 1024)
    .optional(),
  date: Joi.date().iso().optional(),
});

export async function validatePatchNewsInput(
  ctx: Context,
  next: () => Promise<any>
) {
  try {
    const { error, value } = patchNewsSchema.validate(ctx.request.body, {
      abortEarly: false,
      allowUnknown: true,
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
