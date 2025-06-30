import { StatusCodes } from "http-status-codes";
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import UserCacheManage from "./user.cacheManage";
import { TReturnUser, TUser } from "./user.interface";
import { User } from "./user.model";

const createUser = async (user: TUser): Promise<Partial<TUser>> => {

const newUserData={
  email: user.email,
  password: user.password,
  full_name: user.full_name,
  role: user.role || "BUYER",
  status: user.status || "ACTIVE",
  login_provider: user.login_provider || "EMAIL",
  fcmToken: user.fcmToken || null,
  verified: user.verified || false,
  is_reset_password: user.is_reset_password || false,
}

  const newUser = await User.create(newUserData);
   
  if (!newUser || !newUser._id) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Failed to create user");
  }
  if(newUser.role === "ADMIN" || newUser.role==="BUYER"){
    //create new buyer
  }
   
  else if(newUser.role === "SELLER"){
    //create new seller
  }


  await UserCacheManage.updateUserCache(newUser._id.toString());
  return newUser;
};
const getAllUsers = async (
  query: Record<string, unknown>
): Promise<TReturnUser.getAllUser> => {
  const cached = await UserCacheManage.getCacheListWithQuery(query);
  if (cached) return cached;

  const userQuery = new QueryBuilder(User.find(), query)
    .search(["email"])
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await userQuery.modelQuery;
  console.log(result);
  const meta = await userQuery.countTotal();
  await UserCacheManage.setCacheListWithQuery(query, { result, meta });
  return { result, meta };
};
const getUserById = async (
  id: string
): Promise<Partial<TReturnUser.getSingleUser>> => {
  // First, try to retrieve the user from cache.
  const cachedUser = await UserCacheManage.getCacheSingleUser(id);
  if (cachedUser) return cachedUser;
  // If not cached, query the database using lean with virtuals enabled.
  const user = await User.findById(id);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  // Cache the freshly retrieved user data.
  await UserCacheManage.setCacheSingleUser(id, user);
  return user;
};
const updateUser = async (
  id: string,
  updateData: Partial<TReturnUser.updateUser>
): Promise<Partial<TReturnUser.updateUser>> => {
  const user = await User.findByIdAndUpdate(id, updateData, {
    new: true,
  });
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  //remove cache
  await UserCacheManage.updateUserCache(id);

  //set new cache
  UserCacheManage.setCacheSingleUser(id, user);
  return user;
};
const updateUserActivationStatus = async (
  id: string,
  status: "ACTIVE" | "DELETED" | "INACTIVE"
): Promise<TReturnUser.updateUserActivationStatus> => {
  console.log(status);
  console.log(id);

  const user = await User.findByIdAndUpdate(
    id,
    { status: status },
    { new: true }
  );
  console.log(user);
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  //remove cache
  await UserCacheManage.updateUserCache(id);

  //set new cache
  // UserCacheManage.setCacheSingleUser(id, user);
  return user;
};
const updateUserRole = async (
  id: string,
  role: "ADMIN" | "BUYER" | "SELLER"
): Promise<Partial<TReturnUser.updateUserRole>> => {
  const user = await User.findByIdAndUpdate(
    id,
    { $set: { role } },
    { new: true }
  );
  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }
  //remove cache
  await UserCacheManage.updateUserCache(id);


  return user;
};

export const UserServices = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  updateUserActivationStatus,
  updateUserRole,
};
