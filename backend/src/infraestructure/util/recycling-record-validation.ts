import joi from 'joi';

export type ReturnRecyclingRecordData = {
    userId: number;
    pointId: number;
    pointsEarned: number;
    status: number;
};

function validateRecyclingRecordData(data: unknown) {
    const schema = joi.object({
        userId: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                "number.positive": "El usuario debe ser un ID valido",
            }),
        pointId: joi.number()
            .integer()
            .positive()
            .required()
            .messages({
                "number.positive": "El punto debe ser un ID valido",
            }),
        pointsEarned: joi.number()
            .integer()
            .positive()
            .default(50)
            .messages({
                "number.positive": "Los puntos ganados deben ser mayores a 0",
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

export const loadRecyclingRecordData = (data: unknown): ReturnRecyclingRecordData => {
    const { error, value } = validateRecyclingRecordData(data);
    if (error) {
        throw new Error(error.details.map((d) => d.message).join(", "));
    }
    return value;
};
