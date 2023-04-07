import { NextFunction, Response } from 'express';
import { ExpressRequest } from '../server';

export interface IReqResNext {
    req: ExpressRequest;
    res: Response;
    next: NextFunction;
}
export interface IResponse {
    res: Response;
    code?: number;
    message?: string;
    data?: any;
    custom?: boolean;
}

export interface IResponseError {
    res: Response;
    code: number;
    error?: string;
    custom?: boolean;
}
