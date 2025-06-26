import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Secret } from "jsonwebtoken";
import config from "../../config";

import { jwtHelper } from "../../helpers/jwtHelper";
import AppError from "../errors/AppError";
import { User } from "../modules/user/user.model";

const auth =
  (...roles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tokenWithBearer = req.headers.authorization;
      if (!tokenWithBearer) {
        throw new AppError(StatusCodes.UNAUTHORIZED, "You are not authorized");
      }
      console.log(tokenWithBearer);

      if (tokenWithBearer && tokenWithBearer.startsWith("Bearer")) {
        const token = tokenWithBearer.split(" ")[1];
        //verify token
        const verifyUser = jwtHelper.verifyToken(
          token,
          config.jwt.jwt_secret as Secret
        );
        if (!verifyUser) {
          throw new AppError(StatusCodes.UNAUTHORIZED, "Invalid token");
        }

        const user = await User.findById(verifyUser.id);
        if (!user) {
          throw new AppError(StatusCodes.UNAUTHORIZED, "User not found");
        }
        //set user to header
        req.user = user;
        console.log(req.user);

        //guard user
        if (roles.length && !roles.includes(user.role)) {
          throw new AppError(
            StatusCodes.FORBIDDEN,
            "You don't have permission to access this api"
          );
        }
        next();
      }
    } catch (error) {
      next(error);
    }
  };

export default auth;
