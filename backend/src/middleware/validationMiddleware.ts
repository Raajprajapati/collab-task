import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { Request, Response, NextFunction } from 'express';

export function validationDto<T extends object>(type: new () => T) {
    console.log("Errornskdjnkjdn");
    return async (req: Request, res: Response, next: NextFunction) => {
        // Transform the plain JS object (req.body) to an instance of the DTO class
        console.log("Req body", req.body);
        const dtoInstance = plainToInstance(type, req.body, { enableImplicitConversion: true, excludeExtraneousValues: true });

        // Validate the DTO instance
        const errors: ValidationError[] = await validate(dtoInstance);

        if (errors.length > 0) {
            // If there are validation errors, return a 400 Bad Request response
            const errorMessages = errors.map(error => Object.values(error.constraints || {})).flat();
            return res.status(400).json({ errors: errorMessages });
        }

        // Attach the validated and transformed DTO instance to the request object
        req.body = dtoInstance;
        next();
    };
}