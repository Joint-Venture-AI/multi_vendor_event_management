import { model, Schema } from "mongoose";
import { TBuyer, TBuyerModal } from "./buyer.interface";

const BuyerSchema = new Schema<TBuyer,TBuyerModal>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true ,unique: true },
    phone_number: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    image: { type: String, default: null },
    location: { type: [Number] }, // Assuming location is an array of numbers for coordinates
    }, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
BuyerSchema.index({ user: 1 });
BuyerSchema.index({location: "2dsphere"});
BuyerSchema.statics.isExistBuyerById = async function (id: string) {
    return await this.findById(id);
};
BuyerSchema.statics.isExistBuyerByPhoneNumber = async function (phone_number: string) {
    return await this.findOne({ phone_number });
};

BuyerSchema.statics.findByUserId = async function (userId: string) {
    return await this.findOne({ user: userId });
};
export const Buyer = model<TBuyer, TBuyerModal>("Buyer", BuyerSchema,"buyers");