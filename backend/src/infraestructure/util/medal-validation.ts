import joi from 'joi';

export type ReturnMedalData = {
    name: string;
    pointsRequired: number;
    status: number;
};

function validateMedalData(data: unknown) {
    const schema = joi.object({
        name: joi.string()
            .trim()
            .min(3)
            .max(100)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/)
            .required()
            .messages({
                "string.min": "El nombre debe tener al menos 3 caracteres",
                "string.pattern.base": "El nombre solo puede contener letras y numeros",
            }),
        pointsRequired: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                "number.positive": "Los puntos requeridos deben ser mayores a 0",
            }),
        status: joi.number()
            .valid(0, 1)
            .default(1)
            .messages({
                "any.only": "El estado debe ser 0 o 1",
            }),
    }).unknown(false);

    return schema.validate(data, { abortEarly: false });
}

export const loadMedalData = (data: unknown): ReturnMedalData => {
    const { error, value } = validateMedalData(data);
    if (error) {
        throw new Error(error.details.map((d) => d.message).join(", "));
    }
    return value;
};
