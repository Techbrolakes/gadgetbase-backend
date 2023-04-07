import { Types } from 'mongoose';

export interface IOtp {
    user_id: Types.ObjectId;
    otp: number;
    expires_in?: Date;
}

export interface IOtpDocument extends Document, IOtp {}
