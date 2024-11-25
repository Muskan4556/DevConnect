import mongoose from "mongoose";

const ConnectionSchema = new mongoose.Schema(
  {
    // identity of sender and receiver user
    // status of connection (ignored, interested, accepted,rejected)

    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    status: {
      type: String,
      required: true,
      enum: ["ignored", "interested", "accepted", "rejected"],
      default: "ignored",
    },
  },
  { timestamps: true }
);

// Compound index
ConnectionSchema.index({ fromUserId: 1, toUserId: 1 }); // 1 - ascending, -1 - descending

ConnectionSchema.pre("save", async function (next) {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection to self");
  }
  next();
});

const Connection = mongoose.model("Connections", ConnectionSchema);

export type Status = "ignored" | "interested" | "accepted" | "rejected";

export default Connection;
