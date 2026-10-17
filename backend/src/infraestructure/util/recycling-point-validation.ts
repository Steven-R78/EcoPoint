import joi from 'joi';

export type ReturnRecyclingPointData = {
    materialId: number | null;
    materialIds: number[];
    name: string;
    address: string;
    latitude: number;
    longitude: number;
    status: number;
    schedule: string | null;
    photoUrl: string | null;
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
        materialIds: joi.array().items(joi.number().integer().positive()).default([]),
        schedule: joi.string().trim().max(120).allow('', null).optional(),
        photoUrl: joi.string().trim().max(500).allow('', null).optional(),
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
    const value = result.value;
    const materialIds = value.materialIds?.length
        ? value.materialIds
        : (value.materialId ? [value.materialId] : []);
    return {
        ...value,
        materialIds,
        materialId: value.materialId ?? materialIds[0] ?? null,
        schedule: value.schedule ? value.schedule : null,
        photoUrl: value.photoUrl ? value.photoUrl : null,
    };
};
