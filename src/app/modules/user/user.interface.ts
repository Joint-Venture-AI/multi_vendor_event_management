import { Model, Types } from "mongoose";

export type TUser = {
  email: string;
  password: string;
  role: "ADMIN" | "BUYER" | "SELLER";
  status: "ACTIVE" | "DELETED" | "INACTIVE";
  verified?: boolean;
  fcmToken?: string;
  login_provider?: "GOOGLE" | "APPLE" | "EMAIL";
};
export type UserModal = {
  isExistUserById(id: string): any;
  isExistUserByEmail(email: string): any;
  isMatchPassword(password: string, hashPassword: string): boolean;
  isJWTIssuedBeforePasswordChanged(
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number
  ): boolean;
} & Model<TUser>;

export namespace TReturnUser {
  export type Meta = {
    page: number;
    limit: number;
    totalPage: number;
    total: number;
  };

  export type getAllUser = {
    result: TUser[];
    meta?: Meta;
  };

  export type getSingleUser = TUser;
  export type updateUser = TUser;
  export type updateUserActivationStatus = TUser;

  export type updateUserRole = TUser;

  export type deleteUser = TUser;
}
