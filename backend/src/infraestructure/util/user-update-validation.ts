import joi from 'joi';

export type ReturnUpdateUserData = Partial<{
    name: string;
    email: string;
    password: string;
    status: number;
    roleId: number;
}>;

type ValidateUpdateUserData = {
    error: joi.ValidationError | undefined;
    value: ReturnUpdateUserData
}

function validateUpdateUserData(data: any): ValidateUpdateUserData {
    const schema = joi.object({
        name: joi.string()
            .trim()
            .min(3)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/)
            .messages({
                "string.min": "El nombre debe tener al menos 3 caracteres",
                "string.pattern.base": "El nombre solo puede contener letras y un espacio",
            }),
        email: joi.string()
            .trim()
            .email({ tlds: { allow: false}})
            .messages({
                "string.email": "Correo electronico no valido",
            }),
        password: joi.string()
            .min(6)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
            .messages({
                "string.min": "La contraseña debe tener al menos 6 caracteres",
                "string.pattern.base": "La contraseña debe tener letras y numeros",
            }),
        status: joi.number()
            .valid(0, 1)
            .messages({
                "number.base": "El estado debe ser numerico",
                "any.only": "El estado debe ser 0 o 1",
            }),
        roleId: joi.number()
            .valid(1, 2)
            .messages({
                "number.base": "El rol debe ser numerico",
                "any.only": "El rol debe ser 1 (admin) o 2 (reciclador)",
            })
    })
    .unknown(false)
    .or("name","email","password", "status", "roleId");

    const {error, value} = schema.validate(data,{
        abortEarly:false,
        stripUnknown: true,
        convert: true,
    });
    return {error, value}
}

export const loadUpdateUserData = (data: any): ReturnUpdateUserData => {
    const result = validateUpdateUserData(data);
    if (result.error) {
        const message = result.error.details.map(d => d.message).join(", ")
        throw new Error(message);
    }
    return result.value
}