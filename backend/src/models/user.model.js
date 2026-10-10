import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
        trim: true,
        maxlength: [20, "Name can not be more than 20 characters long"],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, "Give a valid email address"],
    },

    password: {
        type: String,
        required: function () {
            return this.authProvider === "local";
        },
        minlength: [6, "Password must be at least 6 characters long"],
        select: false,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    authProvider: {
        type: String,
        enum: ["local", "google"],
        default: "local",
    },
    googleId: {
        type: String,
        sparse: true, // unique not apply on this field
        unique: true,
    },
    avatar: {
        type: String, // Google photo URL or uploaded image URL
    },
}, { timestamps: true })


userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;