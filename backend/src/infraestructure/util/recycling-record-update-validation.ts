import joi from 'joi';

export type ReturnUpdateRecyclingRecordData = Partial<{
    userId: number;
    pointId: number;
    pointsEarned: number;
    status: number;
}>;

function validateUpdateRecyclingRecordData(data: unknown) {
    const schema = joi.object({
        userId: joi.number().integer().positive(),
        pointId: joi.number().integer().positive(),
        pointsEarned: joi.number().integer().positive(),
        status: joi.number().valid(0, 1),
    })
        .unknown(false)
        .or("userId", "pointId", "pointsEarned", "status");

    return schema.validate(data, { abortEarly: false, stripUnknown: true, convert: true });
}

export const loadUpdateRecyclingRecordData = (data: unknown): ReturnUpdateRecyclingRecordData => {
    const { error, value } = validateUpdateRecyclingRecordData(data);
    if (error) {
        throw new Error(error.details.map((d) => d.message).join(", "));
    }
    return value;
};
