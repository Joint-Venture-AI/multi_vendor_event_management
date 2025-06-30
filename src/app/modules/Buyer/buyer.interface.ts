import { Model, Types } from "mongoose";
import { TUser } from "../user/user.interface";

export type TBuyer = {
  _id: Types.ObjectId;
  user: TUser;
  phone_number: string;
  full_name: string;
  image: string;
  location: number[];
};
export type TBuyerModal = {
  isExistBuyerById(id: string): any;
  isExistBuyerByPhoneNumber(phone_number: string): any;
  findByUserId(userId: string): any;
} & Model<TBuyer>;

export namespace TReturnBuyer {
  export type getAllBuyer = {
    result: TBuyer[];
    meta?: {
      page: number;
      limit: number;
      totalPage: number;
      total: number;
    };
  };

  export type getSingleBuyer = TBuyer;

  export type updateBuyer = TBuyer;

  export type deleteBuyer = TBuyer;
}
