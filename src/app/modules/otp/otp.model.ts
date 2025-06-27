import { model, Schema, Types } from "mongoose";
import { TOtp } from "./otp.interface";

const otpSchema = new Schema<TOtp>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    is_reset_password: { type: Boolean, default: false },
    one_time_password: { type: String, required: true },
    expires_at: { type: Date, required: true }
}, { timestamps: true });

otpSchema.index({user:1})

export const Otp = model<TOtp>("Otp", otpSchema);


