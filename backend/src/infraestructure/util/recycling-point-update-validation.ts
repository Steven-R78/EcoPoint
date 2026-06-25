import joi from 'joi';

export type ReturnUpdateRecyclingPointData = Partial<{
    materialId: number | null;
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    status: number;
}>;

type ValidateUpdateRecyclingPointData = {
    error: joi.ValidationError | undefined;
    value: ReturnUpdateRecyclingPointData;
};

function validateUpdateRecyclingPointData(data: unknown): ValidateUpdateRecyclingPointData {
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
            .messages({
                "string.min": "El nombre debe tener al menos 3 caracteres",
                "string.pattern.base": "El nombre contiene caracteres no permitidos",
            }),
        address: joi.string()
            .trim()
            .max(500)
            .allow("")
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s.,#-]*$/)
            .messages({
                "string.pattern.base": "La direccion contiene caracteres no permitidos",
            }),
        latitude: joi.number()
            .min(-90)
            .max(90)
            .messages({
                "number.base": "La latitud debe ser numerica",
                "number.min": "La latitud debe estar entre -90 y 90",
                "number.max": "La latitud debe estar entre -90 y 90",
            }),
        longitude: joi.number()
            .min(-180)
            .max(180)
            .messages({
                "number.base": "La longitud debe ser numerica",
                "number.min": "La longitud debe estar entre -180 y 180",
                "number.max": "La longitud debe estar entre -180 y 180",
            }),
        status: joi.number()
            .valid(0, 1)
            .messages({
                "number.base": "El estado debe ser numerico",
                "any.only": "El estado debe ser 0 o 1",
            }),
    })
        .unknown(false)
        .or("materialId", "name", "address", "latitude", "longitude", "status");

    const { error, value } = schema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
        convert: true,
    });
    return { error, value };
}

export const loadUpdateRecyclingPointData = (data: unknown): ReturnUpdateRecyclingPointData => {
    const result = validateUpdateRecyclingPointData(data);
    if (result.error) {
        const message = result.error.details.map((d) => d.message).join(", ");
        throw new Error(message);
    }
    return result.value;
};
