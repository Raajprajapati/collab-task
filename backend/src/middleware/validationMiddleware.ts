import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationDto<T extends object>(type: new () => T) {
    return async (req: Request, res: Response, next: NextFunction) => {

        if (!req.body) {
            res.status(400).json({ error: 'No request body provided hehehe' });
            return;
        }

        const dtoInstance = plainToInstance(type, req.body, { enableImplicitConversion: true });

        // Validate the DTO instance and return error if any
        const errors: ValidationError[] = await validate(dtoInstance);

        if (errors.length > 0) {
            // If there are validation errors, return a 400 Bad Request response
            const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
            res.status(400).json({ errors: errorMessages });
            return;
        }

        // Attach the validated and transformed DTO instance to the request object
        req.body = dtoInstance;
        next();
    };
}