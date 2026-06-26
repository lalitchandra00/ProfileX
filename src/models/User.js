import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
    },

    lastName: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },

    dob: {
      type: Date,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      trim: true,
    },

    phone1: {
      type: String,
      required: [true, "Primary phone number is required"],
      trim: true,
    },

    phone2: {
      type: String,
      trim: true,
      default: "",
    },

    collegeName: {
      type: String,
      trim: true,
    },

    year: {
      type: String,
      enum: ["1st", "2nd", "3rd", "4th", "Passout"],
    },

    branch: {
      type: String,
      trim: true,
    },

    bloodGroup: {
      type: String,
      enum: [
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
      ],
    },

    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },

    work: {
      type: String,
      trim: true,
      default: "",
    },

    correspondenceAddress: {
      type: String,
      trim: true,
    },

    permanentAddress: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("User", userSchema);