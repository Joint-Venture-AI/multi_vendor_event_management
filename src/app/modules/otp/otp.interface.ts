import { Types } from "mongoose"

export type TOtp={
    user:Types.ObjectId;
    is_reset_password?: boolean;
    one_time_code: string;
    expires_at: Date;
}