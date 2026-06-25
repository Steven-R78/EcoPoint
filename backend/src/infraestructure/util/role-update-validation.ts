import joi from 'joi';

export type ReturnUpdateRoleData = Partial<{
    name: string;
    status: number;
}>;

function validateUpdateRoleData(data: unknown) {
    const schema = joi.object({
        name: joi.string()
            .trim()
            .min(3)
            .max(50)
            .pattern(/^[a-z]+$/)
            .messages({
                "string.pattern.base": "El nombre del rol solo puede contener letras minusculas",
            }),
        status: joi.number()
            .valid(0, 1)
            .messages({
                "any.only": "El estado debe ser 0 o 1",
            }),
    })
        .unknown(false)
        .or("name", "status");

    return schema.validate(data, { abortEarly: false, stripUnknown: true, convert: true });
}

export const loadUpdateRoleData = (data: unknown): ReturnUpdateRoleData => {
    const { error, value } = validateUpdateRoleData(data);
    if (error) {
        throw new Error(error.details.map((d) => d.message).join(", "));
    }
    return value;
};
