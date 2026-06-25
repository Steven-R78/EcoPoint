import joi from 'joi';

export type ReturnMaterialData = {
    name: string;
    category: string;
    status: number;
};

function validateMaterialData(data: unknown) {
    const schema = joi.object({
        name: joi.string()
            .trim()
            .min(2)
            .max(100)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/)
            .required()
            .messages({
                "string.min": "El nombre debe tener al menos 2 caracteres",
                "string.pattern.base": "El nombre solo puede contener letras y numeros",
            }),
        category: joi.string()
            .trim()
            .max(100)
            .allow("")
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/)
            .default("")
            .messages({
                "string.pattern.base": "La categoria contiene caracteres no permitidos",
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

export const loadMaterialData = (data: unknown): ReturnMaterialData => {
    const { error, value } = validateMaterialData(data);
    if (error) {
        throw new Error(error.details.map((d) => d.message).join(", "));
    }
    return value;
};
