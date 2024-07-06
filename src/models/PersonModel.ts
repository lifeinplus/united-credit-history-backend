import mongoose, { Document, Schema } from "mongoose";

interface Person {
    reportId: string;
    birthDate: string;
    clientName: string;
    dataSource: string;
    documentIssueDate: string;
    documentNumber: string;
    documentSeries: string;
}

interface PersonDocument extends Person, Document {}

const PersonSchema: Schema = new Schema(
    {
        reportId: {
            type: mongoose.SchemaTypes.ObjectId,
            ref: "reports",
            required: true,
        },
        birthDate: String,
        clientName: String,
        dataSource: {
            type: String,
            required: true,
        },
        documentIssueDate: String,
        documentNumber: String,
        documentSeries: String,
    },
    { versionKey: false }
);

export default mongoose.model<PersonDocument>(
    "Person",
    PersonSchema,
    "persons"
);
