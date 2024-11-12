import mongoose, { Document, Schema } from "mongoose";

interface User {
    avatarName: string;
    creationDate: Date;
    firstName: string;
    lastName: string;
    username: string;
    password: string;
    refreshTokens: string[];
    roles: Record<string, number>;
}

interface UserDocument extends User, Document {}

const UserSchema: Schema = new Schema(
    {
        avatarName: { type: String },
        creationDate: { type: Date, required: true },
        firstName: { type: String },
        lastName: { type: String },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        refreshTokens: { type: [String] },
        roles: { type: Schema.Types.Mixed },
    },
    { versionKey: false }
);

export default mongoose.model<UserDocument>("User", UserSchema);
