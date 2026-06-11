import joi from 'joi';
import "dotenv/config";

export type ReturnEnvVars = {
    PORT: number;
}

type ValidateEnvVars = {
    error: joi.ValidationError | undefined;
    value: ReturnEnvVars;
}

function validateEnvVars(vars: NodeJS.ProcessEnv): ValidateEnvVars {
    const envVarsSchema = joi.object({
        PORT: joi.number().required(),
    }).unknown(true);
    const { error, value } = envVarsSchema.validate(vars);
    return { error, value };
}

const loadEnvVars = () : ReturnEnvVars => {
    const result = validateEnvVars(process.env);
    if (result.error) {
        throw new Error(`Invalid environment variables: ${result.error.message}`);
    }
    const value = result.value;
    return {
        PORT: value.PORT,
    }
}

const envs = loadEnvVars();
export default envs;