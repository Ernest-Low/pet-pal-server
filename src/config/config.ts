import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

// Define the schema for environment variables
const envSchema = Joi.object({
  PORT: Joi.number().required(),
  AUTH_KEY: Joi.string().required(),
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string().required(),
}).unknown();

// Validate the environment variables
const { error, value: envVars } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

// Export validated environment variables
export const config = {
  PORT: envVars.PORT as number,
  AUTH_KEY: envVars.AUTH_KEY as string,
  CLOUDINARY_CLOUD_NAME: envVars.CLOUDINARY_CLOUD_NAME as string,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY as string,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET as string,
};
