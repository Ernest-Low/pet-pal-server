import Joi from "joi";

export interface OwnerType {
  ownerId: number;
  email: string;
  password: string;
  areaLocation: string;
  ownerName: string;
  petPicture: string[];
  petName: string;
  petBreed: string;
  petGender: "Male" | "Female";
  petAge: number;
  petSize: "Small" | "Medium" | "Large";
  petDescription: string;
  ownerMatches: number[];
  petIsNeutered: boolean;
}

export const ownerSchema: Joi.ObjectSchema<OwnerType> = Joi.object({
  ownerId: Joi.number().optional(),
  email: Joi.string().email().max(100).required(),
  password: Joi.string().max(100).required(),
  areaLocation: Joi.string().max(100).required(),
  ownerName: Joi.string().max(100).required(),
  petPicture: Joi.array().items(Joi.string()).required(),
  petName: Joi.string().max(100).required(),
  petBreed: Joi.string().max(100).required(),
  petGender: Joi.string().valid("Male", "Female").required(),
  petAge: Joi.number().integer().positive().required(),
  petSize: Joi.string().valid("Small", "Medium", "Large").required(),
  petDescription: Joi.string().required(),
  ownerMatches: Joi.array().items(Joi.number()).optional(),
  petIsNeutered: Joi.boolean().required(),
});
