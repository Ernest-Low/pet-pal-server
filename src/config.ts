import dotenv from "dotenv";
import Joi from "joi";

dotenv.config();

// Define the schema for environment variables
const envSchema = Joi.object({
  PORT: Joi.number().required(),
  AUTH_KEY: Joi.string().required(),
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
};
