import { HydratedDocument, Types } from "mongoose";

export interface IOrder {
    user: Types.ObjectId;
    items: Array<{
        product: Types.ObjectId;
        quantity: number;
    }>;
    subtotal: number;
    discount: number;
    total: number;
    address: string;
    instructions: string[];
    phone: string;
    paymentMethod: PaymentMethodEnum;
    orderStatus: OrderStatusEnum;
}

export enum PaymentMethodEnum {
    CASH = "cash",
    VISA = "visa"
}

export enum OrderStatusEnum {
    PENDING = "pending",
    PROCESSING = "processing",
    SHIPPED = "shipped",
    DELIVERED =  "delivered",
    CANCELED = "canceled"
}

export type HOrder = HydratedDocument<IOrder>