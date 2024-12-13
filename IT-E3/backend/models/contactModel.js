import mongoose from "mongoose";

const contactSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User", // Reference to User model
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 
        "Please use a valid email address",
      ],
      lowercase: true, // Automatically convert to lowercase
    },
    phone: {
      type: String,
      required: true,
      match: [
        /^[0-9]{11}$/, 
        "Please enter a valid phone number",
      ],
    },
  },
  {
    timestamps: true, 
  }
);


contactSchema.index({ userId: 1 });

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;