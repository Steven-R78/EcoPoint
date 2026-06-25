import joi from 'joi';

export type LoginData = {
    email: string;
    password: string;
};

function validateLoginData(data: unknown): { error?: joi.ValidationError; value: LoginData } {
    const schema = joi.object({
        email: joi.string().email({ tlds: { allow: false } }).required()
            .messages({ 'string.email': 'Correo electronico no valido' }),
        password: joi.string().min(6).required()
            .messages({ 'string.min': 'La contraseña debe tener al menos 6 caracteres' }),
    }).unknown(false);

    const { error, value } = schema.validate(data, { abortEarly: false });
    return { error, value };
}

export const loadLoginData = (data: unknown): LoginData => {
    const result = validateLoginData(data);
    if (result.error) {
        throw new Error(result.error.details.map((d) => d.message).join(', '));
    }
    return result.value;
};
