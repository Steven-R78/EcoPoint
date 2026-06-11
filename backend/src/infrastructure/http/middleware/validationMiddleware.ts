import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';

export const validateBody = (schema: Joi.ObjectSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      return next(new Error(error.details.map((detail) => detail.message).join(', ')));
    }

    req.body = value;
    return next();
  };
};

const humanNameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]{3,80}$/;
const strongPasswordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,32}$/;
const addressRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ#.,\-\s]{6,150}$/;
const plainTextRegex = /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ.,\-\s]{3,200}$/;

export const schemas = {
  registerUser: Joi.object({
    fullName: Joi.string().pattern(humanNameRegex).required(),
    email: Joi.string().email().required(),
    password: Joi.string().pattern(strongPasswordRegex).required(),
  }),
  loginUser: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
  updateUser: Joi.object({
    fullName: Joi.string().pattern(humanNameRegex),
    email: Joi.string().email(),
    password: Joi.string().pattern(strongPasswordRegex),
  }).min(1),
  wasteCategory: Joi.object({
    name: Joi.string().pattern(plainTextRegex).required(),
    description: Joi.string().pattern(plainTextRegex).required(),
    pointsPerKg: Joi.number().positive().max(1000).required(),
  }),
  wasteCategoryUpdate: Joi.object({
    name: Joi.string().pattern(plainTextRegex),
    description: Joi.string().pattern(plainTextRegex),
    pointsPerKg: Joi.number().positive().max(1000),
  }).min(1),
  recyclingPoint: Joi.object({
    name: Joi.string().pattern(plainTextRegex).required(),
    address: Joi.string().pattern(addressRegex).required(),
    city: Joi.string().pattern(plainTextRegex).required(),
    latitude: Joi.number().min(-90).max(90).required(),
    longitude: Joi.number().min(-180).max(180).required(),
    openingHours: Joi.string().pattern(plainTextRegex).required(),
  }),
  recyclingPointUpdate: Joi.object({
    name: Joi.string().pattern(plainTextRegex),
    address: Joi.string().pattern(addressRegex),
    city: Joi.string().pattern(plainTextRegex),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    openingHours: Joi.string().pattern(plainTextRegex),
  }).min(1),
  transaction: Joi.object({
    userId: Joi.string().guid({ version: 'uuidv4' }).required(),
    recyclingPointId: Joi.string().guid({ version: 'uuidv4' }).required(),
    wasteCategoryId: Joi.string().guid({ version: 'uuidv4' }).required(),
    quantityKg: Joi.number().positive().max(1000).required(),
  }),
  transactionUpdate: Joi.object({
    recyclingPointId: Joi.string().guid({ version: 'uuidv4' }),
    wasteCategoryId: Joi.string().guid({ version: 'uuidv4' }),
    quantityKg: Joi.number().positive().max(1000),
  }).min(1),
  reward: Joi.object({
    name: Joi.string().pattern(plainTextRegex).required(),
    description: Joi.string().pattern(plainTextRegex).required(),
    pointsCost: Joi.number().integer().positive().required(),
    stock: Joi.number().integer().min(0).required(),
  }),
  rewardUpdate: Joi.object({
    name: Joi.string().pattern(plainTextRegex),
    description: Joi.string().pattern(plainTextRegex),
    pointsCost: Joi.number().integer().positive(),
    stock: Joi.number().integer().min(0),
  }).min(1),
  rating: Joi.object({
    userId: Joi.string().guid({ version: 'uuidv4' }).required(),
    recyclingPointId: Joi.string().guid({ version: 'uuidv4' }).required(),
    score: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().pattern(plainTextRegex).required(),
  }),
  ratingUpdate: Joi.object({
    score: Joi.number().integer().min(1).max(5),
    comment: Joi.string().pattern(plainTextRegex),
  }).min(1),
};
