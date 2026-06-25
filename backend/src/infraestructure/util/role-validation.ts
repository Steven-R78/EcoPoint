import joi from 'joi';

export type ReturnRoleData = {
    name: string;
    status: number;
};

function validateRoleData(data: unknown) {
    const schema = joi.object({
        name: joi.string()
            .trim()
            .min(3)
            .max(50)
            .pattern(/^[a-z]+$/)
            .required()
            .messages({
                "string.min": "El nombre debe tener al menos 3 caracteres",
                "string.pattern.base": "El nombre del rol solo puede contener letras minusculas",
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

export const loadRoleData = (data: unknown): ReturnRoleData => {
    const { error, value } = validateRoleData(data);
    if (error) {
        throw new Error(error.details.map((d) => d.message).join(", "));
    }
    return value;
};
