import { model, Schema, Types } from "mongoose";
import { TOtp } from "./otp.interface";

const otpSchema = new Schema<TOtp>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    one_time_code: { type: String, required: true },
    expires_at: { type: Date, required: true }
}, { timestamps: true });

otpSchema.index({user:1})

export const Otp = model<TOtp>("Otp", otpSchema);


