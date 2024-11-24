import mongoose from "mongoose";
import * as bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
      maxLength: 50,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      minLength: 6,
      maxLength: 25,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      maxLength: 64,
    },
    age: {
      type: Number,
      min: 18,
      max: 80,
    },
    gender: {
      type: String,
      enum: ["M", "F", "Others"],
    },
    photoUrl: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: 4,
      maxLength: 400,
    },
    skills: {
      type: [String],
      validate: {
        validator: function (arr: string[]) {
          return arr.length <= 25;
        },
        message: "Skills array cannot have more than 25 items",
      },
    },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;

/*
pre("save") Middleware - 
  Purpose: This is a pre-save hook in Mongoose, which runs before a document is saved to the database.
  When It's Triggered: Anytime you create or update a user document and call .save() on it, this middleware will execute.
*/
