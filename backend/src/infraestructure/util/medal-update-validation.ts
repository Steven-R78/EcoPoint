import joi from 'joi';

export type ReturnUpdateMedalData = Partial<{
    name: string;
    pointsRequired: number;
    status: number;
}>;

function validateUpdateMedalData(data: unknown) {
    const schema = joi.object({
        name: joi.string()
            .trim()
            .min(3)
            .max(100)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/)
            .messages({
                "string.min": "El nombre debe tener al menos 3 caracteres",
            }),
        pointsRequired: joi.number()
            .integer()
            .positive()
            .messages({
                "number.positive": "Los puntos requeridos deben ser mayores a 0",
            }),
        status: joi.number()
            .valid(0, 1)
            .messages({
                "any.only": "El estado debe ser 0 o 1",
            }),
    })
        .unknown(false)
        .or("name", "pointsRequired", "status");

    return schema.validate(data, { abortEarly: false, stripUnknown: true, convert: true });
}

export const loadUpdateMedalData = (data: unknown): ReturnUpdateMedalData => {
    const { error, value } = validateUpdateMedalData(data);
    if (error) {
        throw new Error(error.details.map((d) => d.message).join(", "));
    }
    return value;
};
