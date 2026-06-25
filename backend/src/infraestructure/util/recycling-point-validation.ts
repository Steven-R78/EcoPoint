import joi from 'joi';

export type ReturnRecyclingPointData = {
    materialId: number | null;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    status: number;
};

type ValidateRecyclingPointData = {
    error: joi.ValidationError | undefined;
    value: ReturnRecyclingPointData;
};

function validateRecyclingPointData(data: unknown): ValidateRecyclingPointData {
    const schema = joi.object({
        materialId: joi.number()
            .integer()
            .positive()
            .allow(null)
            .messages({
                "number.base": "El material debe ser numerico",
                "number.positive": "El material debe ser un ID valido",
            }),
        name: joi.string()
            .trim()
            .min(3)
            .max(255)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]+$/)
            .required()
            .messages({
                "string.base": "El nombre debe ser un texto",
                "string.empty": "El nombre es requerido",
                "string.min": "El nombre debe tener al menos 3 caracteres",
                "string.pattern.base": "El nombre contiene caracteres no permitidos",
            }),
        address: joi.string()
            .trim()
            .max(500)
            .allow("")
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]*$/)
            .default("")
            .messages({
                "string.pattern.base": "La direccion contiene caracteres no permitidos",
            }),
        latitude: joi.number()
            .min(-90)
            .max(90)
            .required()
            .messages({
                "number.base": "La latitud debe ser numerica",
                "number.min": "La latitud debe estar entre -90 y 90",
                "number.max": "La latitud debe estar entre -90 y 90",
                "any.required": "La latitud es obligatoria",
            }),
        longitude: joi.number()
            .min(-180)
            .max(180)
            .required()
            .messages({
                "number.base": "La longitud debe ser numerica",
                "number.min": "La longitud debe estar entre -180 y 180",
                "number.max": "La longitud debe estar entre -180 y 180",
                "any.required": "La longitud es obligatoria",
            }),
        status: joi.number()
            .valid(0, 1)
            .default(1)
            .messages({
                "number.base": "El estado debe ser numerico",
                "any.only": "El estado debe ser 0 o 1",
            }),
    }).unknown(false);

    const { error, value } = schema.validate(data, { abortEarly: false });
    return { error, value };
}

export const loadRecyclingPointData = (data: unknown): ReturnRecyclingPointData => {
    const result = validateRecyclingPointData(data);
    if (result.error) {
        const message = result.error.details.map((d) => d.message).join(", ");
        throw new Error(message);
    }
    return result.value;
};
