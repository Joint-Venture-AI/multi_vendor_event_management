import { model, Schema } from "mongoose";
import { TUser, UserModal } from "./user.interface";
import bcrypt from "bcryptjs";
import config from "../../../config";
const userSchema = new Schema<TUser, UserModal>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value: string) => {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(value);
        },
        message: "Please provide a valid email",
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: [6, "Password must be at least 6 characters long"],
      maxlength: [50, "Password can't be more than 50 characters"],
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Full name can't be more than 100 characters"],
    },
    role: {
      type: String,
      enum: ["ADMIN", "BUYER", "SELLER"],
      default: "BUYER",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "DELETED", "INACTIVE"],
      default: "ACTIVE",
    },
    verified: {
      type: Boolean,
      default: false,
    },
    fcmToken: {
      type: String,
      default: null,
    },
    is_reset_password: {
      type: Boolean,
      default: false,
    },

    login_provider: {
      type: String,
      enum: ["GOOGLE", "APPLE", "EMAIL"],
      default: "EMAIL",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
userSchema.index({ status: 1 });
// this for better index performance
userSchema.index({ createdAt: -1 });
// this for text search in email
userSchema.index({ email: "text" });

//exist user check
userSchema.statics.isExistUserById = async (id: string) => {
  const isExist = await User.findById(id);
  return isExist;
};

userSchema.statics.isExistUserByEmail = async (email: string) => {
  const isExist = await User.findOne({ email });
  return isExist;
};

//is match password
userSchema.statics.isMatchPassword = async (
  password: string,
  hashPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(password, hashPassword);
};

//check if JWT issued before password changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = (
  passwordChangedAt: Date | null,
  jwtIssuedTimestamp: number
): boolean => {
  if (!passwordChangedAt) return false; // no change = token is valid

  const passwordChangedTime = Math.floor(passwordChangedAt.getTime() / 1000); // to match JWT iat in seconds
  return jwtIssuedTimestamp < passwordChangedTime;
};

//check user
userSchema.pre("save", async function (next) {
  //password hash
  if (!this.isModified("password")) return next(); // Only hash if changed
  this.password = await bcrypt.hash(
    this.password,
    Number(config.bcrypt_salt_rounds)
  );
  next();
});
// Remove password field from query results

userSchema.pre(/^find/, function (this: any, next) {
  if (this.getQuery && this.getProjection) {
    const projection = this.getProjection();
    if (!projection || Object.keys(projection).length === 0) {
      this.select("-password");
    }
  }
  next();
});

export const User = model<TUser, UserModal>("User", userSchema, "users");
