import mongoose, { Document, Schema } from "mongoose";

interface User {
    creationDate: Date;
    userName: string;
    password: string;
    refreshToken: string[];
    roles: Record<string, number>;
}

interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema(
    {
        creationDate: { type: Date, required: true },
        userName: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        refreshToken: { type: [String] },
        roles: { type: Schema.Types.Mixed },
    },
    { versionKey: false }
);

export default mongoose.model<UserDocument>("User", UserSchema);
