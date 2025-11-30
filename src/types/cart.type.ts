import { HydratedDocument, Types } from "mongoose";

export interface ICart {
    user: Types.ObjectId;
    items: Array<{
        product: Types.ObjectId;
        quantity: number;
    }>;
}

export type HCart = HydratedDocument<ICart>;