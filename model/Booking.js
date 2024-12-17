const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
    customer: { type: mongoose.Types.ObjectId, ref: "Auth", required: true },
    profetion: { type: mongoose.Types.ObjectId, ref: "Auth", required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    location: { type: String, required: true },
    isAccept: { type: Boolean, default: false },
}, { timestamps: true })

module.exports = mongoose.model("booking", bookingSchema)