import { Types } from "mongoose"

export type TOtp={
    user:Types.ObjectId;
    one_time_code: string;
    expires_at: Date;
}