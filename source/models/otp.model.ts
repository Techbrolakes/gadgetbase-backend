import { Schema } from 'mongoose';

export const OtpSchema: Schema = new Schema(
    {
        otp: { type: Number },
        user_id: { type: Schema.Types.ObjectId, ref: 'User' },
        expires_in: { type: Date },
    },
    { timestamps: true },
);
