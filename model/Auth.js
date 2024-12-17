const mongoose = require("mongoose");

const authSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    role: {
        type: String,
        enum: ["customer", "agencyAdmin", "plumber", "electrician", "farmer", "carpainter"],
        required: true
    },
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "Admin" },
    agencyAdminId: { type: mongoose.Schema.Types.ObjectId, ref: "Auth" },
    agencyName: { type: String },
    photo: { type: String },
    price: { type: String },
    location: { type: String },
    experience: { type: Number },
    skills: { type: [String] },
    available: { type: [String] },
    isactive: { type: Boolean, default: false },
    isBooked: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Auth", authSchema);
