import joi from 'joi';

export type ReturnUserData = {
    name: string;
    email: string;
    password: string;
    status: number;
    roleId: number;
}

type ValidateUserData = {
    error: joi.ValidationError | undefined;
    value: ReturnUserData
}

function validateUserData(data: any): ValidateUserData {
    const schema = joi.object({
        name: joi.string()
            .trim()
            .min(3)
            .pattern(/^[A-Za-zÁÉÍÓÚáéíóúÑñ]+(?:\s[A-Za-zÁÉÍÓÚáéíóúÑñ]+)?$/)
            .required()
            .messages({
                "string.base": "El nombre debe ser un texto",
                "string.empty": "El nombre es requerido",
                "string.min": "El nombre debe tener al menos 3 caracteres",
                "string.pattern.base": "El nombre solo puede contener letras y un espacio",
            }),
        email: joi.string()
            .email({ tlds: { allow: false}})
            .required()
            .messages({
                "string.email": "Correo electronico no valido",
                "string.empty": "El correo es requerido",
            }),
        password: joi.string()
            .min(6)
            .pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/)
            .required()
            .messages({
                "string.min": "La contraseña debe tener al menos 6 caracteres",
                "string.pattern.base": "La contraseña debe tener letras y numeros",
                "string.empty": "La contraseña es requerida",
            }),
        status: joi.number()
            .valid(0, 1)
            .required()
            .messages({
                "number.base": "El estado debe ser numerico",
                "any.only": "El estado debe ser 0 o 1",
                "any.required": "El estado es obligatorio",
            }),
        roleId: joi.number()
            .valid(1, 2)
            .default(2)
            .messages({
                "number.base": "El rol debe ser numerico",
                "any.only": "El rol debe ser 1 (admin) o 2 (reciclador)",
            })
    }).unknown(false)

    const {error, value} = schema.validate(data,{abortEarly:false})
    return {error, value}
}

export const loadUserData = (data: any): ReturnUserData => {
    const result = validateUserData(data);
    if (result.error) {
        const message = result.error.details.map(d => d.message).join(", ")
        throw new Error(message);
    }
    return result.value
}