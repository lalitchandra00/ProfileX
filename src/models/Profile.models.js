import mongoose, {Schema} from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    // Link to the User who owns this profile
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,   
    },


    // Personal Details
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    phone1: {
      type: String,
    },
    phone2: {
      type: String,
      default: "",
    },

    // Education
    collegeName: {
      type: String,
    },
    year: {
      type: String,
      enum: ["1st Year", "2nd Year", "3rd Year", "4th Year", "Passout"],
    },
    branch: {
      type: String,
    },

    // Other Details
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    maritalStatus: {
      type: String,
      enum: ["Single", "Married", "Divorced", "Widowed"],
    },
    work: {
      type: String,
      default: "",
    },
    correspondenceAddress: {
      type: String,
    },
    permanentAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export const Profile =  mongoose.model("Profile", profileSchema);
