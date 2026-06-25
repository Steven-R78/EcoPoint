import joi from 'joi';

export type ReturnUpdateMaterialData = Partial<{
    name: string;
    category: string;
    status: number;
}>;

function validateUpdateMaterialData(data: unknown) {
    const schema = joi.object({
        name: joi.string()
            .trim()
            .min(2)
            .max(100)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]+$/)
            .messages({
                "string.min": "El nombre debe tener al menos 2 caracteres",
                "string.pattern.base": "El nombre solo puede contener letras y numeros",
            }),
        category: joi.string()
            .trim()
            .max(100)
            .allow("")
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s]*$/)
            .messages({
                "string.pattern.base": "La categoria contiene caracteres no permitidos",
            }),
        status: joi.number()
            .valid(0, 1)
            .messages({
                "any.only": "El estado debe ser 0 o 1",
            }),
    })
        .unknown(false)
        .or("name", "category", "status");

    return schema.validate(data, { abortEarly: false, stripUnknown: true, convert: true });
}

export const loadUpdateMaterialData = (data: unknown): ReturnUpdateMaterialData => {
    const { error, value } = validateUpdateMaterialData(data);
    if (error) {
        throw new Error(error.details.map((d) => d.message).join(", "));
    }
    return value;
};
