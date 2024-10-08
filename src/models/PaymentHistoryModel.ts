import mongoose, { Document, Schema } from "mongoose";

interface PaymentHistory {
    loanId: string;
    date: string;
    status: string;
}

interface PaymentHistoryDocument extends PaymentHistory, Document {}

const PaymentHistorySchema: Schema = new Schema(
    {
        loanId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "loans",
            required: true,
        },
        date: String,
        status: String,
    },
    { versionKey: false }
);

export default mongoose.model<PaymentHistoryDocument>(
    "PaymentHistory",
    PaymentHistorySchema
);
