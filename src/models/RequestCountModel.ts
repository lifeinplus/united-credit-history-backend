import mongoose, { Document, Schema } from "mongoose";

interface RequestCount {
    reportId: string;
    total: number;
    last24Months: number;
    last30Days: number;
    microcreditTotal: number;
    microcreditLast30Days: number;
    microcreditLastYear: number;
    microcreditMore1Year: number;
}

interface RequestCountDocument extends RequestCount, Document {}

const RequestCountSchema: Schema = new Schema(
    {
        reportId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "reports",
            required: true,
        },
        total: { type: Number, min: 0 },
        last24Months: { type: Number, min: 0 },
        last30Days: { type: Number, min: 0 },
        microcreditTotal: { type: Number, min: 0 },
        microcreditLast30Days: { type: Number, min: 0 },
        microcreditLastYear: { type: Number, min: 0 },
        microcreditMore1Year: { type: Number, min: 0 },
    },
    { versionKey: false }
);

export default mongoose.model<RequestCountDocument>(
    "RequestCount",
    RequestCountSchema
);
